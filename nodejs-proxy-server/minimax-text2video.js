const axios = require('axios');
// 海螺MINIMAX 凭证（仅服务器可见）
const apiToken = 'sk-api-pMCJBtoKik1KTL_bTYN041VuCdjtwVkQErMbrwBRTri0BTMuDutppgirG8Nah4QzDSZ6l1F9mS-uO9fg0jMkk2PKuYMr29gMRTqikXgkCnIWBfW8OiNMZ_k';
const baseUrl = 'https://api.minimaxi.com/v1';

/**
 * 调用海螺文生视频接口
 */
async function generateVideoFromText({prompt, duration, first_frame_image, last_frame_image}) {
    let body = {
        model: 'MiniMax-Hailuo-02',
        prompt,
        duration
    };
    if (first_frame_image) {
        body.first_frame_image = first_frame_image;
    }
    if (last_frame_image) {
        body.last_frame_image = last_frame_image;
    }
    const response = await axios.post(`${baseUrl}/video_generation`,
        body, {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
        });
    console.log(response?.data);
    return response.data;
}

async function queryVideoGeneration({task_id}) {
    const response = await axios.get(`${baseUrl}/query/video_generation?task_id=${task_id}`,
        {
            headers: {
                'Authorization': `Bearer ${apiToken}`
            },
        });
    console.log(response?.data);
    return response.data;
}

async function queryFilesRetrieve({file_id}) {
    const response = await axios.get(`${baseUrl}/files/retrieve?file_id=${file_id}`,
        {
            headers: {
                'Authorization': `Bearer ${apiToken}`
            },
        });
    console.log(response?.data);
    return response.data;
}

module.exports = {
    generateVideoFromText, queryVideoGeneration, queryFilesRetrieve
};

