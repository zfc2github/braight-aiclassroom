const axios = require('axios');

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
                    "content": "基于以上内容（关于创意项目的描述）生成一个创意方案，要求输出json格式的内容，具体格式如下：\n\n```json\n{\n    \"id\": \"sldfiewfjwe\", // 随机生成一段id\n    \"title\": \"\", // 创意方案的标题\n    \"coreIdea\": \"\", // 核心创意\n    \"keyPoints\": [\"\", \"\", \"\", \"\"], // 关键要点\n    \"reason\": \"\" // 为什么有效\n}\n```\n\n请生成三个创意方案，并在请求中响应结果中直接输出JSON Object。"
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


module.exports = {
    generateCreativeIdeas, generateText
};
