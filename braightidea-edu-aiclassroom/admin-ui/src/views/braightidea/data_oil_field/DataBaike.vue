<template>
<div class="data-baike">
  <div class="echarts"></div>
</div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "DataBaike",
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el.querySelector('.echarts'))
      let option = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '文学百科',
            type: 'pie',
            radius: ['35%', '60%'],
            center: ['50%', '50%'],
            // startAngle: 180,
            // endAngle: 360,
            label: {
              formatter: '{b}: {c}',
              fontSize: 16,
              color: '#DDD'
            },
            data: [
              { value: 2421, name: '人物百科' },
              { value: 2962, name: '作品百科' },
              { value: 1902, name: '地名百科' },
              { value: 649, name: '事件百科' }
            ]
          }
        ]
      };
      this.chart.setOption(option);
    }
  }
}
</script>

<style scoped lang="scss">
.data-baike {
  color: #FFF;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  .echarts {
    width: 1100px;
    height: 450px;
  }
}
</style>
