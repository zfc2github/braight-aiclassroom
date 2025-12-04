// Pose Classification Training Application
class PoseClassifierApp {
    constructor() {
        this.classes = [];
        this.samples = {};
        this.model = null;
        this.isTraining = false;
        this.isDetecting = false;
        this.currentClassId = null;
        this.poseDetector = null;
        this.currentCameraMode = 'user';

        this.init();
    }

    async init() {
        await this.initPoseDetector();
        this.initEventListeners();
        this.initBackgroundEffect();
        await this.loadSavedData();
        this.updateStats();

        // Add default classes
        if (this.classes.length === 0) {
            this.addClass('分类 1');
            this.addClass('分类 2');
        }
        this.renderClassList();
    }

    async initPoseDetector() {
        try {
            // Initialize MoveNet pose detector
            console.log('ml5 version:', ml5.version);
            this.poseDetector = ml5.poseNet('MoveNet');
            console.log('Pose detector initialized successfully');
        } catch (error) {
            console.error('Failed to initialize pose detector:', error);
            this.showNotification('姿态检测器初始化失败', 'error');
        }
    }

    initEventListeners() {
        // Class management
        document.getElementById('add-class-btn').addEventListener('click', () => {
            this.addClass(`分类 ${this.classes.length + 1}`);
        });

        // Training controls
        document.getElementById('train-btn').addEventListener('click', () => {
            this.startTraining();
        });

        // Model usage controls
        document.getElementById('start-detection-btn').addEventListener('click', () => {
            this.toggleDetection();
        });

        document.getElementById('download-model-btn').addEventListener('click', () => {
            this.downloadModel();
        });

        // Parameter controls
        document.getElementById('epochs-slider').addEventListener('input', (e) => {
            document.getElementById('epochs-value').textContent = e.target.value;
        });

        // Modal controls
        this.initModalControls();

        // File upload
        this.initFileUpload();

        this.initDetectionFileUpload();
    }

    initModalControls() {
        // Camera modal
        document.getElementById('close-camera-modal').addEventListener('click', () => {
            this.closeCameraModal();
        });

        document.getElementById('capture-btn').addEventListener('click', () => {
            this.captureImage();
        });

        document.getElementById('switch-camera-btn').addEventListener('click', () => {
            this.switchCamera();
        });

        // Upload modal
        document.getElementById('close-upload-modal').addEventListener('click', () => {
            this.closeUploadModal();
        });

        document.getElementById('confirm-upload').addEventListener('click', () => {
            this.confirmUpload();
        });
    }

    initFileUpload() {
        const dropZone = document.getElementById('upload-drop-zone');
        const fileInput = document.getElementById('file-input');

        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-cyan-400');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-cyan-400');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-cyan-400');
            this.handleFileSelect(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });
    }

    initDetectionFileUpload() {
        const dropZone = document.getElementById('detection-upload-zone');
        const fileInput = document.getElementById('detection-file-input');

        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-cyan-400');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-cyan-400');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-cyan-400');
            this.handleDetectionFileSelect(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleDetectionFileSelect(e.target.files);
        });
    }

    // 处理检测文件选择
    handleDetectionFileSelect(files) {
        const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (fileArray.length === 0) {
            this.showNotification('请选择有效的图片文件', 'warning');
            return;
        }

        // 只处理第一张图片
        const file = fileArray[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            this.performFileDetection(e.target.result);
        };
        reader.readAsDataURL(file);
    }

// 执行文件姿态检测
    async performFileDetection(imageData) {
        if (!this.model) {
            this.showNotification('请先训练模型', 'warning');
            return;
        }

        try {
            // 显示正在处理提示
            // const resultContainer = document.getElementById('detection-result-container');
            // const predictionList = document.getElementById('detection-prediction-list');
            // predictionList.innerHTML = '<p class="text-gray-400">正在分析...</p>';
            // resultContainer.classList.remove('hidden');

            // 提取姿态特征
            const features = await this.extractPoseFeatures(imageData);

            if (features && this.model) {
                const prediction = this.model.predict(tf.tensor2d([features]));
                const probabilities = await prediction.data();

                // 显示预测结果
                this.showPredictions(probabilities);
            } else {
                // predictionList.innerHTML = '<p class="text-red-400">无法从图片中提取姿态特征</p>';
            }
        } catch (error) {
            console.error('文件检测失败:', error);
            this.showNotification('姿态检测失败', 'error');
            // document.getElementById('detection-prediction-list').innerHTML =
            //     '<p class="text-red-400">检测过程中发生错误</p>';
        }
    }

    initBackgroundEffect() {
        // P5.js background effect
        new p5((p) => {
            let particles = [];

            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent('p5-container');
                canvas.id('p5-canvas');

                // Create particles
                for (let i = 0; i < 50; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        vx: p.random(-0.5, 0.5),
                        vy: p.random(-0.5, 0.5),
                        size: p.random(1, 3),
                        opacity: p.random(0.1, 0.3)
                    });
                }
            };

            p.draw = () => {
                p.clear();

                // Draw connections
                p.stroke(6, 182, 212, 30);
                p.strokeWeight(1);
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dist = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        if (dist < 100) {
                            p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        }
                    }
                }

                // Draw and update particles
                p.noStroke();
                for (let particle of particles) {
                    p.fill(6, 182, 212, particle.opacity * 255);
                    p.circle(particle.x, particle.y, particle.size);

                    particle.x += particle.vx;
                    particle.y += particle.vy;

                    // Wrap around edges
                    if (particle.x < 0) particle.x = p.width;
                    if (particle.x > p.width) particle.x = 0;
                    if (particle.y < 0) particle.y = p.height;
                    if (particle.y > p.height) particle.y = 0;
                }
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        });
    }

    // Class Management
    addClass(name) {
        const classId = Date.now().toString();
        const classData = {
            id: classId,
            name: name,
            sampleCount: 0
        };

        this.classes.push(classData);
        this.samples[classId] = [];
        this.renderClassList();
        this.updateStats();
        this.saveData();

        // Animate new class addition
        this.animateClassAddition(classId);
    }

    editClass(classId, newName) {
        const classData = this.classes.find(c => c.id === classId);
        if (classData) {
            classData.name = newName;
            this.renderClassList();
            this.saveData();
        }
    }

    deleteClass(classId) {
        const index = this.classes.findIndex(c => c.id === classId);
        if (index > -1) {
            this.classes.splice(index, 1);
            delete this.samples[classId];
            this.renderClassList();
            this.updateStats();
            this.saveData();
            this.showNotification('分类已删除', 'success');
        }
    }

    clearClassSamples(classId) {
        if (this.samples[classId]) {
            this.samples[classId] = [];
            const classData = this.classes.find(c => c.id === classId);
            if (classData) {
                classData.sampleCount = 0;
            }
            this.renderClassList();
            this.updateStats();
            this.saveData();
            this.showNotification('样本已清空', 'success');
        }
    }

    renderClassList() {
        const container = document.getElementById('class-list');
        container.innerHTML = '';

        this.classes.forEach(classData => {
            const classElement = this.createClassElement(classData);
            container.appendChild(classElement);
        });
    }

    createClassElement(classData) {
        const element = document.createElement('div');
        element.className = 'glass-card rounded-lg p-4 hover-glow transition-all duration-300 relative z-10';
        element.dataset.classId = classData.id;

        element.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2 flex-1">
                    <span class="text-lg">🎯</span>
                    <input type="text" value="${classData.name}" 
                           class="bg-transparent border-none text-white font-medium flex-1 focus:outline-none focus:bg-gray-700 rounded px-2 py-1"
                           onchange="app.editClass('${classData.id}', this.value)">
                </div>
                <div class="relative">
                    <button class="text-gray-400 hover:text-white p-1" onclick="app.toggleDropdown('${classData.id}')">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                        </svg>
                    </button>
                    <div id="dropdown-${classData.id}" class="dropdown-menu absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
                        <button class="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 rounded-t-lg" onclick="app.openCamera('${classData.id}')">
                            📷 摄像头采集
                        </button>
                        <button class="w-full text-left px-4 py-2 text-sm hover:bg-gray-700" onclick="app.openUpload('${classData.id}')">
                            📁 上传图片
                        </button>
                        <hr class="border-gray-600">
                        <button class="w-full text-left px-4 py-2 text-sm hover:bg-gray-700" onclick="app.clearClassSamples('${classData.id}')">
                            🗑️ 清空样本
                        </button>
                        <button class="w-full text-left px-4 py-2 text-sm hover:bg-red-600 hover:text-white rounded-b-lg" onclick="app.deleteClass('${classData.id}')">
                            ❌ 删除分类
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="text-sm text-gray-400 mb-3">
                样本数量: <span class="text-cyan-400">${classData.sampleCount}</span>
            </div>
            
            <div class="sample-grid" id="samples-${classData.id}">
                ${this.renderSamples(classData.id)}
            </div>
        `;

        return element;
    }

    renderSamples(classId) {
        const samples = this.samples[classId] || [];
        return samples.map((sample, index) => `
            <div class="sample-item bg-gray-700 rounded-lg flex items-center justify-center" title="样本 ${index + 1}">
                <img src="${sample}" alt="样本" class="w-full h-full object-cover rounded-lg" onerror="this.style.display='none'">
            </div>
        `).join('');
    }

    // Sample Collection
    openCamera(classId) {
        this.currentClassId = classId;
        document.getElementById('camera-modal').classList.remove('hidden');
        this.startCamera();
    }

    closeCameraModal() {
        document.getElementById('camera-modal').classList.add('hidden');
        this.stopCamera();
    }

    async startCamera() {
        try {
            initPoseNet();
        } catch (error) {
            console.error('Failed to start camera:', error);
            this.showNotification('无法启动摄像头', 'error');
        }
    }

    stopCamera() {
        resetPoseNet();
    }

    switchCamera() {
        this.currentCameraMode = this.currentCameraMode === 'user' ? 'environment' : 'user';
        this.startCamera();
    }

    captureImage() {
        const video = document.getElementById('camera-video');
        const canvas = document.getElementById('camera-canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        this.addSample(this.currentClassId, imageData);

        // Flash effect
        this.showCaptureEffect();
    }

    showCaptureEffect() {
        const video = document.getElementById('camera-video');
        video.style.filter = 'brightness(1.5)';
        setTimeout(() => {
            video.style.filter = 'brightness(1)';
        }, 200);
    }

    openUpload(classId) {
        this.currentClassId = classId;
        document.getElementById('upload-modal').classList.remove('hidden');
        document.getElementById('upload-preview').classList.add('hidden');
    }

    closeUploadModal() {
        document.getElementById('upload-modal').classList.add('hidden');
        document.getElementById('file-input').value = '';
    }

    handleFileSelect(files) {
        const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (fileArray.length === 0) return;

        this.showUploadPreview(fileArray);
    }

    showUploadPreview(files) {
        const previewGrid = document.getElementById('preview-grid');
        previewGrid.innerHTML = '';

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'w-full h-20 object-cover rounded-lg';
                previewGrid.appendChild(img);
            };
            reader.readAsDataURL(file);
        });

        document.getElementById('upload-preview').classList.remove('hidden');
        this.pendingUploadFiles = files;
    }

    confirmUpload() {
        if (!this.pendingUploadFiles) return;

        this.pendingUploadFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.addSample(this.currentClassId, e.target.result);
            };
            reader.readAsDataURL(file);
        });

        this.closeUploadModal();
        this.showNotification(`已上传 ${this.pendingUploadFiles.length} 张图片`, 'success');
        this.pendingUploadFiles = null;
    }

    addSample(classId, imageData) {
        if (!this.samples[classId]) {
            this.samples[classId] = [];
        }

        this.samples[classId].push(imageData);
        const classData = this.classes.find(c => c.id === classId);
        if (classData) {
            classData.sampleCount = this.samples[classId].length;
        }

        this.renderClassList();
        this.updateStats();
        this.saveData();
    }

    // Training
    async startTraining() {
        if (this.isTraining) return;

        // 检查分类数量
        if (this.classes.length < 2) {
            this.showNotification('至少需要两个分类才能开始训练', 'warning');
            return;
        }

        const totalSamples = Object.values(this.samples).reduce((sum, samples) => sum + samples.length, 0);
        if (totalSamples < 4) {
            this.showNotification('至少需要4个样本才能开始训练', 'warning');
            return;
        }

        this.isTraining = true;
        document.getElementById('training-progress').classList.remove('hidden');
        document.getElementById('train-btn').disabled = true;

        try {
            await this.performTraining();
        } catch (error) {
            console.error('Training failed:', error);
            this.showNotification('训练失败', 'error');
        } finally {
            this.isTraining = false;
            document.getElementById('train-btn').disabled = false;
        }
    }

    async performTraining() {
        const epochs = parseInt(document.getElementById('epochs-slider').value);
        const learningRate = parseFloat(document.getElementById('learning-rate').value);
        const batchSize = parseInt(document.getElementById('batch-size').value);

        // Prepare training data
        const trainingData = await this.prepareTrainingData();

        // Create and train model
        this.model = this.createModel(learningRate);

        const startTime = Date.now();

        await this.model.fit(trainingData.inputs, trainingData.labels, {
            epochs: epochs,
            batchSize: batchSize,
            validationSplit: 0.2,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    const progress = ((epoch + 1) / epochs) * 100;
                    this.updateTrainingProgress(progress, logs);
                }
            }
        });

        const trainingTime = ((Date.now() - startTime) / 1000).toFixed(1);

        // Show results
        this.showTrainingResults(trainingTime);
        this.updateModelStatus('trained');
        await this.saveModel();

        this.showNotification('训练完成！', 'success');
    }

    async prepareTrainingData() {
        const inputs = [];
        const labels = [];

        for (let i = 0; i < this.classes.length; i++) {
            const classId = this.classes[i].id;
            const samples = this.samples[classId] || [];

            for (const sample of samples) {
                const features = await this.extractPoseFeatures(sample);
                if (features) {
                    inputs.push(features);
                    const label = new Array(this.classes.length).fill(0);
                    label[i] = 1;
                    labels.push(label);
                }
            }
        }

        return {
            inputs: tf.tensor2d(inputs),
            labels: tf.tensor2d(labels)
        };
    }

    async extractPoseFeatures(imageData) {
        try {
            // This is a simplified version - in real implementation,
            // you would use the pose detector to extract keypoints
            const img = new Image();
            img.src = imageData;

            return new Promise((resolve) => {
                img.onload = async () => {
                    // 使用 ml5.js PoseNet 检测姿态关键点
                    this.poseDetector.singlePose(img, (results) => {
                        if (results && results.length > 0) {
                            const pose = results[0].pose;
                            const features = this.convertKeypointsToFeatures(pose.keypoints);
                            resolve(features);
                        } else {
                            resolve(null); // 未检测到姿态
                        }
                    });
                };
            });
        } catch (error) {
            console.error('Failed to extract features:', error);
            return null;
        }
    }
    
    // 将关键点转换为特征向量
    convertKeypointsToFeatures(keypoints) {
        const features = [];

        // 提取每个关键点的坐标（归一化）
        keypoints.forEach(keypoint => {
            features.push(keypoint.position.x / 640);  // 假设图像宽度为640
            features.push(keypoint.position.y / 480); // 假设图像高度为480
        });

        return features;
    }
    
    createModel(learningRate) {
        const model = tf.sequential();

        // Input layer - 34 features from pose detection
        model.add(tf.layers.dense({
            inputShape: [34],
            units: 64,
            activation: 'relu'
        }));

        model.add(tf.layers.dropout({rate: 0.2}));

        model.add(tf.layers.dense({
            units: 32,
            activation: 'relu'
        }));

        model.add(tf.layers.dropout({rate: 0.2}));

        // Output layer - one unit per class
        model.add(tf.layers.dense({
            units: this.classes.length,
            activation: 'softmax'
        }));

        model.compile({
            optimizer: tf.train.adam(learningRate),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        return model;
    }

    updateTrainingProgress(progress, logs) {
        document.getElementById('progress-bar').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = `${Math.round(progress)}%`;
        document.getElementById('training-status').textContent =
            `训练中... Loss: ${logs.loss.toFixed(4)}, Accuracy: ${logs.acc.toFixed(4)}`;
    }

    showTrainingResults(trainingTime) {
        document.getElementById('training-results').classList.remove('hidden');
        document.getElementById('final-accuracy').textContent = '--';
        document.getElementById('training-time').textContent = `${trainingTime}秒`;
    }

    // Model Usage
    async toggleDetection() {
        if (this.isDetecting) {
            this.stopDetection();
        } else {
            await this.startDetection();
        }
    }

    async startDetection() {
        if (!this.model) {
            this.showNotification('请先训练模型', 'warning');
            return;
        }

        document.getElementById('detection-upload-zone').classList.add('hidden');
        document.getElementById('detection-video').classList.remove('hidden');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {width: 640, height: 480}
            });

            const video = document.getElementById('detection-video');
            video.srcObject = stream;

            this.isDetecting = true;
            document.getElementById('start-detection-btn').textContent = '⏹️ 停止检测';
            // document.getElementById('detection-results').classList.remove('hidden');
            // document.getElementById('no-model-message').classList.add('hidden');

            this.detectionInterval = setInterval(() => {
                this.performDetection();
            }, 1000);

        } catch (error) {
            console.error('Failed to start detection:', error);
            this.showNotification('无法启动检测', 'error');
        }
    }

    stopDetection() {
        this.isDetecting = false;

        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
        }

        document.getElementById('detection-upload-zone').classList.remove('hidden');
        document.getElementById('detection-video').classList.add('hidden');

        const video = document.getElementById('detection-video');
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }

        document.getElementById('start-detection-btn').textContent = '📷 开始实时检测（摄像头）';
        document.getElementById('prediction-list').innerHTML = '';
    }

    async performDetection() {
        const video = document.getElementById('detection-video');
        if (!video.videoWidth) return;

        // Capture current frame
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL('image/jpeg');
        const features = await this.extractPoseFeatures(imageData);

        if (features && this.model) {
            const prediction = this.model.predict(tf.tensor2d([features]));
            const probabilities = await prediction.data();

            this.showPredictions(probabilities);
        }
    }

    showPredictions(probabilities) {
        const container = document.getElementById('prediction-list');
        container.innerHTML = '';

        const predictions = [];
        for (let i = 0; i < this.classes.length; i++) {
            predictions.push({
                class: this.classes[i].name,
                probability: probabilities[i]
            });
        }

        // Sort by probability
        predictions.sort((a, b) => b.probability - a.probability);

        predictions.forEach(pred => {
            const percentage = (pred.probability * 100).toFixed(1);
            const item = document.createElement('div');
            item.className = 'flex items-center justify-between p-2 bg-gray-800 rounded-lg';
            item.innerHTML = `
                <span class="text-sm">${pred.class}</span>
                <div class="flex items-center space-x-2">
                    <div class="w-20 bg-gray-700 rounded-full h-2">
                        <div class="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" 
                             style="width: ${percentage}%"></div>
                    </div>
                    <span class="text-xs text-cyan-400 w-10">${percentage}%</span>
                </div>
            `;
            container.appendChild(item);
        });
    }

    async downloadModel() {
        if (!this.model) {
            this.showNotification('没有可下载的模型', 'warning');
            return;
        }

        try {
            const zip = new JSZip();

            // Save model architecture
            const modelJSON = this.model.toJSON();
            const modelBlob = new Blob([modelJSON], {type: 'application/json'});
            zip.file('model.json', modelBlob);

            // Save model weights as binary file
            const weights = this.model.getWeights();
            // 将权重数据打包成二进制格式
            const weightDataPromises = weights.map(w => w.data());
            const weightDataArrays = await Promise.all(weightDataPromises);

            // 合并所有权重数据到单个 ArrayBuffer
            let totalLength = 0;
            weightDataArrays.forEach(arr => {
                totalLength += arr.length * 4; // float32 每个元素4字节
            });

            const combinedBuffer = new ArrayBuffer(totalLength);
            const combinedView = new Float32Array(combinedBuffer);
            let offset = 0;

            weightDataArrays.forEach(arr => {
                combinedView.set(arr, offset);
                offset += arr.length;
            });

            // 添加权重二进制文件
            zip.file('model.weights.bin', combinedBuffer);

            // Save class information
            const classInfo = {
                classes: this.classes.map(c => ({name: c.name})),
                timestamp: new Date().toISOString()
            };
            const classInfoBlob = new Blob([JSON.stringify(classInfo, null, 2)], {type: 'application/json'});
            zip.file('classes.json', classInfoBlob);

            // Generate and download zip
            const content = await zip.generateAsync({type: 'blob'});
            const url = URL.createObjectURL(content);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'pose-classifier-model.zip';
            a.click();

            URL.revokeObjectURL(url);
            this.showNotification('模型下载成功', 'success');

        } catch (error) {
            console.error('Failed to download model:', error);
            this.showNotification('模型下载失败', 'error');
        }
    }

    // Utility Functions
    toggleDropdown(classId) {
        const dropdown = document.getElementById(`dropdown-${classId}`);
        dropdown.classList.toggle('show');

        // Close other dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (menu.id !== `dropdown-${classId}`) {
                menu.classList.remove('show');
            }
        });

        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!e.target.closest('.dropdown-menu') && !e.target.closest('[onclick*="toggleDropdown"]')) {
                    dropdown.classList.remove('show');
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 100);
    }

    updateStats() {
        const totalClasses = this.classes.length;
        const totalSamples = Object.values(this.samples).reduce((sum, samples) => sum + samples.length, 0);

        document.getElementById('total-classes').textContent = totalClasses;
        document.getElementById('total-samples').textContent = totalSamples;
    }

    updateModelStatus(status) {
        const badge = document.getElementById('status-badge');
        const detectionBtn = document.getElementById('start-detection-btn');
        const downloadBtn = document.getElementById('download-model-btn');

        switch (status) {
            case 'trained':
                badge.textContent = '已训练';
                badge.className = 'px-2 py-1 bg-green-600 text-xs rounded-full';
                detectionBtn.disabled = false;
                downloadBtn.disabled = false;
                document.getElementById('detection-results').classList.remove('hidden');
                document.getElementById('no-model-message').classList.add('hidden');
                document.getElementById('detection-video').classList.add('hidden');
                break;
            default:
                badge.textContent = '未训练';
                badge.className = 'px-2 py-1 bg-red-600 text-xs rounded-full';
                detectionBtn.disabled = true;
                downloadBtn.disabled = true;
                document.getElementById('detection-results').classList.add('hidden');
                document.getElementById('no-model-message').classList.remove('hidden');
                document.getElementById('detection-video').classList.add('hidden');
                break;
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;

        switch (type) {
            case 'success':
                notification.className += ' bg-green-600 text-white';
                break;
            case 'error':
                notification.className += ' bg-red-600 text-white';
                break;
            case 'warning':
                notification.className += ' bg-yellow-600 text-white';
                break;
            default:
                notification.className += ' bg-blue-600 text-white';
                break;
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    animateClassAddition(classId) {
        const element = document.querySelector(`[data-class-id="${classId}"]`);
        if (element) {
            anime({
                targets: element,
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 500,
                easing: 'easeOutElastic(1, .8)'
            });
        }
    }

    // Data Persistence
    saveData() {
        const data = {
            classes: this.classes,
            samples: this.samples,
            timestamp: new Date().toISOString()
        };
        //localStorage.setItem('poseClassifierData', JSON.stringify(data));
        const request = indexedDB.open('PoseClassifierDB', 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('appData')) {
                const objectStore = db.createObjectStore('appData', {keyPath: 'id'});
                objectStore.createIndex('data', 'data', {unique: false});
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['appData'], 'readwrite');
            const objectStore = transaction.objectStore('appData');

            objectStore.put({id: 'savedData', data: data});

            transaction.oncomplete = () => {
                db.close();
            };
        };

        request.onerror = (event) => {
            console.error('保存数据失败:', event.target.error);
            this.showNotification('数据保存失败', 'error');
        };
    }

    loadSavedData() {
        /*try {
            const saved = localStorage.getItem('poseClassifierData');
            if (saved) {
                const data = JSON.parse(saved);
                this.classes = data.classes || [];
                this.samples = data.samples || {};
                
                // Update sample counts
                this.classes.forEach(classData => {
                    classData.sampleCount = this.samples[classData.id]?.length || 0;
                });
            }
        } catch (error) {
            console.error('Failed to load saved data:', error);
        }*/
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('PoseClassifierDB', 1);

            request.onupgradeneeded = function (event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('appData')) {
                    const objectStore = db.createObjectStore('appData', {keyPath: 'id'});
                    objectStore.createIndex('data', 'data', {unique: false});
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['appData'], 'readonly');
                const objectStore = transaction.objectStore('appData');

                const getData = objectStore.get('savedData');

                getData.onsuccess = () => {
                    if (getData.result) {
                        const data = getData.result.data;
                        this.classes = data.classes || [];
                        this.samples = data.samples || {};

                        // 更新样本计数
                        this.classes.forEach(classData => {
                            classData.sampleCount = this.samples[classData.id]?.length || 0;
                        });
                    }
                    resolve();
                };

                transaction.oncomplete = () => {
                    db.close();
                };
            };

            request.onerror = (event) => {
                console.error('加载数据失败:', event.target.error);
                this.showNotification('数据加载失败', 'error');
                resolve(); // 即使加载失败也继续初始化
            };
        });
    }

    async saveModel() {
        if (!this.model) return;

        try {
            const saveResult = await this.model.save('localstorage://poseClassifierModel');
            console.log('Model saved:', saveResult);
        } catch (error) {
            console.error('Failed to save model:', error);
        }
    }

    /*async loadSavedModel() {
        try {
            const models = await tf.io.listModels();
            if (models['localstorage://poseClassifierModel']) {
                this.model = await tf.loadLayersModel('localstorage://poseClassifierModel');
                this.updateModelStatus('trained');
                console.log('Saved model loaded');
            }
        } catch (error) {
            console.error('Failed to load saved model:', error);
        }
    }*/
}

// Initialize application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PoseClassifierApp();
});