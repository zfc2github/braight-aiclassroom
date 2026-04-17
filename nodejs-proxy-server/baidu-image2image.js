const axios = require('axios');
const {json} = require("express");
// 百度凭证（仅服务器可见）
const AK = 'ngGe21KKbXpAXnnPPTimnXGo';
const SK = 'PMtFBaMY8TBTJWqKe8SbDoysqlvzf3es';

// 获取 access_token
async function getAccessToken() {
    const { data } = await axios.post(
        `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`
    );
    return data.access_token;
}

/**
 * 调用大模型文生图API
 * @param {Object} params - 请求参数
 * @param {string} params.prompt - 图像描述提示词
 * @returns {Promise<string>} Base64格式的图像数据
 */
async function generateImageFromImage({  prompt, width, height, image, change_degree }) {
    return new Promise(async (resolve, reject) => {
        // 调用原始API
        const token = await getAccessToken();
        const response = await axios.post(`https://aip.baidubce.com/rpc/2.0/ernievilg/v1/txt2imgv2?access_token=${token}`, {
            prompt,
            width,
            height,
            image,
            change_degree
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
        if (response?.data?.data && response?.data?.data.task_id) {
            console.log('task_id:', response.data.data.task_id);
            const task_id = response.data.data.task_id;
            const poll = setInterval(async () => {
                const token = await getAccessToken();
                const { data } = await axios.post(
                    `https://aip.baidubce.com/rpc/2.0/ernievilg/v1/getImgv2?access_token=${token}`,
                    { task_id },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const task_progress = data.data?.task_progress;
                const task_status = data.data?.task_status;
                console.log('task_progress:', task_progress);
                console.log('task_status:', task_status);
                console.log('data', data.data);
                if (task_progress === 1) {          // 完成
                    clearInterval(poll);
                    if (task_status === 'SUCCESS') {
                        const imgUrl = data.data.sub_task_result_list[0].final_image_list[0]?.img_url;
                        if (imgUrl) {
                            // 获取图片并转换为Base64
                            const imageResponse = await axios.get(imgUrl, {
                                responseType: 'arraybuffer'
                            });
                            const base64Image = Buffer.from(imageResponse.data).toString('base64');
                            const imageDataURI = `data:image/png;base64,${base64Image}`;

                            resolve(imageDataURI);
                        } else {
                            resolve('异常：API返回数据格式异常');
                        }
                    }
                } else  if (task_progress === 0){
                    // 继续等待
                } else {
                    // 异常
                    clearInterval(poll);
                    resolve('异常：API返回数据格式异常');
                }
            }, 1500);

        } else {
            resolve('异常：' + response?.data?.error_msg);
        }
    });

}

module.exports = {
    generateImageFromImage
};
