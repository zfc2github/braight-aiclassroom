# 《父亲、树林和鸟》教学展示网站 - V1版本完整代码

## 项目概述

这个文件包含了V1版本的完整代码，包括HTML页面、CSS样式、JavaScript功能、设计文档和项目大纲。所有代码都基于您最初提供的教学内容设计，采用温暖的自然色调和优雅的字体组合。

---

## 1. 主页代码 (index.html)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>父亲、树林和鸟 - 教学展示</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Coda&family=Hedvig+Letters+Sans&family=Jersey+15&family=Jersey+20+Charted&family=Liter&family=Luckiest+Guy&family=Oranienbaum&family=Press+Start+2P&family=Quattrocento+Sans&family=Sorts+Mill+Goudy&family=Unna&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #F8F6F0;
            --primary-color: #2D5016;
            --secondary-color: #5A7C47;
            --accent-color: #D4A574;
        }
        
        body {
            background-color: var(--bg-color);
            font-family: 'Oranienbaum', serif;
            color: var(--primary-color);
        }
        
        .hero-title {
            font-family: 'Sorts Mill Goudy', serif;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .card-hover {
            transition: all 0.3s ease;
        }
        
        .card-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(45, 80, 22, 0.15);
        }
        
        .knowledge-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(45, 80, 22, 0.1);
        }
        
        .floating-element {
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        .gradient-text {
            background: linear-gradient(45deg, var(--accent-color), var(--secondary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .suspense-button {
            transition: all 0.3s ease;
        }
        
        .suspense-button:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(212, 165, 116, 0.3);
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold" style="color: var(--primary-color); font-family: 'Sorts Mill Goudy', serif;">
                        语文教学展示
                    </h1>
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-8">
                        <a href="#" class="text-gray-900 hover:text-green-700 px-3 py-2 text-sm font-medium transition-colors">课程概览</a>
                        <a href="process.html" class="text-gray-600 hover:text-green-700 px-3 py-2 text-sm font-medium transition-colors">教学流程</a>
                        <a href="analysis.html" class="text-gray-600 hover:text-green-700 px-3 py-2 text-sm font-medium transition-colors">课堂分析</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden" style="margin-top: 64px;">
        <div class="absolute inset-0 z-0">
            <img src="resources/hero-forest.png" alt="森林背景" class="w-full h-full object-cover opacity-30">
        </div>
        
        <div class="relative z-10 text-center max-w-4xl mx-auto px-4">
            <div class="floating-element">
                <h1 class="hero-title text-6xl md:text-8xl font-bold mb-6">
                    父亲、树林和鸟
                </h1>
                <p class="text-xl md:text-2xl mb-8 opacity-80" style="color: var(--secondary-color);">
                    三年级语文第七单元精读课教学展示
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="process.html" class="px-8 py-3 rounded-full text-white font-medium transition-all hover:scale-105" 
                       style="background-color: var(--primary-color);">
                        查看教学流程
                    </a>
                    <a href="analysis.html" class="px-8 py-3 rounded-full border-2 font-medium transition-all hover:scale-105" 
                       style="border-color: var(--secondary-color); color: var(--secondary-color);">
                        课堂分析
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Course Overview -->
    <section class="py-20 px-4">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold mb-6 gradient-text" style="font-family: 'Sorts Mill Goudy', serif;">
                    课程核心知识点
                </h2>
                <p class="text-lg opacity-80 max-w-2xl mx-auto" style="color: var(--secondary-color);">
                    本课程围绕《父亲、树林和鸟》展开，通过多维度的教学设计，让学生在感受语言魅力的同时，培养观察力和思辨能力。
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Knowledge Point 1 -->
                <div class="knowledge-card card-hover rounded-2xl p-6">
                    <div class="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style="background-color: var(--accent-color);">
                        <span class="text-white font-bold text-xl">1</span>
                    </div>
                    <h3 class="text-xl font-bold mb-3" style="color: var(--primary-color);">字词识写</h3>
                    <p class="text-sm opacity-80 mb-4">会认8个生字，会写5个"多横平行等距"结构的字，掌握雨字头、艹字头写法。</p>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">黎滹沱幽</span>
                        <span class="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">蒙凝畅抖</span>
                    </div>
                </div>

                <!-- Knowledge Point 2 -->
                <div class="knowledge-card card-hover rounded-2xl p-6">
                    <div class="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style="background-color: var(--accent-color);">
                        <span class="text-white font-bold text-xl">2</span>
                    </div>
                    <h3 class="text-xl font-bold mb-3" style="color: var(--primary-color);">生动语言积累</h3>
                    <p class="text-sm opacity-80 mb-4">修饰词连用和比喻句的学习，提升语言表达能力。</p>
                    <div class="text-xs opacity-70">
                        <p>• 幽深的、雾蒙蒙的、浓浓的</p>
                        <p>• 像树一般兀立</p>
                    </div>
                </div>

                <!-- Knowledge Point 3 -->
                <div class="knowledge-card card-hover rounded-2xl p-6">
                    <div class="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style="background-color: var(--accent-color);">
                        <span class="text-white font-bold text-xl">3</span>
                    </div>
                    <h3 class="text-xl font-bold mb-3" style="color: var(--primary-color);">朗读策略</h3>
                    <p class="text-sm opacity-80 mb-4">想象画面+动作朗读，把静态文字转化为视听嗅觉多重体验。</p>
                    <div class="text-xs opacity-70">
                        <p>• 画面想象</p>
                        <p>• 动作配合</p>
                        <p>• 多重感官体验</p>
                    </div>
                </div>

                <!-- Knowledge Point 4 -->
                <div class="knowledge-card card-hover rounded-2xl p-6">
                    <div class="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style="background-color: var(--accent-color);">
                        <span class="text-white font-bold text-xl">4</span>
                    </div>
                    <h3 class="text-xl font-bold mb-3" style="color: var(--primary-color);">内容理解</h3>
                    <p class="text-sm opacity-80 mb-4">深入理解父亲、树林和鸟三个核心意象的特点和内涵。</p>
                    <div class="text-xs opacity-70">
                        <p>• 父亲：知鸟、爱鸟、观察细致</p>
                        <p>• 树林：幽深、雾浓、草木气息</p>
                    </div>
                </div>

                <!-- Knowledge Point 5 -->
                <div class="knowledge-card card-hover rounded-2xl p-6">
                    <div class="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style="background-color: var(--accent-color);">
                        <span class="text-white font-bold text-xl">5</span>
                    </div>
                    <h3 class="text-xl font-bold mb-3" style="color: var(--primary-color);">阅读方法</h3>
                    <p class="text-sm opacity-80 mb-4">用不同符号分类勾画，摘抄本"四要素"记录法。</p>
                    <div class="text-xs opacity-70">
                        <p>• 横线/波浪线/括号分类</p>
                        <p>• 词句+归类+感受+出处</p>
                    </div>
                </div>

                <!-- Knowledge Point 6 -->
                <div class="knowledge-card card-hover rounded-2xl p-6">
                    <div class="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style="background-color: var(--accent-color);">
                        <span class="text-white font-bold text-xl">6</span>
                    </div>
                    <h3 class="text-xl font-bold mb-3" style="color: var(--primary-color);">悬念设置</h3>
                    <p class="text-sm opacity-80 mb-4">父亲到底是不是猎人？激发学生的思辨和探究兴趣。</p>
                    <div class="text-xs opacity-70">
                        <p>• 引发思考</p>
                        <p>• 促进讨论</p>
                        <p>• 培养批判思维</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Teaching Features -->
    <section class="py-20 px-4" style="background: rgba(45, 80, 22, 0.05);">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold mb-6 gradient-text" style="font-family: 'Sorts Mill Goudy', serif;">
                    教学特色与创新
                </h2>
            </div>

            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <img src="resources/classroom-scene.png" alt="教学场景" class="rounded-2xl shadow-lg w-full">
                </div>
                <div class="space-y-6">
                    <div class="flex items-start space-x-4">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style="background-color: var(--accent-color);">
                            <span class="text-white text-sm font-bold">✓</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold mb-2" style="color: var(--primary-color);">单元整体设计连贯</h3>
                            <p class="text-sm opacity-80">三站"探秘大自然"情境让学生有持续期待，教学设计环环相扣。</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start space-x-4">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style="background-color: var(--accent-color);">
                            <span class="text-white text-sm font-bold">✓</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold mb-2" style="color: var(--primary-color);">词语教学扎实有效</h3>
                            <p class="text-sm opacity-80">随文正音、形近字辨析、结构归类、当堂练写，一步到位。</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start space-x-4">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style="background-color: var(--accent-color);">
                            <span class="text-white text-sm font-bold">✓</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold mb-2" style="color: var(--primary-color);">朗读梯度清晰</h3>
                            <p class="text-sm opacity-80">听录音→想象画面→去词比较→动作表演，学生情绪投入高。</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start space-x-4">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style="background-color: var(--accent-color);">
                            <span class="text-white text-sm font-bold">✓</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold mb-2" style="color: var(--primary-color);">读写结合落地实践</h3>
                            <p class="text-sm opacity-80">现场示范"摘抄四要素"，把单元语文要素落到笔头。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Suspense Section -->
    <section class="py-20 px-4">
        <div class="max-w-4xl mx-auto text-center">
            <div class="mb-12">
                <h2 class="text-4xl md:text-5xl font-bold mb-6 gradient-text" style="font-family: 'Sorts Mill Goudy', serif;">
                    悬念设置
                </h2>
                <p class="text-xl opacity-80 mb-8" style="color: var(--secondary-color);">
                    父亲到底是不是猎人？
                </p>
                <div class="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200">
                    <p class="text-lg leading-relaxed mb-6" style="color: var(--primary-color);">
                        这个悬念的设置激发了学生的思辨兴趣，为下节课的深度讨论埋下伏笔。通过这个问题，学生不仅学会了观察文本细节，更培养了批判性思维能力。
                    </p>
                    <div class="flex justify-center space-x-4">
                        <button onclick="showAnswer('yes')" class="suspense-button px-6 py-3 rounded-full border-2 font-medium" 
                                style="border-color: var(--secondary-color); color: var(--secondary-color);">
                            是猎人
                        </button>
                        <button onclick="showAnswer('no')" class="suspense-button px-6 py-3 rounded-full border-2 font-medium" 
                                style="border-color: var(--secondary-color); color: var(--secondary-color);">
                            不是猎人
                        </button>
                    </div>
                    <div id="answer-result" class="mt-6 text-lg font-medium" style="display: none; color: var(--accent-color);">
                        答案将在下节课揭晓，敬请期待！
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-4 border-t border-gray-200" style="background: rgba(45, 80, 22, 0.05);">
        <div class="max-w-6xl mx-auto text-center">
            <p class="text-sm opacity-70" style="color: var(--secondary-color);">
                © 2024 语文教学展示 - 《父亲、树林和鸟》教学案例
            </p>
        </div>
    </footer>

    <script src="main.js"></script>
</body>
</html>
```

## 2. JavaScript功能代码 (main.js)

```javascript
// 主要JavaScript功能文件

document.addEventListener('DOMContentLoaded', function() {
    // 初始化动画
    initAnimations();
    
    // 初始化交互功能
    initInteractions();
    
    // 初始化滚动效果
    initScrollEffects();
});

// 初始化页面动画
function initAnimations() {
    // Hero标题动画
    anime({
        targets: '.hero-title',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1200,
        easing: 'easeOutExpo',
        delay: 300
    });
    
    // 知识卡片动画
    anime({
        targets: '.knowledge-card',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: anime.stagger(100, {start: 600})
    });
    
    // 教学特色内容动画
    anime({
        targets: '.space-y-6 > div',
        opacity: [0, 1],
        translateX: [50, 0],
        duration: 600,
        easing: 'easeOutExpo',
        delay: anime.stagger(150, {start: 1000})
    });
}

// 初始化交互功能
function initInteractions() {
    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            nav.style.backdropFilter = 'blur(20px)';
        } else {
            nav.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            nav.style.backdropFilter = 'blur(10px)';
        }
    });
    
    // 知识卡片悬停效果
    const knowledgeCards = document.querySelectorAll('.knowledge-card');
    knowledgeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
}

// 初始化滚动效果
function initScrollEffects() {
    // 滚动时的视差效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.absolute.inset-0 img');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// 悬念答案显示功能
function showAnswer(choice) {
    const resultDiv = document.getElementById('answer-result');
    const buttons = document.querySelectorAll('button[onclick^="showAnswer"]');
    
    // 禁用按钮
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.6';
    });
    
    // 显示结果
    resultDiv.style.display = 'block';
    resultDiv.textContent = '答案将在下节课揭晓，敬请期待！';
    
    // 添加动画效果
    anime({
        targets: resultDiv,
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 600,
        easing: 'easeOutBack'
    });
    
    // 3秒后重置按钮
    setTimeout(() => {
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
        resultDiv.style.display = 'none';
    }, 3000);
}

// 平滑滚动到指定元素
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 页面加载完成后的欢迎动画
window.addEventListener('load', function() {
    // 页面加载完成后的额外动画
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
            heroTitle.style.webkitBackgroundClip = 'text';
            heroTitle.style.webkitTextFillColor = 'transparent';
            heroTitle.style.backgroundClip = 'text';
        }
    }, 1500);
});

// 响应式处理
function handleResize() {
    const isMobile = window.innerWidth < 768;
    
    // 移动端优化
    if (isMobile) {
        // 调整动画参数以适应小屏幕
        anime.set('.knowledge-card', {
            translateY: 0
        });
    }
}

window.addEventListener('resize', handleResize);
handleResize(); // 初始调用

// 导出主要函数供其他页面使用
window.TeachingApp = {
    initAnimations,
    initInteractions,
    scrollToElement,
    showAnswer
};
```

---

## 3. 设计文档 (design.md)

```markdown
# 网站设计规范 - V1版本

## 设计理念

这个教学展示网站采用现代教育美学，融合温暖的人文气息和专业的学术氛围。设计灵感来源于自然教育的理念，使用温暖的土色调和自然的绿色，营造出如同树林般宁静而富有生机的学习环境。

整体视觉语言追求简洁优雅，通过精心选择的字体组合和柔和的色彩搭配，体现教育工作者对美的追求。网站将展现"父亲、树林和鸟"这篇课文的诗意氛围，让访问者感受到语文教学的艺术魅力。

## 配色方案

- **背景色**: #F8F6F0 (温暖米色)
- **主色调**: #2D5016 (深森林绿)
- **辅助色**: #5A7C47 (中等绿色)
- **强调色**: #D4A574 (温暖金色)

## 字体设计

- **标题字体**: Sorts Mill Goudy (优雅的衬线字体)
- **正文字体**: Oranienbaum, Liter (现代无衬线字体)
```

---

## 4. 项目大纲 (outline.md)

```markdown
# 项目大纲 - V1版本

## 网站结构

### 主页 (index.html)
- **Hero区域**: 展示"父亲、树林和鸟"课程的主题图像和核心概念
- **课程亮点**: 6个核心知识点卡片展示
- **教学特色**: 教学设计创新点介绍
- **悬念设置**: "父亲到底是不是猎人？"互动环节

### 教学流程页面 (process.html)
- **时间轴展示**: 40分钟课程安排的交互式时间轴
- **环节详解**: 每个教学环节的详细说明
- **活动展示**: 教学活动的视觉化呈现
- **资源下载**: 相关教学资源

### 课堂分析页面 (analysis.html)
- **提问统计**: 33次提问的可视化分析
- **效果评估**: 教学优缺点的详细分析
- **改进建议**: 具体的改进措施
- **数据图表**: 使用ECharts展示统计数据

## 交互功能

1. **时间轴导航**: 点击不同时间段查看详细教学内容
2. **知识点卡片**: 悬停显示详细解释
3. **统计图表**: 交互式数据可视化
4. **教学反思**: 可展开的评价内容

## 技术栈

- **前端框架**: 纯HTML/CSS/JavaScript
- **样式**: Tailwind CSS
- **动画**: Anime.js
- **图表**: ECharts.js
- **字体**: Google Fonts (Sorts Mill Goudy, Oranienbaum)

## 文件结构

```
v1-version/
├── index.html           # 主页V1版本
├── process.html         # 教学流程页面V1版本
├── analysis.html        # 课堂分析页面V1版本
├── main.js             # 主要JavaScript文件
├── design.md           # V1版本设计规范
├── outline.md          # V1版本项目大纲
└── resources/          # 资源文件夹
    ├── hero-forest.png    # Hero背景图
    ├── classroom-scene.png # 教室场景图
    └── teaching-process.png # 教学流程图
```
```

---

## 使用说明

### 本地运行
1. 将所有文件解压到同一目录
2. 使用HTTP服务器运行（如 `python -m http.server 8000`）
3. 在浏览器中访问 `http://localhost:8000`

### 文件说明
- `index.html`: 网站主页，展示课程概览和核心知识点
- `process.html`: 教学流程页面，展示40分钟课程安排
- `analysis.html`: 课堂分析页面，展示33次提问统计和教学评估
- `main.js`: 主要的JavaScript功能文件，包含动画和交互逻辑
- `resources/`: 存放图片资源的文件夹

## 技术特点

1. **纯前端实现**: 无需后端支持，可直接在浏览器中运行
2. **响应式设计**: 适配各种设备屏幕尺寸
3. **现代动画**: 使用Anime.js实现流畅的动画效果
4. **数据可视化**: ECharts.js展示统计数据
5. **优雅设计**: 温暖的自然色调和专业的排版

## 项目价值

1. **教学展示**: 完整呈现40分钟课程设计和实施过程
2. **专业分析**: 提供详细的课堂数据分析和教学评估
3. **视觉美观**: 优雅的设计提升用户体验
4. **技术先进**: 采用现代前端技术实现
5. **教育意义**: 体现先进的语文教学理念

---

**© 2024 语文教学展示 - 《父亲、树林和鸟》教学案例**