// 全局变量
let currentClass = '分类1';
let dataset = {
    分类1: [],
    分类2: []
};
let model = null;
let trainingData = null;
let isTraining = false;
let cameraStream = null;
let trainingChart = null;
let chartData = {
    loss: [],
    accuracy: []
};
let dbInitialized = false;
let stream = null;
let captureInterval = null;

// 初始化应用
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 初始化数据库
        await dbManager.init();
        dbInitialized = true;
        console.log('数据库初始化完成');

        // 初始化应用
        initializeApp();
        setupEventListeners();
        await loadSavedData();
        initializeChart();

    } catch (error) {
        console.error('应用初始化失败:', error);
        showNotification('数据库初始化失败，部分功能可能无法正常使用', 'error');

        // 降级使用localStorage
        useLocalStorageFallback();
    }
});

// 降级使用localStorage的备选方案
function useLocalStorageFallback() {
    dbInitialized = false;
    console.log('使用localStorage作为备选方案');

    // 重新初始化应用
    initializeApp();
    setupEventListeners();
    loadSavedData();
    initializeChart();
}

// 初始化应用
function initializeApp() {
    // 显示欢迎动画
    anime({
        targets: '.hero-content',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutQuart'
    });

    // 初始化标签切换
    setupTabSwitching();

    console.log('AI图像分类训练平台已初始化');
}

// 设置事件监听器
function setupEventListeners() {
    // 标签切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    switchTab('dataset');
                    break;
                case '2':
                    e.preventDefault();
                    switchTab('training');
                    break;
                case '3':
                    e.preventDefault();
                    switchTab('testing');
                    break;
                case '4':
                    e.preventDefault();
                    switchTab('models');
                    break;
            }
        }
    });
}

// 标签切换功能
function setupTabSwitching() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    // 更新标签样式
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('tab-active');
        btn.style.background = 'transparent';
        btn.style.color = '#b0b0b0';
    });

    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    activeTab.classList.add('tab-active');
    activeTab.style.background = 'var(--accent)';
    activeTab.style.color = 'white';

    // 切换内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    const targetContent = document.getElementById(`${tabName}-tab`);
    targetContent.classList.remove('hidden');

    // 添加切换动画
    anime({
        targets: targetContent,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 300,
        easing: 'easeOutQuart'
    });

    // 特殊处理
    if (tabName === 'training') {
        setTimeout(() => {
            if (trainingChart) {
                trainingChart.resize();
            }
        }, 100);
    }
}

// 分类管理功能
function addClass() {
    const input = document.getElementById('new-class-input');
    const className = input.value.trim();

    if (!className) {
        showNotification('请输入分类名称', 'error');
        return;
    }

    if (dataset[className]) {
        showNotification('分类已存在', 'error');
        return;
    }

    // 添加新分类
    dataset[className] = [];

    // 创建分类元素
    const classList = document.getElementById('class-list');
    const classElement = createClassElement(className);

    classList.appendChild(classElement);

    // 添加动画
    anime({
        targets: classElement,
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 300,
        easing: 'easeOutQuart'
    });

    input.value = '';
    showNotification(`分类 "${className}" 已添加`, 'success');

    saveData();
}

// 创建分类元素
function createClassElement(className) {
    const classElement = document.createElement('div');
    classElement.className = 'class-item glass-card p-4 cursor-pointer border-2 border-blue-500 group';
    classElement.dataset.class = className;
    classElement.onclick = (e) => {
        if (!e.target.closest('.class-actions')) {
            selectClass(className);
        }
    };

    classElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 flex-1">
                <span class="class-name font-medium">${className}</span>
                <input type="text" class="class-edit-input hidden flex-1 bg-transparent border border-blue-500 rounded px-2 py-1 text-sm" 
                       value="${className}" onblur="saveClassEdit('${className}')" onkeydown="handleClassEditKeydown(event, '${className}')">
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-400 sample-count">0 样本</span>
                <div class="class-actions opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button class="edit-class-btn text-blue-400 hover:text-blue-300 p-1" 
                            onclick="editClassName('${className}', event)" title="编辑">
                        ✏️
                    </button>
                    <button class="delete-class-btn text-red-400 hover:text-red-300 p-1" 
                            onclick="deleteClass('${className}', event)" title="删除">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    `;

    return classElement;
}

// 编辑分类名称
function editClassName(className, event) {
    event.stopPropagation();

    const classElement = document.querySelector(`[data-class="${className}"]`);
    const nameSpan = classElement.querySelector('.class-name');
    const editInput = classElement.querySelector('.class-edit-input');

    // 进入编辑模式
    classElement.classList.add('editing');
    nameSpan.classList.add('hidden');
    editInput.classList.remove('hidden');
    editInput.focus();
    editInput.select();

    // 添加编辑动画
    anime({
        targets: editInput,
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 200,
        easing: 'easeOutQuart'
    });
}

// 保存分类编辑
function saveClassEdit(oldClassName) {
    const classElement = document.querySelector(`[data-class="${oldClassName}"]`);
    const nameSpan = classElement.querySelector('.class-name');
    const editInput = classElement.querySelector('.class-edit-input');
    const newClassName = editInput.value.trim();

    // 验证新名称
    if (!newClassName) {
        showNotification('分类名称不能为空', 'error');
        cancelClassEdit(oldClassName);
        return;
    }

    if (newClassName === oldClassName) {
        cancelClassEdit(oldClassName);
        return;
    }

    if (dataset[newClassName]) {
        showNotification('分类名称已存在', 'error');
        cancelClassEdit(oldClassName);
        return;
    }

    if (newClassName.length > 20) {
        showNotification('分类名称不能超过20个字符', 'error');
        cancelClassEdit(oldClassName);
        return;
    }

    // 更新数据集
    dataset[newClassName] = dataset[oldClassName];
    delete dataset[oldClassName];

    // 更新DOM
    classElement.dataset.class = newClassName;
    nameSpan.textContent = newClassName;
    editInput.value = newClassName;
    selectClass(newClassName);

    // 更新事件处理器
    classElement.onclick = (e) => {
        if (!e.target.closest('.class-actions')) {
            selectClass(newClassName);
        }
    };

    // 更新按钮事件
    const editBtn = classElement.querySelector('.edit-class-btn');
    const deleteBtn = classElement.querySelector('.delete-class-btn');
    editBtn.onclick = (e) => editClassName(newClassName, e);
    deleteBtn.onclick = (e) => deleteClass(newClassName, e);
    editInput.onblur = () => saveClassEdit(newClassName);
    editInput.onkeydown = (e) => handleClassEditKeydown(e, newClassName);

    // 如果当前选中的就是这个分类，更新currentClass
    if (currentClass === oldClassName) {
        currentClass = newClassName;
        document.getElementById('selected-class-name').textContent = newClassName;
    }

    // 退出编辑模式
    exitEditMode(classElement);

    // 保存数据
    saveData();

    showNotification(`分类已重命名为 "${newClassName}"`, 'success');
}

// 取消分类编辑
function cancelClassEdit(className) {
    const classElement = document.querySelector(`[data-class="${className}"]`);
    exitEditMode(classElement);
}

// 退出编辑模式
function exitEditMode(classElement) {
    const nameSpan = classElement.querySelector('.class-name');
    const editInput = classElement.querySelector('.class-edit-input');

    classElement.classList.remove('editing');
    nameSpan.classList.remove('hidden');
    editInput.classList.add('hidden');
}

// 处理编辑键盘事件
function handleClassEditKeydown(event, className) {
    if (event.key === 'Enter') {
        event.preventDefault();
        saveClassEdit(className);
    } else if (event.key === 'Escape') {
        event.preventDefault();
        cancelClassEdit(className);
    }
}

// 删除分类
function deleteClass(className, event) {
    event.stopPropagation();

    const sampleCount = dataset[className] ? dataset[className].length : 0;

    if (Object.keys(dataset).length <= 1) {
        showNotification('至少需要保留一个分类', 'error');
        return;
    }

    const confirmMessage = `确定要删除分类 "${className}" 吗？\n\n这将删除该分类下的 ${sampleCount} 个样本，此操作无法撤销。`;

    if (confirm(confirmMessage)) {
        const classElement = document.querySelector(`[data-class="${className}"]`);

        // 删除动画
        anime({
            targets: classElement,
            opacity: [1, 0],
            translateX: [0, -100],
            scale: [1, 0.8],
            duration: 300,
            easing: 'easeInQuart',
            complete: async () => {
                // 删除数据
                delete dataset[className];
                await dbManager.deleteDataset(className);
                console.log(dataset);

                // 如果删除的是当前选中的分类，切换到第一个可用分类
                if (currentClass === className) {
                    const remainingClasses = Object.keys(dataset);
                    if (remainingClasses.length > 0) {
                        selectClass(remainingClasses[0]);
                    }
                }

                // 移除DOM元素
                classElement.remove();

                // 保存数据
                await saveData();

                showNotification(`分类 "${className}" 已删除`, 'success');
            }
        });
    }
}

function selectClass(className) {
    currentClass = className;

    // 更新选中状态
    document.querySelectorAll('.class-item').forEach(item => {
        item.classList.remove('border-blue-500');
        item.classList.add('border-transparent');
    });

    const selectedItem = document.querySelector(`[data-class="${className}"]`);
    selectedItem.classList.add('border-blue-500');
    selectedItem.classList.remove('border-transparent');

    // 更新样本展示
    updateSampleGallery();

    // 更新选中分类名称
    document.getElementById('selected-class-name').textContent = className;

    // 添加选中动画
    anime({
        targets: selectedItem,
        scale: [1, 1.02, 1],
        duration: 200,
        easing: 'easeOutQuart'
    });
}

function updateClassStats() {
    document.querySelectorAll('.class-item').forEach(item => {
        const className = item.dataset.class;
        const count = dataset[className] ? dataset[className].length : 0;
        const countSpan = item.querySelector('.sample-count');
        if (countSpan) {
            countSpan.textContent = `${count} 样本`;
        }
    });
}

function updateSampleGallery() {
    const gallery = document.getElementById('sample-gallery');
    const samples = dataset[currentClass] || [];

    if (samples.length === 0) {
        gallery.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-400">
                <div class="text-4xl mb-4">📷</div>
                <p>分类 "${currentClass}" 还没有样本</p>
                <p class="text-sm">使用摄像头或上传图片开始收集样本</p>
            </div>
        `;
        return;
    }

    gallery.innerHTML = samples.map((sample, index) => `
        <div class="sample-item">
            <img src="${sample}" alt="样本 ${index + 1}">
            <button class="delete-btn" onclick="removeSample(${index})">×</button>
        </div>
    `).join('');

    // 添加动画
    anime({
        targets: '.sample-item',
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 300,
        delay: anime.stagger(50),
        easing: 'easeOutQuart'
    });
}

function removeSample(index) {
    //if (confirm('确定要删除这个样本吗？')) {
        dataset[currentClass].splice(index, 1);
        updateSampleGallery();
        updateClassStats();
        saveData();
        showNotification('样本已删除', 'success');
    //}
}

// 数据持久化 - 使用IndexedDB
async function saveData() {
    if (!dbInitialized) {
        // 降级使用localStorage
        localStorage.setItem('ai-classifier-dataset', JSON.stringify(dataset));
        localStorage.setItem('ai-classifier-current-class', currentClass);
        return;
    }

    try {
        // 保存当前分类设置
        await dbManager.saveSetting('currentClass', currentClass);
        console.log(dataset);

        await dbManager.clearAllData();
        // 保存所有数据集
        for (const [className, samples] of Object.entries(dataset)) {
            await dbManager.saveDataset(className, samples);
        }

        console.log('数据已保存到IndexedDB');
    } catch (error) {
        console.error('保存数据失败:', error);
        showNotification('数据保存失败', 'error');
    }
}

function updateClassStats() {
    document.querySelectorAll('.class-item').forEach(item => {
        const className = item.dataset.class;
        const count = dataset[className] ? dataset[className].length : 0;
        const countSpan = item.querySelector('.text-gray-400');
        countSpan.textContent = `${count} 样本`;
    });
}

// 摄像头功能
async function toggleCamera() {
    const container = document.getElementById('camera-container');
    const video = document.getElementById('camera-video');

    if (container.classList.contains('hidden')) {
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 300, height: 200 }
            });
            video.srcObject = cameraStream;
            container.classList.remove('hidden');

            // 添加显示动画
            anime({
                targets: container,
                opacity: [0, 1],
                height: [0, 'auto'],
                duration: 300,
                easing: 'easeOutQuart'
            });

        } catch (error) {
            showNotification('无法访问摄像头，请检查权限设置', 'error');
            console.error('Camera access error:', error);
        }
    } else {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }
        container.classList.add('hidden');
    }
}

function capturePhoto() {
    const video = document.getElementById('camera-video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    // 添加到数据集
    if (!dataset[currentClass]) {
        dataset[currentClass] = [];
    }
    dataset[currentClass].push(imageData);

    updateSampleGallery();
    updateClassStats();
    saveData();

    // 拍照动画
    anime({
        targets: video,
        scale: [1, 1.1, 1],
        duration: 200,
        easing: 'easeOutQuart'
    });

    showNotification('照片已保存', 'success');
}

// 图片上传功能
function uploadImages(event) {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    let processed = 0;

    files.forEach(file => {
        if (!file.type.startsWith('image/')) {
            showNotification(`文件 ${file.name} 不是图片格式`, 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            if (!dataset[currentClass]) {
                dataset[currentClass] = [];
            }
            dataset[currentClass].push(e.target.result);

            processed++;
            if (processed === files.length) {
                updateSampleGallery();
                updateClassStats();
                saveData();
                showNotification(`已上传 ${files.length} 张图片`, 'success');
            }
        };
        reader.readAsDataURL(file);
    });

    event.target.value = '';
}

// 模型训练功能
async function initializeModel() {
    //if (model) return model;

    try {
        // 使用MobileNet作为基础模型
        const mobilenet = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

        // 获取预训练模型的输出层
        const layer = mobilenet.getLayer('conv_pw_13_relu');
        const pretrainedModel = tf.model({
            inputs: mobilenet.inputs,
            outputs: layer.output
        });

        // 构建新模型
        const newModel = tf.sequential();
        newModel.add(pretrainedModel);
        newModel.add(tf.layers.globalAveragePooling2d({ inputShape: [7, 7, 256] }));
        newModel.add(tf.layers.dense({ units: 128, activation: 'relu' }));
        newModel.add(tf.layers.dropout({ rate: 0.2 }));
        newModel.add(tf.layers.dense({
            units: Object.keys(dataset).length || 2,
            activation: 'softmax'
        }));

        // 编译模型
        newModel.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        model = newModel;
        return model;
    } catch (error) {
        console.error('Model initialization error:', error);
        showNotification('模型初始化失败', 'error');
        throw error;
    }
}

async function prepareTrainingData() {
    const classes = Object.keys(dataset);
    const numClasses = classes.length;

    if (numClasses < 2) {
        throw new Error('至少需要2个分类才能开始训练');
    }

    const allImages = [];
    const allLabels = [];

    for (let i = 0; i < classes.length; i++) {
        const className = classes[i];
        const images = dataset[className];

        if (images.length === 0) {
            throw new Error(`分类 "${className}" 没有样本`);
        }

        for (const imageData of images) {
            allImages.push(imageData);
            allLabels.push(i);
        }
    }

    // 预处理图像数据
    const imageTensors = [];
    for (const imageData of allImages) {
        const img = new Image();
        img.src = imageData;
        await new Promise(resolve => img.onload = resolve);

        const tensor = tf.browser.fromPixels(img)
            .resizeNearestNeighbor([224, 224])
            .expandDims(0)
            .toFloat()
            .div(255.0);

        imageTensors.push(tensor);
    }

    const xs = tf.concat(imageTensors);
    const ys = tf.oneHot(tf.tensor1d(allLabels, 'int32'), numClasses);

    let rs = { xs, ys, numClasses };
    console.log('{ xs, ys, numClasses }: ', rs);
    return rs;
}

async function startTraining() {
    if (isTraining) return;

    try {
        isTraining = true;

        // 更新UI
        document.getElementById('start-training').classList.add('hidden');
        document.getElementById('stop-training').classList.remove('hidden');
        document.getElementById('training-status').textContent = '正在准备训练数据...';

        // 初始化模型
        await initializeModel();

        // 准备训练数据
        trainingData = await prepareTrainingData();
        console.log('trainingData:', trainingData);

        // 更新模型输出层
        if (model.layers[model.layers.length - 1].units !== trainingData.numClasses) {
            model.pop();
            model.add(tf.layers.dense({
                units: trainingData.numClasses,
                activation: 'softmax'
            }));
            model.compile({
                optimizer: tf.train.adam(parseFloat(document.getElementById('learning-rate').value)),
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            });
        }

        // 获取训练参数
        const epochs = parseInt(document.getElementById('epochs').value);
        const batchSize = parseInt(document.getElementById('batch-size').value);
        const validationSplit = parseFloat(document.getElementById('validation-split').value);

        // 开始训练
        document.getElementById('training-status').textContent = '开始训练...';

        // 重置图表数据
        chartData.loss = [];
        chartData.accuracy = [];

        await model.fit(trainingData.xs, trainingData.ys, {
            epochs: epochs,
            batchSize: batchSize,
            validationSplit: validationSplit,
            callbacks: {
                onEpochBegin: function(epoch) {
                    document.getElementById('training-status').textContent =
                        `训练中... 第 ${epoch + 1}/${epochs} 轮`;
                },
                onEpochEnd: function(epoch, logs) {
                    // 更新进度
                    const progress = ((epoch + 1) / epochs) * 100;
                    document.getElementById('progress-fill').style.width = `${progress}%`;
                    document.getElementById('progress-text').textContent = `${Math.round(progress)}%`;

                    // 更新指标
                    document.getElementById('loss-value').textContent = logs.loss.toFixed(4);
                    document.getElementById('accuracy-value').textContent = (logs.acc * 100).toFixed(1) + '%';

                    // 更新图表数据
                    chartData.loss.push(logs.loss);
                    chartData.accuracy.push(logs.acc);
                    updateTrainingChart();
                },
                onTrainEnd: function() {
                    document.getElementById('training-status').textContent = '训练完成！';
                    document.getElementById('model-status').textContent = '已训练';
                    document.getElementById('model-updated').textContent = new Date().toLocaleString();

                    // 更新模型信息
                    updateModelInfo();

                    // 保存训练历史
                    saveTrainingHistory();

                    showNotification('模型训练完成！', 'success');

                    // 庆祝动画
                    celebrateTrainingComplete();
                }
            }
        });

    } catch (error) {
        console.error('Training error:', error);
        showNotification('训练失败: ' + error.message, 'error');
    } finally {
        isTraining = false;
        document.getElementById('start-training').classList.remove('hidden');
        document.getElementById('stop-training').classList.add('hidden');
    }
}

function stopTraining() {
    if (isTraining) {
        isTraining = false;
        document.getElementById('training-status').textContent = '训练已停止';
        showNotification('训练已停止', 'warning');
    }
}

function resetModel() {
    if (confirm('确定要重置模型吗？这将清除所有训练进度。')) {
        model = null;
        trainingData = null;
        chartData.loss = [];
        chartData.accuracy = [];

        // 重置UI
        document.getElementById('progress-fill').style.width = '0%';
        document.getElementById('progress-text').textContent = '0%';
        document.getElementById('loss-value').textContent = '0.000';
        document.getElementById('accuracy-value').textContent = '0.0%';
        document.getElementById('training-status').textContent = '等待开始训练...';
        document.getElementById('model-status').textContent = '未训练';

        updateTrainingChart();
        showNotification('模型已重置', 'success');
    }
}

// 图表功能
function initializeChart() {
    const chartDom = document.getElementById('training-chart');
    trainingChart = echarts.init(chartDom);

    const option = {
        backgroundColor: 'transparent',
        title: {
            text: '训练指标',
            textStyle: {
                color: '#ffffff',
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(58, 58, 58, 0.9)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            textStyle: {
                color: '#ffffff'
            }
        },
        legend: {
            data: ['损失值', '准确率'],
            textStyle: {
                color: '#b0b0b0'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLine: {
                lineStyle: {
                    color: '#3a3a3a'
                }
            },
            axisLabel: {
                color: '#b0b0b0'
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '损失值',
                position: 'left',
                axisLine: {
                    lineStyle: {
                        color: '#4a9eff'
                    }
                },
                axisLabel: {
                    color: '#b0b0b0'
                }
            },
            {
                type: 'value',
                name: '准确率',
                position: 'right',
                axisLine: {
                    lineStyle: {
                        color: '#4caf50'
                    }
                },
                axisLabel: {
                    color: '#b0b0b0',
                    formatter: '{value}%'
                }
            }
        ],
        series: [
            {
                name: '损失值',
                type: 'line',
                yAxisIndex: 0,
                data: [],
                lineStyle: {
                    color: '#4a9eff'
                },
                itemStyle: {
                    color: '#4a9eff'
                }
            },
            {
                name: '准确率',
                type: 'line',
                yAxisIndex: 1,
                data: [],
                lineStyle: {
                    color: '#4caf50'
                },
                itemStyle: {
                    color: '#4caf50'
                }
            }
        ]
    };

    trainingChart.setOption(option);
}

function updateTrainingChart() {
    if (!trainingChart) return;

    const epochs = Array.from({length: chartData.loss.length}, (_, i) => i + 1);

    trainingChart.setOption({
        xAxis: {
            data: epochs
        },
        series: [
            {
                data: chartData.loss
            },
            {
                data: chartData.accuracy.map(acc => acc * 100)
            }
        ]
    });
}

// 参数更新函数
function updateLearningRate(value) {
    document.getElementById('learning-rate-value').textContent = value;
}

function updateEpochs(value) {
    document.getElementById('epochs-value').textContent = value;
}

function updateValidationSplit(value) {
    document.getElementById('validation-split-value').textContent = value;
}

// 预测功能
async function runPrediction() {
    if (!model) {
        showNotification('请先训练模型', 'error');
        return;
    }

    const testImage = document.getElementById('test-image');
    // if (!testImage.src || testImage.style.display === 'none') {
    if (!testImage.src) {
        showNotification('请先选择测试图片', 'error');
        return;
    }

    try {
        // 预处理图像
        const img = new Image();
        img.src = testImage.src;
        await new Promise(resolve => img.onload = resolve);

        const tensor = tf.browser.fromPixels(img)
            .resizeNearestNeighbor([224, 224])
            .expandDims(0)
            .toFloat()
            .div(255.0);

        // 进行预测
        const predictions = await model.predict(tensor).data();

        // 显示结果
        displayPredictionResults(predictions);

    } catch (error) {
        console.error('Prediction error:', error);
        showNotification('预测失败: ' + error.message, 'error');
    }
}

function displayPredictionResults(predictions) {
    const classes = Object.keys(dataset);
    const results = [];

    for (let i = 0; i < predictions.length; i++) {
        results.push({
            class: classes[i],
            confidence: predictions[i]
        });
    }

    // 按置信度排序
    results.sort((a, b) => b.confidence - a.confidence);

    const resultsContainer = document.getElementById('prediction-results');

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="text-center text-gray-400 py-8">
                <div class="text-4xl mb-2">❓</div>
                <p>无法识别</p>
            </div>
        `;
        return;
    }

    const topResult = results[0];
    const confidencePercentage = (topResult.confidence * 100).toFixed(1);

    resultsContainer.innerHTML = `
        <div class="text-center mb-6">
            <div class="text-3xl mb-2">${getClassEmoji(topResult.class)}</div>
            <div class="text-2xl font-bold text-white mb-2">${topResult.class}</div>
            <div class="text-lg text-gray-300">置信度: ${confidencePercentage}%</div>
        </div>
        
        <div class="space-y-3">
            <h4 class="font-medium text-gray-300">详细结果:</h4>
            ${results.map(result => `
                <div class="flex items-center justify-between">
                    <span class="text-sm">${result.class}</span>
                    <div class="flex items-center space-x-2">
                        <div class="confidence-bar flex-1" style="width: 100px;">
                            <div class="confidence-fill" style="width: ${result.confidence * 100}%"></div>
                        </div>
                        <span class="text-sm text-gray-400 w-12">${(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // 添加结果显示动画
    anime({
        targets: '#prediction-results > *',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        delay: anime.stagger(100),
        easing: 'easeOutQuart'
    });
}

function getClassEmoji(className) {
    const emojiMap = {
        'class1': '🎯',
        'class2': '🌟',
        'cat': '🐱',
        'dog': '🐶',
        'car': '🚗',
        'flower': '🌸'
    };
    return emojiMap[className] || '📦';
}

// 摄像头测试功能
async function startTestCamera() {
    const video = document.getElementById('test-camera');
    const placeholder = document.getElementById('test-placeholder');
    const image = document.getElementById('test-image');
    const openCamera = document.getElementById('open-camera');
    const closeCamera = document.getElementById('close-camera');

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 300, height: 200 }
        });
        video.srcObject = stream;
        video.classList.remove('hidden');
        placeholder.style.display = 'none';
        image.style.display = 'none';
        openCamera.classList.add('hidden');
        closeCamera.classList.remove('hidden');

        // 定期捕获帧进行预测
        captureInterval = setInterval(() => {
            if (!video.classList.contains('hidden')) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0);

                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                image.src = imageData;
                runPrediction();
            }
        }, 3000);

    } catch (error) {
        showNotification('无法访问摄像头', 'error');
    }
}

function closeTestCamera() {
    const openCamera = document.getElementById('open-camera');
    const closeCamera = document.getElementById('close-camera');
    closeCamera.classList.add('hidden');
    openCamera.classList.remove('hidden');
    // 停止摄像头
    if (captureInterval) {
        clearInterval(captureInterval);
    }
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}

function uploadTestImage(event) {
    // 停止摄像头
    if (captureInterval) {
        clearInterval(captureInterval);
    }
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const image = document.getElementById('test-image');
        const video = document.getElementById('test-camera');
        const placeholder = document.getElementById('test-placeholder');

        image.src = e.target.result;
        image.style.display = 'block';
        video.classList.add('hidden');
        placeholder.style.display = 'none';

        // 自动进行预测
        setTimeout(() => runPrediction(), 500);
    };
    reader.readAsDataURL(file);

    event.target.value = '';
}

// 模型管理功能
async function downloadModel() {
    if (!model) {
        showNotification('没有可下载的模型', 'error');
        return;
    }

    try {
        //await model.save('downloads://ai-classifier-model');
        await downloadModelAsZip(model, 'ai-classifier-model');
        showNotification('模型下载已开始', 'success');
    } catch (error) {
        console.error('Download model error:', error);
        showNotification('下载模型失败', 'error');
    }
}
// 自定义保存处理器：获取模型文件内容
async function getModelFiles(model) {
    const files = {}; // 存储 { 文件名: 内容 }

    // 自定义保存逻辑
    const saveHandler = tf.io.withSaveHandler(async (artifacts) => {
        // artifacts 包含模型结构和权重信息
        // 1. 处理 model.json
        const modelJson = JSON.stringify(artifacts.modelTopology);
        files['model.json'] = modelJson;

        // 2. 处理权重文件（.bin）
        const weightSpecs = artifacts.weightSpecs;
        const weightData = artifacts.weightData;

        // 权重可能分片为多个 .bin 文件，这里简化为一个（实际可能需要拆分）
        // 注意：TensorFlow.js 通常将权重合并为一个 .bin 文件
        files['weight.bin'] = weightData;

        return { modelArtifactsInfo: { type: 'custom', files } };
    });

    // 触发保存，获取文件内容
    await model.save(saveHandler);
    return files;
}
// 打包并下载 ZIP
async function downloadModelAsZip(model, zipName = 'model') {
    try {
        // 1. 获取模型文件
        const modelFiles = await getModelFiles(model);

        // 2. 创建 ZIP 实例
        const zip = new JSZip();

        // 3. 添加文件到 ZIP
        Object.keys(modelFiles).forEach((fileName) => {
            const content = modelFiles[fileName];
            // 区分文本（model.json）和二进制（.bin）
            if (fileName.endsWith('.json')) {
                zip.file(fileName, content); // 文本内容直接添加
            } else if (fileName.endsWith('.bin')) {
                zip.file(fileName, content, { binary: true }); // 二进制内容需指定 binary: true
            }
        });

        // 遍历所有目录
        Object.keys(dataset).forEach((dirName) => {
            // 创建目录
            const dir = zip.folder(dirName);

            // 处理目录下的所有图片
            dataset[dirName].forEach((imgData, index) => {
                // 获取图片格式（从dataURL中提取）
                const formatMatch = imgData.match(/data:image\/(jpeg|png|gif);base64/);
                const format = formatMatch ? formatMatch[1] : 'jpeg'; // 默认jpeg

                // 转换为二进制数据
                const binaryData = base64ToBinary(imgData);

                // 添加到压缩包（文件名格式：图片索引.格式）
                dir.file(`image_${index + 1}.${format}`, binaryData);
            });
        });

        // 4. 生成 ZIP 并下载
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${zipName}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('模型已打包为 ZIP 并下载');
    } catch (err) {
        console.error('打包失败：', err);
    }
}
// 处理base64数据转换为二进制
function base64ToBinary(base64Data) {
    // 移除base64前缀（如"data:image/jpeg;base64,"）
    const base64String = base64Data.split(',')[1];
    // 解码base64
    const binaryString = atob(base64String);
    // 转换为Uint8Array
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function loadModel(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        // 加载模型结构
        const modelJson = await fetch(URL.createObjectURL(file)).then(r => r.json());
        model = await tf.loadLayersModel(URL.createObjectURL(file));

        // 加载关联数据
        const savedDataset = localStorage.getItem('ai-classifier-dataset');
        const savedClasses = localStorage.getItem('ai-classifier-classes');

        if (savedDataset) {
            dataset = JSON.parse(savedDataset);
            updateClassStats();
            updateSampleGallery();
        }

        document.getElementById('model-status').textContent = '已加载';
        document.getElementById('model-updated').textContent = new Date().toLocaleString();

        showNotification('模型加载成功', 'success');
        updateModelInfo();

    } catch (error) {
        console.error('Load model error:', error);
        showNotification('加载模型失败', 'error');
    }

    event.target.value = '';
}

function updateModelInfo() {
    const classes = Object.keys(dataset);
    const totalSamples = classes.reduce((sum, className) => sum + (dataset[className] ? dataset[className].length : 0), 0);

    document.getElementById('model-classes').textContent = classes.length;
    document.getElementById('model-samples').textContent = totalSamples;
}

// 训练历史 - 使用IndexedDB
async function saveTrainingHistory() {
    if (!dbInitialized) {
        // 降级使用localStorage
        const history = JSON.parse(localStorage.getItem('ai-training-history') || '[]');
        const newEntry = {
            timestamp: new Date().toISOString(),
            classes: Object.keys(dataset),
            samples: Object.keys(dataset).reduce((sum, className) => sum + dataset[className].length, 0),
            finalLoss: chartData.loss[chartData.loss.length - 1],
            finalAccuracy: chartData.accuracy[chartData.accuracy.length - 1]
        };

        history.unshift(newEntry);

        // 只保留最近10次记录
        if (history.length > 10) {
            history.splice(10);
        }

        localStorage.setItem('ai-training-history', JSON.stringify(history));
        updateTrainingHistoryDisplay();
        return;
    }

    try {
        const historyData = {
            classes: Object.keys(dataset),
            samples: Object.keys(dataset).reduce((sum, className) => sum + dataset[className].length, 0),
            finalLoss: chartData.loss[chartData.loss.length - 1],
            finalAccuracy: chartData.accuracy[chartData.accuracy.length - 1],
            epochs: chartData.loss.length,
            duration: Date.now() - (window.trainingStartTime || Date.now()),
            parameters: {
                learningRate: document.getElementById('learning-rate').value,
                batchSize: document.getElementById('batch-size').value,
                validationSplit: document.getElementById('validation-split').value
            }
        };

        await dbManager.saveTrainingHistory(historyData);
        await updateTrainingHistoryDisplay();

        console.log('训练历史已保存到IndexedDB');

    } catch (error) {
        console.error('保存训练历史失败:', error);
    }
}

async function updateTrainingHistoryDisplay() {
    let history = [];

    if (dbInitialized) {
        try {
            history = await dbManager.getTrainingHistory(10);
        } catch (error) {
            console.error('获取训练历史失败:', error);
        }
    } else {
        // 使用localStorage数据
        history = JSON.parse(localStorage.getItem('ai-training-history') || '[]');
    }

    const container = document.getElementById('training-history');

    if (history.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-400 py-8">
                <div class="text-4xl mb-2">📊</div>
                <p>暂无训练记录</p>
            </div>
        `;
        return;
    }

    container.innerHTML = history.map(entry => `
        <div class="bg-gray-800 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
                <div class="text-sm font-medium">${new Date(entry.timestamp).toLocaleString()}</div>
                <div class="text-xs text-gray-400">${entry.classes ? entry.classes.length : 0} 个分类</div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="text-gray-400">样本数:</span> ${entry.samples || 0}
                </div>
                <div>
                    <span class="text-gray-400">最终准确率:</span> ${((entry.finalAccuracy || 0) * 100).toFixed(1)}%
                </div>
            </div>
        </div>
    `).join('');
}

async function loadSavedData() {
    if (!dbInitialized) {
        // 降级使用localStorage
        const savedDataset = localStorage.getItem('ai-classifier-dataset');
        const savedCurrentClass = localStorage.getItem('ai-classifier-current-class');

        if (savedDataset) {
            dataset = JSON.parse(savedDataset);

            // 更新分类列表
            const classList = document.getElementById('class-list');
            classList.innerHTML = '';

            Object.keys(dataset).forEach(className => {
                const classElement = createClassElement(className);
                classList.appendChild(classElement);
            });

            updateClassStats();
            updateSampleGallery();
        }

        if (savedCurrentClass && dataset[savedCurrentClass]) {
            selectClass(savedCurrentClass);
        }
        return;
    }

    try {
        // 从IndexedDB加载数据集
        const dbDatasets = await dbManager.getAllDatasets();
        console.log(dbDatasets);

        if (Object.keys(dbDatasets).length > 0) {
            dataset = dbDatasets;

            // 更新分类列表
            const classList = document.getElementById('class-list');
            classList.innerHTML = '';

            // 重新创建分类元素
            Object.keys(dataset).forEach(className => {
                const classElement = createClassElement(className);
                classList.appendChild(classElement);
            });

            updateClassStats();
            updateSampleGallery();
        }

        // 加载当前分类设置
        const savedCurrentClass = await dbManager.getSetting('currentClass');
        if (savedCurrentClass && dataset[savedCurrentClass]) {
            selectClass(savedCurrentClass);
        }

        console.log('数据已从IndexedDB加载');

    } catch (error) {
        console.error('加载数据失败:', error);
        showNotification('数据加载失败', 'error');
    }
    // updateTrainingHistoryDisplay();
    // updateModelInfo();
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;

    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-600',
        info: 'bg-blue-600'
    };

    notification.classList.add(colors[type]);
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

// 庆祝动画
function celebrateTrainingComplete() {
    // 创建粒子效果
    const colors = ['#4a9eff', '#4caf50', '#ff9800', '#f44336'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';

            document.body.appendChild(particle);

            anime({
                targets: particle,
                translateX: (Math.random() - 0.5) * 400,
                translateY: (Math.random() - 0.5) * 400,
                scale: [1, 0],
                opacity: [1, 0],
                duration: 1500,
                easing: 'easeOutQuart',
                complete: () => {
                    document.body.removeChild(particle);
                }
            });
        }, i * 50);
    }
}

// 教程功能
function startTutorial() {
    const steps = [
        {
            element: '[data-tab="dataset"]',
            title: '第一步：收集数据',
            content: '在这里创建分类并收集样本图片。您可以使用摄像头拍照或上传本地图片。'
        },
        {
            element: '[data-tab="training"]',
            title: '第二步：训练模型',
            content: '调整训练参数，然后开始训练您的AI模型。训练过程会实时显示进度和效果。'
        },
        {
            element: '[data-tab="testing"]',
            title: '第三步：测试模型',
            content: '使用新的图片测试训练好的模型，查看预测结果和置信度。'
        },
        {
            element: '[data-tab="models"]',
            title: '第四步：下载模型',
            content: '下载训练好的模型文件以便后续使用。'
        }
    ];

    let currentStep = 0;

    function showStep() {
        if (currentStep >= steps.length) {
            showNotification('教程完成！开始创建您的第一个AI模型吧！', 'success');
            return;
        }

        const step = steps[currentStep];
        const element = document.querySelector(step.element);

        // 高亮当前元素
        element.style.boxShadow = '0 0 20px rgba(74, 158, 255, 0.8)';
        element.style.transform = 'scale(1.05)';

        // 显示提示
        showNotification(`${step.title}: ${step.content}`, 'info');

        setTimeout(() => {
            element.style.boxShadow = '';
            element.style.transform = '';
            currentStep++;
            setTimeout(showStep, 1000);
        }, 3000);
    }

    showStep();
}

// 窗口大小调整
window.addEventListener('resize', () => {
    if (trainingChart) {
        trainingChart.resize();
    }
});

console.log('AI图像分类训练平台 - 所有功能已加载完成');