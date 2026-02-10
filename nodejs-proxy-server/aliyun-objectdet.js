// 阿里云目标检测-物体识别
// 安装依赖包
// npm install @alicloud/objectdet20191230
const ObjectdetClient = require('@alicloud/objectdet20191230');
const OpenapiClient = require('@alicloud/openapi-client');
const TeaUtil = require('@alicloud/tea-util');
const fs = require('fs');
const http = require('http');
const https = require('https');

let ALIBABA_CLOUD_ACCESS_KEY_ID = '';
let ALIBABA_CLOUD_ACCESS_KEY_SECRET = '';
let config = new OpenapiClient.Config({
  // 创建AccessKey ID和AccessKey Secret，请参考https://help.aliyun.com/document_detail/175144.html。
  // 如果您用的是RAM用户AccessKey，还需要为RAM用户授予权限AliyunVIAPIFullAccess，请参考https://help.aliyun.com/document_detail/145025.html。
  // 从环境变量读取配置的AccessKey ID和AccessKey Secret。运行示例前必须先配置环境变量。
  accessKeyId: ALIBABA_CLOUD_ACCESS_KEY_ID,
  accessKeySecret: ALIBABA_CLOUD_ACCESS_KEY_SECRET
});
// 访问的域名
config.endpoint = `objectdet.cn-shanghai.aliyuncs.com`;
const client = new ObjectdetClient.default(config);

async function aliyunObjectDetect(localFilePath) {
  try {
    console.log(localFilePath);
    let detectObjectAdvanceRequest = new ObjectdetClient.DetectObjectAdvanceRequest();
    detectObjectAdvanceRequest.imageURLObject = fs.createReadStream(localFilePath);
    let runtime = new TeaUtil.RuntimeOptions({ });
    const response = await client.detectObjectAdvance(detectObjectAdvanceRequest, runtime);
    return response.body.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  aliyunObjectDetect
};
