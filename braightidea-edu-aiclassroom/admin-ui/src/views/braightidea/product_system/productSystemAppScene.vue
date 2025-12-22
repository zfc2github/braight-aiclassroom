<template>
  <div class="psas-wrapper">
    <div ref="psasPie" class="echart-1">
    </div>
    <div class="name-zh">应用场景</div>
    <div class="circle">
      <div class="text-container">
        <div class="text t1">线上虚拟展览</div>
        <div class="text t2">数字教育科普</div>
        <div class="text t3">藏品管理信息化</div>
        <div class="text t4">数字互动体验</div>
        <div class="text t5">文物数字展示</div>
        <div class="text t6">文物数字化</div>
        <div class="text t11">线上虚拟展示</div>
        <div class="text t12">智能化讲解</div>
        <div class="text t13">沉浸式体验</div>
        <div class="text t14">数字化复原</div>
        <div class="text t21">数字资源支持</div>
        <div class="text t22">数字互动展示</div>
        <div class="text t23">文化展示空间</div>
        <div class="text t24">数字文化体验</div>
        <div class="text t31">在线课程平台</div>
        <div class="text t32">研学活动策划</div>
        <div class="text t33">在线学习平台</div>
        <div class="text t34">研究资源数据库</div>
        <div class="text t35">文化主题研学</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "productSystemAppScene",
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
              { value: 878, name: '智慧文博' },
              { value: 800, name: '文化教育' },
              { value: 580, name: '文化场景' },
              { value: 600, name: '数字文旅' }
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
    transform: rotate(4deg) translate(calc(100% + 150px)) rotate(0deg);
  }
  .t2 {
    transform: rotate(-12deg) translate(calc(100% + 150px)) rotate(0deg);
  }
  .t3 {
    transform: rotate(-29deg) translate(calc(100% + 150px)) rotate(0deg);
  }
  .t4 {
    transform: rotate(-46deg) translate(calc(100% + 150px)) rotate(0deg);
  }
  .t5 {
    transform: rotate(-62deg) translate(calc(100% + 150px)) rotate(0deg);
  }
  .t6 {
    transform: rotate(-80deg) translate(calc(100% + 150px)) rotate(0deg);
  }
  .t11 {
    transform: rotate(-100deg) translate(calc(100% + 150px)) rotate(180deg);
  }
  .t12 {
    transform: rotate(-118deg) translate(calc(100% + 150px)) rotate(180deg);
  }
  .t13 {
    transform: rotate(-136deg) translate(calc(100% + 150px)) rotate(180deg);
  }
  .t14 {
    transform: rotate(-155deg) translate(calc(100% + 150px)) rotate(180deg);
  }
  .t21 {
    transform: rotate(-177deg) translate(calc(100% + 150px)) rotate(180deg);
  }
  .t22 {
    transform: rotate(-196deg) translate(calc(100% + 150px)) rotate(180deg);
  }
  .t23 {
    transform: rotate(-214deg) translate(calc(100% + 150px)) rotate(180deg);
  }
  .t24 {
    transform: rotate(-229deg) translate(calc(100% + 150px)) rotate(180deg);
  }
  .t31 {
    transform: rotate(-248deg) translate(calc(100% + 150px)) rotate(180deg);
  }
  .t32 {
    transform: rotate(-265deg) translate(calc(100% + 150px)) rotate(0deg);
  }
  .t33 {
    transform: rotate(-285deg) translate(calc(100% + 150px)) rotate(0deg);
  }
  .t34 {
    transform: rotate(-308deg) translate(calc(100% + 150px)) rotate(0deg);
  }
  .t35 {
    transform: rotate(-329deg) translate(calc(100% + 150px)) rotate(0deg);
  }
}

</style>
