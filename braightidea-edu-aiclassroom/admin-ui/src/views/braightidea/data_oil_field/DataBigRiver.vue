<template>
<div class="data-big-river">
  <el-row>
    <el-col :span="12">
      <div class="echarts echarts1"></div>
    </el-col>
    <el-col :span="12">
      <div class="echarts echarts2"></div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "DataBigRiver",
  data() {
    return {
      chart1: null,
      chart2: null
    }
  },
  mounted() {
    this.initChart1();
    this.initChart2();
  },
  methods: {
    initChart1() {
      this.chart1 = echarts.init(this.$el.querySelector('.echarts1'))
      let option = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '音视频资料',
            type: 'pie',
            radius: ['35%', '50%'],
            center: ['50%', '50%'],
            // startAngle: 180,
            // endAngle: 360,
            minAngle: 25,
            label: {
              formatter: '{b}: {c}',
              fontSize: 16,
              color: '#DDD'
            },
            data: [
              { value: 24, name: '口述史讲述人' },
              { value: 10, name: '城市' },
              { value: 5305, name: '拍摄照片' },
              { value: 384, name: '地图' },
              { value: 79, name: '考古图片' },
              { value: 343, name: '视频' },
              { value: 4, name: '影像剧' },
              { value: 19, name: '影像集' },
            ]
          }
        ]
      };
      this.chart1.setOption(option);
    },
    initChart2() {
      this.chart2 = echarts.init(this.$el.querySelector('.echarts2'))
      let option = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '文献资料',
            type: 'pie',
            radius: ['35%', '50%'],
            center: ['50%', '50%'],
            // startAngle: 180,
            // endAngle: 360,
            minAngle: 10,
            label: {
              formatter: '{b}: {c}',
              fontSize: 16,
              color: '#DDD'
            },
            data: [
              { value: 16, name: '历史典籍' },
              { value: 44, name: '地方志' },
              { value: 44, name: '近现代文献' },
              { value: 5, name: '国家' },
              { value: 17, name: '国际出版物' },
              { value: 86, name: '新闻' },
              { value: 28, name: '广告' },
            ]
          }
        ]
      };
      this.chart2.setOption(option);
    }
  }
}
</script>

<style scoped lang="scss">
.data-big-river {
  color: #FFF;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  .echarts {
    width: 550px;
    height: 450px;
  }
}
</style>
