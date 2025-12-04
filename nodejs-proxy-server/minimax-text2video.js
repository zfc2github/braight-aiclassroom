const axios = require('axios');
// 海螺MINIMAX 凭证（仅服务器可见）
const apiToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiLlvKDlj5HmiJAiLCJVc2VyTmFtZSI6IuW8oOWPkeaIkCIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTg0MTg5NjQzMjEzNTA4NjM2IiwiUGhvbmUiOiIxNTg1Njk2NzExNCIsIkdyb3VwSUQiOiIxOTg0MTg5NjQzMjA5MzE0MzMyIiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiIiwiQ3JlYXRlVGltZSI6IjIwMjUtMTAtMzEgMTc6NDQ6NDQiLCJUb2tlblR5cGUiOjEsImlzcyI6Im1pbmltYXgifQ.y_2nMDSBTipZtXwi7MZRbPg34jH7tpj4WGzmm7JP20ljQXufd_K5mP6Gvkke14Jbx8a8oZXEjDPVXGxqcWi6My2U-uhicNqk8PYRLLzAfHcyldhgCF9KVHv6Q41P5HWi7sEIStSGdxcg0yVfVnCEIz9u4-vsNUoSqLZPoME57ynSZ_Q0XIceJ6pzpEsm_pm1rhAMw5MNq_usFds-wlX4R44oL2-jtWTT6Hcf_DeAYV2lW4rddTkYHYyw5u8HHPnbXUXXi_8GfSHW82Vm49cLQ2tJV4jyvzyTwEEGqZlemb7oytkkZcFUDxsjmkF-pp0daZkXjZ6pZgdyltSGw_TW1A';
const baseUrl = 'https://api.minimaxi.com/v1';

/**
 * 调用海螺文生视频接口
 */
async function generateVideoFromText({prompt, duration}) {
    const response = await axios.post(`${baseUrl}/video_generation`,
        {
            model: 'MiniMax-Hailuo-2.3',
            prompt,
            duration
        }, {
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

