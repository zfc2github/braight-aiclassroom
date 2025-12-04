// app.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8602;   // 随便改，别占 8601 即可
const AICLASSROOM_URL_CONTEXT = 'https://aiclassroom.braightidea.com/nodejsProxy';

const { recognizeSpeech} = require('./baidu-speech');
const { generateImageFromText } = require('./bigmodel-text2image');
const { generateImageFromImage } = require('./baidu-image2image');
const {generateVideoFromText, queryVideoGeneration, queryFilesRetrieve} = require("./minimax-text2video");
const {generateMusicFromText} = require("./minimax-text2music");
const {speechSynthesis, speechGeneration, listVoice} = require('./aliyun-cosyvoice');
const {ocrImage} = require("./baidu-textRecog");


/* ========== 中间件 ========== */
// 1. 允许所有跨域（开发阶段够用）
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({limit: '20mb'}));


/* ========== 唯一对外接口：语音识别 ========== */
app.post('/baidu-recognize', async (req, res) => {
    try {
        const result = await recognizeSpeech(req.body);
        res.json(result);
    } catch (e) {
        const status = e.response?.status || 500;
        res.status(status).json(e.response?.data || { error: e.message });
    }
});

// 文生图
app.post('/text-to-image', async (req, res) => {
    try {
        const { prompt, size, quality } = req.body;
        const imageData = await generateImageFromText({ prompt, size, quality });
        res.json({
            success: true,
            data: imageData
        });
    } catch (error) {
        const status = e.response?.status || 500;
        res.status(status).json(e.response?.data || { error: e.message });
    }
});

// 图生图
app.post('/image-to-image', async (req, res) => {
    try {
        const { prompt, width, height, image, change_degree } = req.body;
        const imageData = await generateImageFromImage({  prompt, width, height, image, change_degree });
        if (imageData.startsWith("异常")) {
            res.json({
                success: false,
                message: imageData
            });
        } else {
            res.json({
                success: true,
                data: imageData
            });
        }
    } catch (e) {
        console.log(e);
        const status = e?.status || 500;
        res.status(status).json(e?.data || { error: e.message });
    }
});

// 文生视频
app.post('/video_generation', async (req, res) => {
    try {
        const { prompt, duration } = req.body;
        const responseData = await generateVideoFromText({ prompt, duration });
        res.json({
            success: true,
            data: responseData
        });
    } catch (e) {
        console.log(e);
        const status = e?.status || 500;
        res.status(status).json(e?.data || { error: e.message });
    }
});
app.get('/query/video_generation', async (req, res) => {
    try {
        const { task_id } = req.query;
        const responseData = await queryVideoGeneration({ task_id });
        res.json({
            success: true,
            data: responseData
        });
    } catch (e) {
        console.log(e);
        const status = e?.status || 500;
        res.status(status).json(e?.data || { error: e.message });
    }
});
app.get('/files/retrieve', async (req, res) => {
    try {
        const { file_id } = req.query;
        const responseData = await queryFilesRetrieve({ file_id });
        res.json({
            success: true,
            data: responseData
        });
    } catch (e) {
        console.log(e);
        const status = e?.status || 500;
        res.status(status).json(e?.data || { error: e.message });
    }
});

// 文生音乐
app.post('/music_generation', async (req, res) => {
    try {
        const { prompt, lyrics } = req.body;
        const responseData = await generateMusicFromText({ prompt, lyrics });
        res.json({
            success: true,
            data: responseData
        });
    } catch (e) {
        console.log(e);
        const status = e?.status || 500;
        res.status(status).json(e?.data || { error: e.message });
    }
});

// 文件上传配置
const uploadDir = path.join(__dirname, 'uploadsTemp');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB limit
    }
});
// 在静态文件服务中间件位置添加
app.use('/uploadsTemp', express.static(path.join(__dirname, 'uploadsTemp')));
// 文件上传接口
app.post('/files/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '没有上传文件'
            });
        }

        // 构建可访问的URL路径
        const fileUrl = `${AICLASSROOM_URL_CONTEXT}/uploadsTemp/${req.file.filename}`;

        res.json({
            success: true,
            data: {
                fileName: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                url: fileUrl,
                path: req.file.path
            }
        });
    } catch (error) {
        console.log(error);
        const status = error?.status || 500;
        res.status(status).json(error?.data || { error: error.message });
    }
});

// 声音复刻
app.post('/speech_synthesis', async (req, res) => {
    try {
        const { url } = req.body;
        const responseData = await speechSynthesis({ url });
        res.json({
            success: true,
            data: responseData
        });
    } catch (e) {
        console.log(e);
        const status = e?.status || 500;
        res.status(status).json(e?.data || { error: e.message });
    }
})

// 语音合成
app.post('/speech_generation', async (req, res) => {
    try {
        const { voice_id, text } = req.body;
        const filePath = await speechGeneration({ voice_id, text });
        const fileUrl = `${AICLASSROOM_URL_CONTEXT}/${filePath}`;
        res.json({
            success: true,
            data: fileUrl
        });
    } catch (e) {
        console.log(e);
        const status = e?.status || 500;
        res.status(status).json(e?.data || { error: e.message });
    }
})

// 查询自定义音色
app.post('/listVoice', async (req, res) => {
    try {
        const { prefix } = req.body;
        const customVoices = await listVoice({ prefix });
        res.json({
            success: true,
            data: customVoices
        });
    } catch (e) {
        console.log(e);
        const status = e?.status || 500;
        res.status(status).json(e?.data || { error: e.message });
    }
})

// 将语音文件转换为base64编码
app.post('/fileBase64', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '没有上传文件'
            });
        }
        // 读取文件内容并转换为base64编码
        const fileBase64 = fs.readFileSync(req.file.path).toString('base64');
        res.json({
            success: true,
            data: {
                base64: fileBase64,
                len: req.file.size
            }
        });
    } catch (error) {
        console.log(error);
        const status = error?.status || 500;
        res.status(status).json(error?.data || { error: error.message });
    }
});

// 语音识别
app.post('/speech_recognition', async (req, res) => {
    try {
        const data = await recognizeSpeech(req.body);
        res.json({
            success: true,
            data: data
        });
    } catch (e) {
        console.log(e);
        const status = e?.status || 500;
        res.status(status).json(e?.data || { error: e.message });
    }
})

// 文字识别（图片OCR）
app.post('/ocr', async (req, res) => {
    try {
        const { path } = req.body;
        const imageBase64 = fs.readFileSync(path).toString('base64');
        const data = await ocrImage({ image: imageBase64 });
        res.json({
            success: true,
            data: data
        });
    } catch (e) {
        console.log(e);
        const status = e?.status || 500;
        res.status(status).json(e?.data || { error: e.message });
    }
})


// 3. 启动
app.listen(PORT, () => {
    console.log(`✅ CORS-Proxy 已启动 → http://localhost:${PORT}`);
});