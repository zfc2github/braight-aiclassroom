// bigmodel-text2image.js
const axios = require('axios');

/**
 * 调用大模型文生图API
 * @param {Object} params - 请求参数
 * @param {string} params.prompt - 图像描述提示词
 * @param {string} params.size - 图像尺寸
 * @param {string} params.quality - 图像质量
 * @returns {Promise<string>} Base64格式的图像数据
 */
async function generateImageFromText({ prompt, size, quality }) {
    // 调用原始API
    const response = await axios.post('https://open.bigmodel.cn/api/paas/v4/images/generations', {
        model: 'cogview-3-flash',
        prompt,
        size,
        quality
    }, {
        headers: {
            'Authorization': 'Bearer 28bae30cc247454cbc7fa4f95d46632f.J9h0ShpIfZyjaz4R',
            'Content-Type': 'application/json'
        }
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
        const imageUrl = response.data.data[0].url;

        // 获取图片并转换为Base64
        const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });

        const base64Image = Buffer.from(imageResponse.data).toString('base64');
        return `data:image/png;base64,${base64Image}`;
    } else {
        throw new Error('API返回数据格式异常');
    }
}

module.exports = {
    generateImageFromText
};
