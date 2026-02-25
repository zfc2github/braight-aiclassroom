// 百度智能云-通用物体和场景识别
/*
{
    "result": [
        {
            "score": 0.992537,
            "root": "商品-水果",
            "keyword": "梨子"
        },
        {
            "score": 0.762133,
            "root": "植物-果实/种子",
            "keyword": "梨"
        },
        {
            "score": 0.561953,
            "root": "植物-其它",
            "keyword": "丰水梨"
        },
        {
            "score": 0.356626,
            "root": "植物-其它",
            "keyword": "酥梨"
        },
        {
            "score": 0.15774,
            "root": "植物-其它",
            "keyword": "贡梨"
        }
    ],
    "result_num": 5,
    "log_id": "2026475503753866478"
}
 */
const axios = require('axios');

// 百度语音识别配置
const BAIDU_API = {
    appKey: '5dH47i7mkLJViGMfvz1JnUuc',
    secretKey: 'W6lUQwC9PHyH6u8P6tzteTRQCM5xpfpl',
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

async function baiduObjectDetect(requestBody) {
    try {
        const token = await getBaiduToken();
        const body = {
            image: requestBody.base64
        };
        console.log('baiduObjectDetect:', body);
        const {data} = await axios.post(
            'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=' + token,
            body,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'}
            }
        );
        console.log('baiduObjectDetect:', data);
        return data;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    baiduObjectDetect
};
