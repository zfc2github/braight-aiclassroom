// baidu-speech.js
const axios = require('axios');

// 百度语音识别配置
const BAIDU_API = {
    appKey: 'TZfyNwfI7B9MIbNPlS5GEn6h',
    secretKey: 'MrkEwLFOtodcjQmPuvcuvgUNTbEjPIFW',
    cuid: 'scratch_extension_' + Date.now()
};

/**
 * 获取百度API访问token
 * @returns {Promise<string>} access_token
 */
async function getBaiduToken() {
    const {data} = await axios.post(
        'https://aip.baidubce.com/oauth/2.0/token',
        null,
        {
            params: {
                grant_type: 'client_credentials',
                client_id: BAIDU_API.appKey,
                client_secret: BAIDU_API.secretKey
            }
        }
    );
    return data.access_token;
}

/**
 * 调用百度语音识别API
 * @param {Object} requestBody - 请求体数据
 * @returns {Promise<Object>} 识别结果
 */
async function recognizeSpeech(requestBody) {
    try {
        const token = await getBaiduToken();
        const body = {
            ...requestBody,
            token,
            cuid: BAIDU_API.cuid
        };

        const {data} = await axios.post(
            'https://vop.baidu.com/server_api',
            body,
            {headers: {'Content-Type': 'application/json'}}
        );

        return data;
    } catch (e) {
        throw e;
    }
}


module.exports = {
    recognizeSpeech
};
