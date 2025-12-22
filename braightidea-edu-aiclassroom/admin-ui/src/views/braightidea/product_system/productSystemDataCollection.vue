<template>
  <div class="psas-wrapper">
    <div ref="psasPie" class="echart-1">
    </div>
    <div class="name-zh">数据采集</div>
    <div class="circle">
      <div class="text-container">
        <div class="text t1">历史实物</div>
        <div class="text t2">艺术品</div>
        <div class="text t3">文献</div>
        <div class="text t4">手稿</div>
        <div class="text t5">图书资料</div>
        <div class="text t6">代表性实物</div>
        <div class="text t11">非物质文化遗产</div>
        <div class="text t12">设计素材与案例</div>
        <div class="text t13">扫描</div>
        <div class="text t14">OCR</div>
        <div class="text t21">人工标注</div>
        <div class="text t22">高清摄影</div>
        <div class="text t23">无人机航拍</div>
        <div class="text t24">全景拍摄</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "productSystemDataCollection",
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
              { value: 800, name: '数据对象' },
              { value: 600, name: '技术手段' },
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
    transform: rotate(95deg) translate(250px) rotate(0deg);
  }
  .t2 {
    transform: rotate(70deg) translate(250px) rotate(0deg);
  }
  .t3 {
    transform: rotate(40deg) translate(242px) rotate(0deg);
  }
  .t4 {
    transform: rotate(10deg) translate(242px) rotate(0deg);
  }
  .t5 {
    transform: rotate(-10deg) translate(260px) rotate(0deg);
  }
  .t6 {
    transform: rotate(-30deg) translate(264px) rotate(0deg);
  }
  .t11 {
    transform: rotate(-50deg) translate(280px) rotate(0deg);
  }
  .t12 {
    transform: rotate(-75deg) translate(280px) rotate(0deg);
  }
  .t13 {
    transform: rotate(-112deg) translate(232px) rotate(180deg);
  }
  .t14 {
    transform: rotate(-136deg) translate(232px) rotate(180deg);
  }
  .t21 {
    transform: rotate(-156deg) translate(254px) rotate(180deg);
  }
  .t22 {
    transform: rotate(-180deg) translate(254px) rotate(180deg);
  }
  .t23 {
    transform: rotate(-204deg) translate(264px) rotate(180deg);
  }
  .t24 {
    transform: rotate(-229deg) translate(254px) rotate(180deg);
  }
}

</style>
