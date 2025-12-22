<template>
<div class="data-literature">
  <div class="d-l-echarts"></div>
</div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "DataLiterature",
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
      this.chart = echarts.init(this.$el.querySelector('.d-l-echarts'))
      let series = [
        {
          data: [190, 478, 124, 80, 32, 243, 152, 1, 0],
          type: 'bar',
          stack: 'a',
          name: '诗歌',
          barMinHeight: 20,
          barMinWidth: 70,
          label: {
            show: true,
            color: '#5D534A',
            fontSize: 16,
            position: 'inside',
            formatter: '{a} {c}'
          }
        },
        {
          data: [13, 1, 0, 1, 0, 14, 16, 32, 24],
          type: 'line',
          stack: 'a',
          name: '文献',
          label: {
            show: true,
            fontSize: 16,
            color: '#F7F3E9',
            padding: [10, 0, 0, 0],
            position: 'top',
            formatter: '{a} {c}'
          }
        },
      ];
      let option = {
        legend: {
          data: [ '诗歌', '文献' ],
          textStyle: {
            color: '#DDD',
            fontSize: 16
          }
        },
        color: [ '#fff369', '#50a0ff' ],
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            color: '#FFF',
            fontSize: 16,
            fontWeight: 'bold',
          },
          data: ['六朝', '唐朝', '南唐', '宋朝', '元朝', '明朝', '清朝', '近代', '当代']
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show:false
          },
          labelSize: 20,
        },
        series: series
      };
      this.chart.setOption(option);
    }
  }
}
</script>

<style scoped lang="scss">
.data-literature {
  color: #FFF;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  .d-l-echarts {
    width: 1100px;
    height: 450px;
  }
}
</style>
