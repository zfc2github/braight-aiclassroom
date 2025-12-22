<template>
  <div class="psas-wrapper">
    <div ref="psasPie" class="echart-1">
    </div>
    <div class="name-zh">数据处理</div>
    <div class="circle">
      <div class="text-container">
        <div class="text t108">元数据管理</div>
        <div class="text t110">数据标签管理</div>
        <div class="text t1">数据质量管理</div>
        <div class="text t2">数据模型管理</div>
        <div class="text t3">文化遗产核心知识<br/>本体模型</div>
        <div class="text t22">图案线稿提取<br/>与矢量图生成</div>
        <div class="text t23">纹样检测识别</div>
        <div class="text t24">命名实体识别</div>
        <div class="text t31">文本主题聚类</div>
        <div class="text t32">AI语义分析模型</div>
        <div class="text t33">AI图像分析模型</div>
        <div class="text t34">TopWords 大数据模型</div>
        <div class="text t11">文生图垂直模型</div>
        <div class="text t12">图生文垂直模型</div>
        <div class="text t13">主题聚类模型</div>
        <div class="text t14">藏品评估模型</div>
        <div class="text t21">数据可视化</div>
        <div class="text t3408">用户画像模型</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "productSystemDataProcessing",
  data() {
    return {
      option: {
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['70%', '99%'],
            padAngle: 3,
            label: {
              show: true,
              position: 'inside',
              fontSize: "16px",
              color: "#FFFFFF",
              rotate: 'tangential'
            },
            emphasis: {
              disabled: true
            },
            color: ['#3B1BF9', '#45E02A'],
            data: [
              { value: 500, name: '智慧管理' },
              { value: 750, name: '内容挖掘' },
              { value: 800, name: '活化利用' },
            ]
          }
        ]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.psasPie, 'macarons')
      this.chart.setOption(this.option);
    }
  },
}
</script>

<style scoped>
.psas-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

.echart-1 {
  width: 370px;
  height: 370px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.name-zh {
  position: absolute;
  color: #45E02A;
  letter-spacing: 0.1em;
  font-size: 36px;
  font-weight: bold;
  width: 170px;
  height: 59px;
  text-align: center;
}
@media (max-width: 1600px) {
  .name-zh {
    font-size: 30px;
  }
}

.circle {
  width: 450px;
  height: 450px;
  border-radius: 50%;
  /*border: 1px solid #000;*/
  position: absolute;
}

.text-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text {
  position: absolute;
  transform-origin: center;
  white-space: nowrap;
  font-size: 20px;
  letter-spacing: 0.03em;
}
@media (max-width: 1600px) {
  .text {
    font-size: 18px;
  }
}

/* 根据需要调整文本的位置和角度 */
.t108 {
  transform: rotate(-14deg) translate(calc(100% + 160px)) rotate(0deg);
}
.t110 {
  transform: rotate(-30deg) translate(calc(100% + 160px)) rotate(0deg);
}
.t1 {
  transform: rotate(-44deg) translate(calc(100% + 160px)) rotate(0deg);
}
.t2 {
  transform: rotate(-60deg) translate(calc(100% + 160px)) rotate(0deg);
}
.t3 {
  transform: rotate(-78deg) translate(calc(100% + 130px)) rotate(0deg);
}
.t11 {
  transform: rotate(-112deg) translate(calc(100% + 150px)) rotate(180deg);
}
.t12 {
  transform: rotate(-134deg) translate(calc(100% + 150px)) rotate(180deg);
}
.t13 {
  transform: rotate(-156deg) translate(calc(100% + 160px)) rotate(180deg);
}
.t14 {
  transform: rotate(-176deg) translate(calc(100% + 160px)) rotate(180deg);
}
.t21 {
  transform: rotate(-198deg) translate(calc(100% + 160px)) rotate(180deg);
}
.t22 {
  transform: rotate(-248deg) translate(calc(100% + 150px)) rotate(180deg);
  text-align: right;
}
.t23 {
  transform: rotate(-270deg) translate(calc(100% + 160px)) rotate(0deg);
}
.t24 {
  transform: rotate(-287deg) translate(calc(100% + 160px)) rotate(0deg);
}
.t31 {
  transform: rotate(-302deg) translate(calc(100% + 160px)) rotate(0deg);
}
.t32 {
  transform: rotate(-320deg) translate(calc(100% + 150px)) rotate(0deg);
}
.t33 {
  transform: rotate(-336deg) translate(calc(100% + 150px)) rotate(0deg);
}
.t34 {
  transform: rotate(-350deg) translate(calc(100% + 120px)) rotate(0deg);
}
.t3408 {
  transform: rotate(-218deg) translate(calc(100% + 160px)) rotate(180deg);
}
}

</style>
