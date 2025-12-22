<template>
<div class="data-core-word">
  <div class="d-c-w-echarts"></div>
</div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "DataCoreWord",
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
      this.chart = echarts.init(this.$el.querySelector('.d-c-w-echarts'))
      let option = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '核心词表',
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
              { value: 2962, name: '文学作品' },
              { value: 2421, name: '文学人物' },
              { value: 649, name: '文学事件' },
              { value: 1902, name: '地理点位' }
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
.data-core-word {
  color: #FFF;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  .d-c-w-echarts {
    width: 1100px;
    height: 450px;
  }
}
</style>
