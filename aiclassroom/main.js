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