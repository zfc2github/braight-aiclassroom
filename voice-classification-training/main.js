// 声音分类训练应用主逻辑
class AudioClassificationApp {
    constructor() {
        this.categories = new Map();
        this.nextCategoryId = 3;
        this.model = null;
        this.transferRecognizer = null;
        this.isTraining = false;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioContext = null;
        this.analyser = null;
        this.microphoneStream = null;
        this.trainingChart = null;
        this.confidenceChart = null;
        this.recognizer = null;
        
        // 初始化默认分类
        this.categories.set(1, { name: '分类1', samples: [] });
        this.categories.set(2, { name: '分类2', samples: [] });
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initParticles();
        this.initAudioVisualizer();
        this.initCharts();
        this.updateUI();
    }

    setupEventListeners() {
        // 添加分类按钮
        document.getElementById('addCategoryBtn').addEventListener('click', () => {
            this.addCategory();
        });

        // 训练按钮
        document.getElementById('startTrainingBtn').addEventListener('click', () => {
            this.startTraining();
        });

        // 下载模型按钮
        document.getElementById('downloadModelBtn').addEventListener('click', () => {
            this.downloadModel();
        });

        // 麦克风开关
        document.getElementById('microphoneToggle').addEventListener('change', (e) => {
            this.toggleMicrophone(e.target.checked);
        });

        // 分类相关事件委托
        document.addEventListener('click', (e) => {
            // 编辑分类名称
            if (e.target.closest('.edit-category-btn')) {
                const categoryCard = e.target.closest('.category-card');
                this.editCategoryName(categoryCard);
            }

            // 显示分类菜单
            if (e.target.closest('.category-menu-btn')) {
                const categoryCard = e.target.closest('.category-card');
                this.toggleCategoryMenu(categoryCard);
            }

            // 清空样本
            if (e.target.closest('.clear-samples')) {
                const categoryCard = e.target.closest('.category-card');
                this.clearSamples(categoryCard);
                this.hideAllMenus();
            }

            // 删除分类
            if (e.target.closest('.delete-category')) {
                const categoryCard = e.target.closest('.category-card');
                this.deleteCategory(categoryCard);
                this.hideAllMenus();
            }

            // 麦克风按钮
            if (e.target.closest('.microphone-btn')) {
                const categoryCard = e.target.closest('.category-card');
                this.toggleRecording(categoryCard);
            }

            // 开始录制
            if (e.target.closest('.start-recording')) {
                const categoryCard = e.target.closest('.category-card');
                this.startRecording(categoryCard);
            }

            // 关闭录制
            if (e.target.closest('.close-recording')) {
                const categoryCard = e.target.closest('.category-card');
                this.closeRecording(categoryCard);
            }
        });

        // 点击其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-menu') && !e.target.closest('.category-menu-btn')) {
                this.hideAllMenus();
            }
        });
    }

    // 分类管理功能
    addCategory() {
        const categoryId = this.nextCategoryId++;
        const categoryName = `分类${categoryId}`;
        this.categories.set(categoryId, { name: categoryName, samples: [] });

        const categoriesList = document.getElementById('categoriesList');
        const newCategoryHTML = this.createCategoryHTML(categoryId, categoryName);

        categoriesList.insertAdjacentHTML('beforeend', newCategoryHTML);

        // 添加动画
        const newCard = categoriesList.lastElementChild;
        anime({
            targets: newCard,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            easing: 'easeOutQuart'
        });

        this.updateUI();
    }

    editCategoryName(categoryCard) {
        const categoryId = parseInt(categoryCard.dataset.categoryId);
        const nameSpan = categoryCard.querySelector('.category-name');
        const currentName = nameSpan.textContent;

        nameSpan.innerHTML = `<input type="text" value="${currentName}" class="bg-slate-700 text-white px-2 py-1 rounded border border-slate-600 focus:border-cyan-400 focus:outline-none">`;
        const input = nameSpan.querySelector('input');
        input.focus();
        input.select();

        const saveName = () => {
            const newName = input.value.trim();
            if (newName && newName !== currentName) {
                this.categories.get(categoryId).name = newName;
                nameSpan.textContent = newName;
            } else {
                nameSpan.textContent = currentName;
            }
        };

        input.addEventListener('blur', saveName);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveName();
            }
        });
    }

    deleteCategory(categoryCard) {
        const categoryId = parseInt(categoryCard.dataset.categoryId);

        if (this.categories.size <= 2) {
            this.showNotification('至少需要保留两个分类', 'warning');
            return;
        }

        anime({
            targets: categoryCard,
            opacity: 0,
            translateX: -300,
            duration: 400,
            easing: 'easeInQuart',
            complete: () => {
                this.categories.delete(categoryId);
                categoryCard.remove();
                this.updateUI();
            }
        });
    }

    clearSamples(categoryCard) {
        const categoryId = parseInt(categoryCard.dataset.categoryId);
        this.categories.get(categoryId).samples = [];

        const sampleCount = categoryCard.querySelector('.sample-count');
        const samplesContainer = categoryCard.querySelector('.samples-container');

        sampleCount.textContent = '0';
        samplesContainer.innerHTML = '';

        this.showNotification('样本已清空', 'success');
        this.updateUI();
    }

    toggleCategoryMenu(categoryCard) {
        const menu = categoryCard.querySelector('.dropdown-menu');
        const isVisible = !menu.classList.contains('hidden');

        this.hideAllMenus();

        if (!isVisible) {
            menu.classList.remove('hidden');
            anime({
                targets: menu,
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 200,
                easing: 'easeOutQuart'
            });
        }
    }

    hideAllMenus() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.add('hidden');
        });
    }

    // 音频录制功能
    async toggleRecording(categoryCard) {
        const recordingComponent = categoryCard.querySelector('.recording-component');
        const isVisible = !recordingComponent.classList.contains('hidden');

        if (isVisible) {
            this.closeRecording(categoryCard);
        } else {
            this.openRecording(categoryCard);
        }
    }

    openRecording(categoryCard) {
        const recordingComponent = categoryCard.querySelector('.recording-component');
        const microphoneBtn = categoryCard.querySelector('.microphone-btn');

        microphoneBtn.classList.add('recording');
        recordingComponent.classList.remove('hidden');

        anime({
            targets: recordingComponent,
            opacity: [0, 1],
            height: ['auto'],
            duration: 300,
            easing: 'easeOutQuart'
        });
    }

    closeRecording(categoryCard) {
        const recordingComponent = categoryCard.querySelector('.recording-component');
        const microphoneBtn = categoryCard.querySelector('.microphone-btn');

        microphoneBtn.classList.remove('recording');

        anime({
            targets: recordingComponent,
            opacity: 0,
            duration: 200,
            easing: 'easeInQuart',
            complete: () => {
                recordingComponent.classList.add('hidden');
                this.resetRecordingUI(categoryCard);
            }
        });
    }

    resetRecordingUI(categoryCard) {
        const progressBar = categoryCard.querySelector('.recording-progress');
        const recordingTime = categoryCard.querySelector('.recording-time');
        const startBtn = categoryCard.querySelector('.start-recording');

        progressBar.style.width = '0%';
        recordingTime.textContent = '00:00';
        startBtn.textContent = '开始录制';
        startBtn.disabled = false;
    }

    async startRecording(categoryCard) {
        const categoryId = parseInt(categoryCard.dataset.categoryId);
        const startBtn = categoryCard.querySelector('.start-recording');
        const progressBar = categoryCard.querySelector('.recording-progress');
        const recordingTime = categoryCard.querySelector('.recording-time');

        startBtn.disabled = true;
        startBtn.textContent = '录制中...';

        try {
            // 获取音频权限
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this.mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                this.addSample(categoryId, audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            // 开始录制
            this.mediaRecorder.start();

            // 2秒倒计时
            let timeLeft = 2;
            const countdown = setInterval(() => {
                timeLeft -= 0.1;
                const progress = ((2 - timeLeft) / 2) * 100;
                progressBar.style.width = `${progress}%`;
                recordingTime.textContent = `00:${Math.floor(2 - timeLeft).toString().padStart(2, '0')}`;

                if (timeLeft <= 0) {
                    clearInterval(countdown);
                    this.mediaRecorder.stop();
                    this.closeRecording(categoryCard);
                }
            }, 100);

        } catch (error) {
            console.error('录制失败:', error);
            this.showNotification('录制失败，请检查麦克风权限', 'error');
            this.closeRecording(categoryCard);
        }
    }

    addSample(categoryId, audioBlob) {
        const category = this.categories.get(categoryId);
        category.samples.push(audioBlob);

        const categoryCard = document.querySelector(`[data-category-id="${categoryId}"]`);
        const sampleCount = categoryCard.querySelector('.sample-count');
        const samplesContainer = categoryCard.querySelector('.samples-container');

        sampleCount.textContent = category.samples.length;

        // 添加样本图标
        const sampleIcon = document.createElement('div');
        sampleIcon.className = 'sample-icon';
        sampleIcon.textContent = category.samples.length;
        sampleIcon.title = `样本 ${category.samples.length}`;

        samplesContainer.appendChild(sampleIcon);

        // 添加动画
        anime({
            targets: sampleIcon,
            scale: [0, 1],
            rotate: [180, 0],
            duration: 500,
            easing: 'easeOutBack'
        });

        this.showNotification('音频样本已添加', 'success');
        this.updateUI();
    }

    // 模型训练功能
    async startTraining() {
        const totalSamples = Array.from(this.categories.values())
            .reduce((sum, category) => sum + category.samples.length, 0);

        if (totalSamples < 2) {
            this.showNotification('至少需要2个样本才能开始训练', 'warning');
            return;
        }

        this.isTraining = true;
        this.updateUI();

        const trainingProgress = document.getElementById('trainingProgress');
        const trainingStatus = document.getElementById('trainingStatus');

        trainingProgress.classList.remove('hidden');

        try {
            // 准备训练数据
            trainingStatus.textContent = '准备训练数据...';
            this.updateTrainingProgress(10);

            // 加载预训练模型
            trainingStatus.textContent = '加载预训练模型...';
            this.updateTrainingProgress(20);

            // 创建语音命令识别器
            this.recognizer = speechCommands.create('BROWSER_FFT');
            await this.recognizer.ensureModelLoaded();

            // 创建迁移学习模型
            trainingStatus.textContent = '创建迁移学习模型...';
            this.updateTrainingProgress(40);

            this.transferRecognizer = this.recognizer.createTransfer('custom-model');

            // 准备训练数据
            trainingStatus.textContent = '处理训练数据...';
            this.updateTrainingProgress(60);

            // 收集所有样本数据并添加到迁移学习模型
            for (const [categoryId, category] of this.categories) {
                const label = category.name;
                for (let i = 0; i < category.samples.length; i++) {
                    const sample = category.samples[i];
                    await this.addSampleToTransferModel(sample, label);
                }
            }

            //await Promise.all(collectPromises);

            // 训练模型
            trainingStatus.textContent = '开始训练...';
            this.updateTrainingProgress(70);

            // 开始训练
            await this.transferRecognizer.train({
                epochs: 20,
                callback: {
                    onEpochEnd: async (epoch, logs) => {
                        let progress = 70 + (epoch / 20) * 30;
                        if (progress >= 100) {
                            progress = 100;
                        }
                        trainingStatus.textContent = `训练中... Epoch ${epoch+1}/20 - Loss: ${logs.loss.toFixed(4)}, Accuracy: ${logs.acc.toFixed(4)}`;
                        this.updateTrainingProgress(progress);
                    }
                }
            });

            this.model = this.transferRecognizer;
            this.completeTraining();
            this.updateTrainingProgress(100);
            await this.toggleMicrophone(true);
        } catch (error) {
            console.error('训练失败:', error);
            this.showNotification('训练失败，请重试', 'error');
            this.resetTraining();
        }
    }

    async addSampleToTransferModel(audioBlob, word) {
        return new Promise(async (resolve, reject) => {
            try {
                // 将 Blob 转换为 ArrayBuffer
                const arrayBuffer = await audioBlob.arrayBuffer();

                // 创建临时的 AudioContext 来解码音频
                const tempAudioContext = new (window.AudioContext || window.webkitAudioContext)();
                const audioBuffer = await tempAudioContext.decodeAudioData(arrayBuffer);

                // 提取音频片段（取前1秒）
                const sampleRate = audioBuffer.sampleRate;
                const oneSecondSamples = sampleRate; // 1秒的样本数
                const channelData = audioBuffer.getChannelData(0);
                const trimmedData = channelData.slice(0, oneSecondSamples);

                // 如果数据不足1秒，用0填充
                if (trimmedData.length < oneSecondSamples) {
                    const paddedData = new Float32Array(oneSecondSamples);
                    paddedData.set(trimmedData);
                    // 剩余部分已经是0了
                }

                // 添加到迁移学习模型
                console.log(word, audioBuffer);
                await this.transferRecognizer.collectExample(word, audioBuffer);
                resolve();
            } catch (error) {
                console.error('添加样本到模型失败:', error);
                reject(error);
            }
        });
    }
    
    updateTrainingProgress(percentage) {
        const trainingPercentage = document.getElementById('trainingPercentage');
        const trainingProgressBar = document.getElementById('trainingProgressBar');
        
        trainingPercentage.textContent = `${Math.round(percentage)}%`;
        trainingProgressBar.style.width = `${percentage}%`;
        
        // 更新训练图表
        if (this.trainingChart) {
            const option = this.trainingChart.getOption();
            option.series[0].data.push(Math.round(percentage));
            option.xAxis[0].data.push(option.xAxis[0].data.length);
            this.trainingChart.setOption(option);
        }
    }
    
    completeTraining() {
        this.isTraining = false;
        
        const trainingStatus = document.getElementById('trainingStatus');
        trainingStatus.textContent = '训练完成！';
        
        this.showNotification('模型训练完成！', 'success');
        
        // 显示模型使用界面
        document.getElementById('noModelState').classList.add('hidden');
        document.getElementById('modelReadyState').classList.remove('hidden');
        document.getElementById('downloadModelBtn').disabled = false;
        
        this.updateUI();
    }
    
    resetTraining() {
        this.isTraining = false;
        document.getElementById('trainingProgress').classList.add('hidden');
        this.updateUI();
    }
    
    // 模型使用功能
    async toggleMicrophone(enable) {
        if (enable) {
            try {
                this.microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.startRealTimeDetection();
                document.getElementById('microphoneToggle').checked = true;
                this.showNotification('麦克风已开启', 'success');
            } catch (error) {
                console.error('麦克风开启失败:', error);
                this.showNotification('麦克风开启失败', 'error');
                document.getElementById('microphoneToggle').checked = false;
            }
        } else {
            this.stopRealTimeDetection();
            if (this.microphoneStream) {
                this.microphoneStream.getTracks().forEach(track => track.stop());
                this.microphoneStream = null;
            }
            this.showNotification('麦克风已关闭', 'info');
        }
    }
    
    startRealTimeDetection() {
        if (!this.model) return;
        this.performRealTimeDetection();
    }
    
    stopRealTimeDetection() {
        if (!this.model) return;
        this.model.stopListening();
    }
    
    async performRealTimeDetection() {
        if (!this.model || !this.microphoneStream) return;

        try {
            /*// 创建音频上下文
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // 创建媒体流源
            const source = this.audioContext.createMediaStreamSource(this.microphoneStream);

            // 创建分析器
            this.analyser = this.audioContext.createAnalyser();
            source.connect(this.analyser);

            // 设置分析器参数
            this.analyser.fftSize = 1024;
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            // 获取频域数据而不是时域数据
            this.analyser.getFloatFrequencyData(dataArray);

            // 转换为正确的格式
            const floatArray = new Float32Array(dataArray);

            // 进行预测
            const scores = await this.model.recognize(floatArray);
            console.log('scores:', scores);
            this.updateDetectionResults(scores);*/
            
            // 使用 speech-commands 的监听功能
            // 设置识别间隔（毫秒）
            const recognitionInterval = 1000; // 每秒识别一次

            let lastRecognitionTime = 0;
            await this.model.listen(result => {
                const currentTime = Date.now();
                // 控制识别频率
                if (currentTime - lastRecognitionTime >= recognitionInterval) {
                    console.log('识别结果:', result);
                    this.updateDetectionResults(result.scores);
                    lastRecognitionTime = currentTime;
                }
            }, {
                includeSpectrogram: true,
                probabilityThreshold: 0.6
            });
        } catch (error) {
            console.error('实时检测失败:', error);
        }
    }

    updateDetectionResults(score) {
        console.log('predictionResult:', score);
        const resultContainer = document.getElementById('resultContainer');

        // 适配不同的返回格式
        let results = [];
        if (Array.isArray(score)) {
            // 如果是数组格式
            results = score.map(item => ({
                label: item.word,
                confidence: item.probability
            }));
        } else if (score && score.scores) {
            // 如果是对象格式
            results = Object.keys(score.scores).map(label => ({
                label: this.categories.get(parseInt(label)+1).name || label,
                confidence: score.scores[label]
            }));
        } else {
            // 默认处理
            results = Object.keys(score).map(label => ({
                label: this.categories.get(parseInt(label)+1).name || label,
                confidence: score[label]
            }));
        }

        // 排序
        results.sort((a, b) => b.confidence - a.confidence);
        resultContainer.innerHTML = results.map(result => `
            <div class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span class="text-gray-200 font-medium">${result.label}</span>
                <div class="flex items-center space-x-3">
                    <div class="w-24 bg-slate-700 rounded-full h-2">
                        <div class="confidence-bar h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" 
                             style="width: ${result.confidence * 100}%"></div>
                    </div>
                    <span class="text-sm text-gray-400 w-12">${Math.round(result.confidence * 100)}%</span>
                </div>
            </div>
        `).join('');
        
        // 更新置信度图表
        this.updateConfidenceChart(results);
    }
    
    updateConfidenceChart(results) {
        if (!this.confidenceChart) return;
        
        const option = {
            title: {
                text: '分类置信度',
                textStyle: { color: '#e2e8f0', fontSize: 14 }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            xAxis: {
                type: 'category',
                data: results.map(r => r.label),
                axisLabel: { color: '#94a3b8' },
                axisLine: { lineStyle: { color: '#475569' } }
            },
            yAxis: {
                type: 'value',
                max: 1,
                axisLabel: { color: '#94a3b8' },
                axisLine: { lineStyle: { color: '#475569' } },
                splitLine: { lineStyle: { color: '#374151' } }
            },
            series: [{
                data: results.map(r => ({
                    value: r.confidence,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#06b6d4' },
                            { offset: 1, color: '#0891b2' }
                        ])
                    }
                })),
                type: 'bar',
                barWidth: '60%'
            }]
        };
        
        this.confidenceChart.setOption(option);
    }
    
    // 模型下载功能
    async downloadModel() {
        if (!this.model) {
            this.showNotification('没有可下载的模型', 'warning');
            return;
        }
        
        try {
            console.log('downloadModel...', this.transferRecognizer);

            // await this.transferRecognizer.model.save('downloads://model');
            const zip = new JSZip();
            let modelJSON = null;
            let weightData = null;

            // 使用自定义处理程序保存模型
            await this.transferRecognizer.model.save({
                save: async (artifacts) => {
                    modelJSON = JSON.stringify(artifacts.modelTopology, null, 2);
                    weightData = artifacts.weightData;

                    // 添加文件到 ZIP
                    zip.file("model.json", modelJSON);
                    zip.file("model.weights.bin", weightData);

                    // 生成并下载 ZIP 文件
                    const content = await zip.generateAsync({type: "blob"});
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = 'voice-model.zip';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    return artifacts;
                }
            });
            
            this.showNotification('模型下载成功', 'success');
        } catch (error) {
            console.error('下载失败:', error);
            this.showNotification('下载失败，请重试', 'error');
        }
    }
    
    // UI更新功能
    updateUI() {
        const totalSamples = Array.from(this.categories.values())
            .reduce((sum, category) => sum + category.samples.length, 0);
        
        const startTrainingBtn = document.getElementById('startTrainingBtn');
        startTrainingBtn.disabled = this.isTraining || totalSamples < 2;
        
        if (this.isTraining) {
            startTrainingBtn.textContent = '训练中...';
        } else if (totalSamples < 2) {
            startTrainingBtn.textContent = '至少需要2个样本';
        } else {
            startTrainingBtn.textContent = '开始训练';
        }
    }
    
    // 视觉效果初始化
    initParticles() {
        // 使用p5.js创建粒子背景
        new p5((p) => {
            let particles = [];
            
            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent('particles');
                
                // 创建粒子
                for (let i = 0; i < 50; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        vx: p.random(-1, 1),
                        vy: p.random(-1, 1),
                        size: p.random(2, 6),
                        alpha: p.random(0.1, 0.3)
                    });
                }
            };
            
            p.draw = () => {
                p.clear();
                
                // 绘制粒子
                particles.forEach(particle => {
                    p.fill(6, 182, 212, particle.alpha * 255);
                    p.noStroke();
                    p.circle(particle.x, particle.y, particle.size);
                    
                    // 更新位置
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // 边界检测
                    if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                    if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
                });
            };
            
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        });
    }
    
    initAudioVisualizer() {
        const canvas = document.getElementById('visualizerCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // 简单的音频可视化
        let audioData = new Array(64).fill(0);
        
        const animate = () => {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = canvas.width / audioData.length;
            
            audioData.forEach((value, index) => {
                const barHeight = value * canvas.height;
                
                const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
                gradient.addColorStop(0, '#06b6d4');
                gradient.addColorStop(1, '#0891b2');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(index * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
                
                // 更新音频数据（模拟）
                audioData[index] = Math.max(0, value - 0.02 + Math.random() * 0.05);
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    initCharts() {
        // 训练进度图表
        const trainingChartDom = document.getElementById('trainingChart');
        this.trainingChart = echarts.init(trainingChartDom);
        
        const trainingOption = {
            title: {
                text: '训练进度',
                textStyle: { color: '#e2e8f0', fontSize: 14 }
            },
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: [],
                axisLabel: { color: '#94a3b8' },
                axisLine: { lineStyle: { color: '#475569' } }
            },
            yAxis: {
                type: 'value',
                max: 100,
                axisLabel: { color: '#94a3b8' },
                axisLine: { lineStyle: { color: '#475569' } },
                splitLine: { lineStyle: { color: '#374151' } }
            },
            series: [{
                data: [],
                type: 'line',
                smooth: true,
                lineStyle: { color: '#06b6d4' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(6, 182, 212, 0.3)' },
                        { offset: 1, color: 'rgba(6, 182, 212, 0.1)' }
                    ])
                }
            }]
        };
        
        this.trainingChart.setOption(trainingOption);
        
        // 置信度图表
        const confidenceChartDom = document.getElementById('confidenceChart');
        this.confidenceChart = echarts.init(confidenceChartDom);
    }
    
    // 工具函数
    createCategoryHTML(id, name) {
        return `
            <div class="category-card glass-card p-4" data-category-id="${id}">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        <span class="category-name font-medium text-gray-100">${name}</span>
                        <button class="edit-category-btn text-cyan-400 hover:text-cyan-300 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="relative">
                        <button class="category-menu-btn text-gray-400 hover:text-gray-200 transition-colors">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                            </svg>
                        </button>
                        <div class="dropdown-menu absolute right-0 mt-2 w-48 py-2 hidden z-10">
                            <button class="clear-samples w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700/50 transition-colors">清空样本</button>
                            <button class="delete-category w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50 transition-colors">删除类别</button>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <button class="microphone-btn w-12 h-12 rounded-full flex items-center justify-center text-white">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                            </svg>
                        </button>
                        <div class="text-sm text-gray-400">
                            <span class="sample-count">0</span> 个样本
                        </div>
                    </div>
                    <div class="samples-container flex flex-wrap justify-end max-w-24">
                        <!-- 样本图标将在这里动态添加 -->
                    </div>
                </div>
                
                <!-- 录制组件 -->
                <div class="recording-component mt-4 hidden">
                    <div class="glass-card p-4 bg-slate-800/50">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-sm font-medium text-cyan-400">录制音频 (2秒)</span>
                            <button class="close-recording text-gray-400 hover:text-gray-200">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="flex items-center space-x-4">
                            <button class="start-recording bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                开始录制
                            </button>
                            <div class="flex-1">
                                <div class="bg-slate-700 rounded-full h-2 overflow-hidden">
                                    <div class="recording-progress bg-gradient-to-r from-red-500 to-red-400 h-full rounded-full transition-all duration-100" style="width: 0%"></div>
                                </div>
                                <div class="text-xs text-gray-400 mt-1">
                                    <span class="recording-time">00:00</span> / 00:02
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
        
        // 根据类型设置样式
        switch (type) {
            case 'success':
                notification.classList.add('bg-green-600', 'text-white');
                break;
            case 'error':
                notification.classList.add('bg-red-600', 'text-white');
                break;
            case 'warning':
                notification.classList.add('bg-yellow-600', 'text-white');
                break;
            default:
                notification.classList.add('bg-cyan-600', 'text-white');
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AudioClassificationApp();
});
