const axios = require('axios');
const fs = require("fs");
const crypto = require('crypto');
const path = require('path');
// 引入阿里云 SDK
const Bailian20231229 = require('@alicloud/bailian20231229');
const OpenApi = require('@alicloud/openapi-client');

let ALIBABA_CLOUD_ACCESS_KEY_ID = '';
let ALIBABA_CLOUD_ACCESS_KEY_SECRET = '';
const REGION_ID = 'cn-beijing'; // 根据实际区域调整
// 初始化 SDK 客户端
function createClient() {
    const config = new OpenApi.Config({
        accessKeyId: ALIBABA_CLOUD_ACCESS_KEY_ID,
        accessKeySecret: ALIBABA_CLOUD_ACCESS_KEY_SECRET,
        endpoint: `bailian.${REGION_ID}.aliyuncs.com`
    });
    return new Bailian20231229.default(config);
}
const categoryId = 'default';
const workspaceId = 'llm-0t2lyuw0hevoib34';
const AGENT_API_URL = 'https://dashscope.aliyuncs.com/api/v1/apps/5dd2773857e84a6a813780d629f9eba4/completion';

const API_KEY = 'sk-08cd80e6b4cc412794f1f456945d88d4';
const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

// 创意助手-创意方案生成（阿里云百炼-文本生成）
async function generateCreativeIdeas({ prompt }) {
    const response = await axios.post(API_URL,
        {
            model: 'qwen-plus',
            messages: [
                {
                    "role": "system",
                    "content": "基于以上内容（关于创意项目的描述）生成三个创意方案，要求输出json格式的内容，具体格式如下：\n```json\n{\n    \"id\": \"sldfiewfjwe\", // 随机生成一段id\n    \"title\": \"\", // 创意方案的标题\n    \"coreIdea\": \"\", // 核心创意\n    \"keyPoints\": [\"\", \"\", \"\", \"\"], // 关键要点\n    \"reason\": \"\" // 为什么有效\n}\n```\n请生成三个创意方案，并在请求中响应结果中直接输出JSON Object。"
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "response_format": {
                "type": "json_object"
            }
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

    console.log(response?.data);
    if (response?.data?.choices?.[0]?.message?.content) {
        return JSON.parse(response?.data.choices[0].message.content);
    } else {
        throw new Error('API返回数据格式异常');
    }
}

// 学习助手（阿里云百炼-文本生成）
async function generateText({ systemPrompt, userPrompt }) {
    const response = await axios.post(API_URL,
        {
            model: 'qwen-plus',
            messages: [
                {
                    "role": "system",
                    "content": systemPrompt
                },
                {
                    "role": "user",
                    "content": userPrompt
                }
            ],
            "response_format": {
                "type": "text"
            }
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

    console.log(response?.data);
    if (response?.data?.choices?.[0]?.message?.content) {
        return response?.data.choices[0].message.content;
    } else {
        return "";
    }
}

// 计算文件MD5
function calculateMD5(filePath) {
    const hash = crypto.createHash('md5');
    const buffer = fs.readFileSync(filePath);
    hash.update(buffer);
    return hash.digest('hex');
}

// 步骤1：申请上传租约（获取 session_file_id）
async function applyFileUploadLease(filePath) {
    const client = createClient();
    const fileName = path.basename(filePath);
    const fileSize = fs.statSync(filePath).size;
    const fileMd5 = calculateMD5(filePath);

    // 构建请求参数
    const applyRequest = new Bailian20231229.ApplyFileUploadLeaseRequest({
        fileName: fileName,
        sizeInBytes: fileSize,
        md5: fileMd5,
        categoryType: "SESSION_FILE",
    });
    try {
        const response = await client.applyFileUploadLease(
            categoryId,
            workspaceId,
            applyRequest);
        // SDK 返回的数据结构通常在 body 中
        // console.log('申请上传租约成功:', response.body);
        /**
         * ApplyFileUploadLeaseResponseBody {
         *   code: 'Success',
         *   data: ApplyFileUploadLeaseResponseBodyData {
         *     fileUploadLeaseId: 'b6bd1fa550de4c07a209f106d03e32fb.1773730638419',
         *     param: ApplyFileUploadLeaseResponseBodyDataParam {
         *       headers: [Object],
         *       method: 'PUT',
         *       url: 'https://dashscope-file-datacenter-prod-01.oss-cn-beijing.aliyuncs.com/1688782251082774/13442463/sessionfile/b6bd1fa550de4c07a209f106d03e32fb.1773730638419.docx?'
         *     },
         *     type: 'OSS.PreSignedUrl'
         *   },
         *   message: '',
         *   requestId: 'F7D0EB66-E44E-50F6-B156-EBED007EA9AE',
         *   status: '200',
         *   success: true
         * }
         */
        return response.body.data;
    } catch (error) {
        console.error('申请上传租约失败:', error);
        throw error;
    }
}
// 步骤2：上传文件到临时存储
async function uploadFileToTemp(leaseData, filePath) {
    const { url, headers } = leaseData?.param; // 注意 SDK 返回字段名可能是小写

    const fileBuffer = fs.readFileSync(filePath);

    // 合并 SDK 返回的 headers 和必要的 Content-Type
    const uploadHeaders = {
        'Content-Type': headers['Content-Type'] || 'application/octet-stream',
    };

    // 如果有额外的 bailian header，也加上
    if (headers['X-bailian-extra']) {
        uploadHeaders['X-bailian-extra'] = headers['X-bailian-extra'];
    }

    await axios.put(url, fileBuffer, {
        headers: uploadHeaders
    });

    return true;
}
// 步骤3：添加文件到类目（获取 file_id）
async function addFileToCategory(leaseId) {
    const client = createClient();

    const addRequest = new Bailian20231229.AddFileRequest({
        leaseId: leaseId,
        parser: 'DASHSCOPE_DOCMIND',
        categoryId,
        workspaceId: workspaceId,
        categoryType: "SESSION_FILE",
    });

    try {
        const response = await client.addFile(
            workspaceId,
            addRequest);
        // console.log('添加文件到类目成功:', response.body);
        return response.body.data.fileId;
    } catch (error) {
        console.error('添加文件到类目失败:', error);
        throw error;
    }
}
// 步骤4：查询文件状态，获取 session_file_id
async function getSessionFileId(fileId) {
    const client = createClient();
    let status = 'INIT';
    let sessionFileId = null;

    while (status !== 'PARSE_SUCCESS' && status !== 'FILE_IS_READY') {

        try {
            const response = await client.describeFile(
                workspaceId,
                fileId);
            // console.log('listFile response.body：', response.body);
            const fileData = response.body.data;

            if (!fileData) {
                throw new Error('未找到文件');
            }

            status = fileData.status;

            if (status === 'PARSE_SUCCESS' || status === 'FILE_IS_READY') {
                sessionFileId = fileData.fileId;
                break;
            } else if (status === 'INIT' || status === 'SAFE_CHECKING'  || status === 'PARSING' || status === 'INDEX_BUILDING' || status === 'INDEX_BUILD_SUCCESS') {
                await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
                throw new Error(`文件处理失败：${status}, message: ${fileData.message}`);
            }
        } catch (error) {
            console.error('查询文件状态失败:', error);
            throw error;
        }
    }

    return sessionFileId;
}

async function uploadLocalFile(filePath) {
    console.log('1. 申请上传租约...');
    const leaseData = await applyFileUploadLease(filePath);

    console.log('2. 上传文件到临时存储...');
    await uploadFileToTemp(leaseData, filePath);

    console.log('3. 添加文件到类目...');
    // console.log('leaseData:', leaseData);
    const fileId = await addFileToCategory(leaseData.fileUploadLeaseId);

    console.log('4. 等待解析完成，获取 session_file_id...');
    const sessionFileId = await getSessionFileId(fileId);

    console.log('上传完成，session_file_id:', sessionFileId);
    return sessionFileId;
}

async function generateCreativeIdeasFromAgent({ prompt, filePaths }) {
    let sessionFileIds = [];
    for (let i = 0; i < filePaths.length; i++) {
        let sessionFileId = await uploadLocalFile(filePaths[i]);
        if (sessionFileId) {
            sessionFileIds.push(sessionFileId);
        } else {
            console.log(`上传文件失败：${filePaths[i]}`);
        }
    }

    const response = await axios.post(AGENT_API_URL,
        {
            "input": {
                "prompt": prompt,
            },
            "parameters": {
                "incremental_output": false,
                "response_format": {
                    "type": "json_object"
                },
                "rag_options": {
                    "session_file_ids": sessionFileIds,
                }
            }
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

    console.log(response?.data);
    if (response?.data?.output?.text) {
        return JSON.parse(response?.data?.output?.text);
    } else {
        throw new Error('API返回数据格式异常');
    }
}

module.exports = {
    generateCreativeIdeas, generateText, generateCreativeIdeasFromAgent
};
