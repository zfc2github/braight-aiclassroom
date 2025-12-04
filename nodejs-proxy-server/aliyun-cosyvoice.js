const axios = require('axios');
const WebSocket = require('ws');
const fs = require('fs');
const uuid = require('uuid');

const API_KEY = 'sk-8e0b808d520b44eb9bb9eab67df44781';
const CLONE_URL = 'https://dashscope.aliyuncs.com/api/v1/services/audio/tts/customization';
const VOICE_LIST_URL = 'https://dashscope.aliyuncs.com/api/v1/services/audio/tts/customization';

// 声音复刻
async function speechSynthesis({ url }) {
    // 调用原始API
    const response = await axios.post(CLONE_URL,
        {
            model: 'voice-enrollment',
            input: {
                action: 'create_voice',
                target_model: 'cosyvoice-v2',
                prefix: 'biVoice',
                url: url
            }
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

    console.log(response.data);
    if (response.data) {
        return response.data;
    } else {
        throw new Error('API返回数据格式异常');
    }
}

// 语音合成
async function speechGeneration({ voice_id, text }) {
    return new Promise(async(resolve, reject) => {
        let taskStarted = false;
        let taskId = uuid.v4();

        // WebSocket服务器地址
        let url = 'wss://dashscope.aliyuncs.com/api-ws/v1/inference/';
        // 输出文件路径
        const outputFilePath = `uploadsTemp/${taskId}.mp3`;

        // 清空输出文件
        fs.writeFileSync(outputFilePath, '');

        // 1. 连接
        const ws = new WebSocket(url, {
            headers: {
                Authorization: `bearer ${API_KEY}`,
                'X-DashScope-DataInspection': 'enable'
            }
        });

        ws.on('open', () => {
            console.log('已连接到WebSocket服务器');

            // 发送run-task指令
            const runTaskMessage = JSON.stringify({
                header: {
                    action: 'run-task',
                    task_id: taskId,
                    streaming: 'duplex'
                },
                payload: {
                    task_group: 'audio',
                    task: 'tts',
                    function: 'SpeechSynthesizer',
                    model: 'cosyvoice-v2',
                    parameters: {
                        text_type: 'PlainText',
                        voice: voice_id, // 音色
                        format: 'mp3', // 音频格式
                        sample_rate: 22050, // 采样率
                        volume: 50, // 音量
                        rate: 1, // 语速
                        pitch: 1 // 音调
                    },
                    input: {}
                }
            });
            ws.send(runTaskMessage);
            console.log('已发送run-task消息');
        });

        const fileStream = fs.createWriteStream(outputFilePath, { flags: 'a' });
        ws.on('message', (data, isBinary) => {
            if (isBinary) {
                // 写入二进制数据到文件
                fileStream.write(data);
            } else {
                const message = JSON.parse(data);

                switch (message.header.event) {
                    case 'task-started':
                        taskStarted = true;
                        console.log('任务已开始');
                        // 发送continue-task指令
                        sendContinueTasks(ws, text);
                        break;
                    case 'task-finished':
                        console.log('任务已完成');
                        ws.close();
                        fileStream.end(() => {
                            console.log('文件流已关闭');
                            resolve(outputFilePath);
                        });
                        break;
                    case 'task-failed':
                        console.error('任务失败：', message.header.error_message);
                        ws.close();
                        fileStream.end(() => {
                            console.log('文件流已关闭');
                            throw new Error('任务失败');
                        });
                        break;
                    default:
                        // 可以在这里处理result-generated
                        break;
                }
            }
        });

        function sendContinueTasks(ws, text) {
            if (taskStarted) {
                const continueTaskMessage = JSON.stringify({
                    header: {
                        action: 'continue-task',
                        task_id: taskId,
                        streaming: 'duplex'
                    },
                    payload: {
                        input: {
                            text: text
                        }
                    }
                });
                ws.send(continueTaskMessage);
                console.log(`已发送continue-task，文本：${text}`);
            }

            // 发送finish-task指令
            setTimeout(() => {
                if (taskStarted) {
                    const finishTaskMessage = JSON.stringify({
                        header: {
                            action: 'finish-task',
                            task_id: taskId,
                            streaming: 'duplex'
                        },
                        payload: {
                            input: {}
                        }
                    });
                    ws.send(finishTaskMessage);
                    console.log('已发送finish-task');
                }
            }, 2000); // 在所有continue-task指令发送完毕后1秒发送
        }

        ws.on('close', () => {
            console.log('已断开与WebSocket服务器的连接');
        });
    });
}

// 音色列表
async function listVoice({ prefix }) {
    const response = await axios.post(VOICE_LIST_URL,
        {
            model: 'voice-enrollment',
            input: {
                action: 'list_voice',
                prefix: prefix
            }
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

    console.log(response.data);
    if (response.data) {
        return response.data;
    } else {
        throw new Error('API返回数据格式异常');
    }
}

module.exports = {
    speechSynthesis, speechGeneration, listVoice
};
