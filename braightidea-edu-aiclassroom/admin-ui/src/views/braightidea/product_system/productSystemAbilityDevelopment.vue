<template>
  <div class="psas-wrapper">
    <div ref="psasPie" class="echart-1">
    </div>
    <div class="name-zh">能力开发</div>
    <div class="circle">
      <div class="text-container">
        <div class="text t1">文本在线OCR处理</div>
        <div class="text t2">自定义字段随时更新</div>
        <div class="text t3">多人协同在线标注</div>
        <div class="text t22">关键词标签提取</div>
        <div class="text t23">纹样基因提取</div>
        <div class="text t24">色彩基因提取</div>
        <div class="text t31">主题内容挖掘</div>
        <div class="text t32">语义关系抽取</div>
        <div class="text t33">知识网络生成</div>
        <div class="text t34">藏品价值提取</div>
        <div class="text t11">智能问答</div>
        <div class="text t12">AI导览</div>
        <div class="text t13">时空地图</div>
        <div class="text t14">色彩搜索</div>
        <div class="text t21">藏品海报智能生成</div>
        <div class="text t3408">元宇宙数字展览</div>
        <div class="text t3409">以图搜图</div>
        <div class="text t3410">智能配色</div>
        <div class="text t35">用户洞察</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "productSystemAbilityDevelopment",
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
              { value: 400, name: '智慧管理' },
              { value: 700, name: '内容挖掘' },
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
  .t1 {
    transform: rotate(-30deg) translate(calc(100% + 140px)) rotate(0deg);
  }
  .t2 {
    transform: rotate(-50deg) translate(calc(100% + 130px)) rotate(0deg);
  }
  .t3 {
    transform: rotate(-70deg) translate(calc(100% + 140px)) rotate(0deg);
  }
  .t11 {
    transform: rotate(-100deg) translate(calc(100% + 170px)) rotate(180deg);
  }
  .t12 {
    transform: rotate(-115deg) translate(calc(100% + 190px)) rotate(180deg);
  }
  .t13 {
    transform: rotate(-132deg) translate(calc(100% + 170px)) rotate(180deg);
  }
  .t14 {
    transform: rotate(-148deg) translate(calc(100% + 170px)) rotate(180deg);
  }
  .t21 {
    transform: rotate(-166deg) translate(calc(100% + 140px)) rotate(180deg);
  }
  .t22 {
    transform: rotate(-254deg) translate(calc(100% + 140px)) rotate(180deg);
  }
  .t23 {
    transform: rotate(-274deg) translate(calc(100% + 160px)) rotate(0deg);
  }
  .t24 {
    transform: rotate(-287deg) translate(calc(100% + 160px)) rotate(0deg);
  }
  .t31 {
    transform: rotate(-305deg) translate(calc(100% + 160px)) rotate(0deg);
  }
  .t32 {
    transform: rotate(-324deg) translate(calc(100% + 160px)) rotate(0deg);
  }
  .t33 {
    transform: rotate(-342deg) translate(calc(100% + 160px)) rotate(0deg);
  }
  .t34 {
    transform: rotate(-358deg) translate(calc(100% + 160px)) rotate(0deg);
  }
  .t3408 {
    transform: rotate(-182deg) translate(calc(100% + 140px)) rotate(180deg);
  }
  .t3409 {
    transform: rotate(-198deg) translate(calc(100% + 170px)) rotate(180deg);
  }
  .t3410 {
    transform: rotate(-214deg) translate(calc(100% + 170px)) rotate(180deg);
  }
  .t35 {
    transform: rotate(-230deg) translate(calc(100% + 170px)) rotate(180deg);
  }
}

</style>
