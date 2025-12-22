<template>
  <div class="data-knowledge-graph">
    <div class="d-k-g-echarts"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "DataKnowledgeGraph",
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
      this.chart = echarts.init(this.$el.querySelector('.d-k-g-echarts'))
      let series = [
        {
          data: [62437, 65100, 139212, 2053],
          type: 'bar',
          stack: 'a',
          name: '实体关系',
          barMinHeight: 20,
          barMinWidth: 70,
          label: {
            show: true,
            color: '#F7F3E9',
            fontSize: 16,
            position: 'top',
            formatter: '{a}\n{c}'
          }
        },
        {
          data: [14772, 17178, 33006, 0],
          type: 'bar',
          stack: 'b',
          name: '核心词表',
          barMinHeight: 0,
          label: {
            show: true,
            fontSize: 16,
            color: '#F7F3E9',
            padding: [10, 0, 0, 0],
            position: 'top',
            formatter: '{a}\n{c}'
          }
        },
      ];
      let option = {
        legend: {
          data: ['实体关系', '核心词表'],
          textStyle: {
            color: '#DDD',
            fontSize: 16
          }
        },
        color: ['#fff369', '#50a0ff'],
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            color: '#FFF',
            fontSize: 16,
            fontWeight: 'bold'
          },
          data: ['建康实录', '南齐书', '南史', '世说新语']
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
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
.data-knowledge-graph {
  color: #FFF;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  .d-k-g-echarts {
    width: 1100px;
    height: 450px;
  }
}
</style>
