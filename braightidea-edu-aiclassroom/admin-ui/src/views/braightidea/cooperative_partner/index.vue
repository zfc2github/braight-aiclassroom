<template>
  <div class="braightidea-home-cp">
    <el-row :gutter="10">
      <el-col :span="4">
        <img src="/assets/home/cp01.svg" />
      </el-col>
      <el-col :span="4">
        <img src="/assets/home/cp02.svg" />
      </el-col>
      <el-col :span="4">
        <img src="/assets/home/cp03.svg" />
      </el-col>
      <el-col :span="4">
        <img src="/assets/home/cp04.svg" />
      </el-col>
      <el-col :span="4">
        <img src="/assets/home/cp05.svg" />
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">
        <img src="/assets/home/cp06.svg" />
      </el-col>
      <el-col :span="4">
        <img src="/assets/home/cp07.svg" />
      </el-col>
      <el-col :span="4">
        <img src="/assets/home/nanjing-edu-logo.png" style="height: 40px;"/>
      </el-col>
      <el-col :span="4">
        <span>南京大学声学媒体实验室</span>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">
        <span>深圳光启高等理工研究院</span>
      </el-col>
      <el-col :span="4">
        <span>南京普斯康健养老服务中心</span>
      </el-col>
      <el-col :span="4">
        <span>稀捍行动</span>
      </el-col>
      <el-col :span="4">
        <span>深圳市源点人工智能</span>
        <span>技术有限公司</span>
      </el-col>
      <el-col :span="4">
        <span>南京金梭云锦织造研究所</span>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">
        <span>南京市人民政府新闻办公室</span>
      </el-col>
      <el-col :span="4">
        <span>南京市艺术基金</span>
      </el-col>
      <el-col :span="4">
        <span>江南丝绸文化博物馆</span>
      </el-col>
      <el-col :span="4">
        <span>梧翊凰非遗文化传播有限公司</span>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">
        <span>南京金陵金箔集团股份有限公司</span>
      </el-col>
      <el-col :span="4">
        <span>南京文化投资控股集团</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cps: [],
    }
  },
  methods: {
  },
  mounted() {}
}
</script>

<style scoped lang="scss">
.braightidea-home-cp {
  width: 1000px;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  /*border: 1px solid red;*/

  > div {
    width: 100%;
    margin: 8px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    > .el-col {
      height: 54px;
      padding: 4px 20px;
      background-color: #FFFFFF;
      border: 1px solid #45E02A;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 10px;
      border-radius: 10px;

      span {
        text-align: center;
        font-size: 12px;
      }
      img {

      }
    }
  }
}
</style>
