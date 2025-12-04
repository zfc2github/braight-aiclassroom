// 百度文字识别
const axios = require('axios');

// 百度语音识别配置
const BAIDU_API = {
    appKey: 'qB8f52of4HHjB5OQNQaITIA1',
    secretKey: 'LxZJ6xaaMUMfbnEd11QIFszoWlvg5r3w',
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
 * 调用百度文字识别API
 * @param {Object} requestBody - 请求体数据
 * @returns {Promise<Object>} 识别结果
 */
async function ocrImage(requestBody) {
    try {
        const token = await getBaiduToken();
        const body = {
            ...requestBody,
            detect_direction: 'false',
            detect_language: 'false',
            paragraph: 'false',
            probability: 'false'
        };
        //console.log('ocrImage', body);
        const {data} = await axios.post(
            'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=' + token,
            body,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'}
            }
        );

        return data;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    ocrImage
};
