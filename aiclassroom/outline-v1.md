# 项目大纲 - V1版本

## 网站结构

### 主页 (index-v1.html)
- **Hero区域**: 展示"父亲、树林和鸟"课程的主题图像和核心概念
- **课程亮点**: 展示6个核心知识点卡片
- **教学特色**: 展示教学方法创新点
- **悬念设置**: 父亲是不是猎人的悬念引导

### 教学流程页面 (process-v1.html)
- **时间轴展示**: 40分钟课程安排的交互式时间轴
- **环节详解**: 每个教学环节的详细说明
- **活动展示**: 教学活动的视觉化呈现
- **资源下载**: 相关教学资源

### 课堂分析页面 (analysis-v1.html)
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
/output/
├── index-v1.html           # 主页V1版本
├── process-v1.html         # 教学流程页面V1版本
├── analysis-v1.html        # 课堂分析页面V1版本
├── main.js                # 主要JavaScript文件
├── design-v1.md           # V1版本设计规范
├── outline-v1.md          # V1版本项目大纲
└── resources/             # 资源文件夹
    ├── hero-forest.png    # 主题背景图
    ├── classroom-scene.png # 教室场景图
    └── teaching-process.png # 教学流程图
```