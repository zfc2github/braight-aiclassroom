<template>
<div class="data-traditionowlab">
  <el-row class="d-t-row">
    <el-col :span="5" class="blue">
      <div class="d-t-item">
        <div class="num">20+</div>
        <div class="d-t-title">核心文遗词表</div>
        <div class="mark">（类别）</div>
      </div>
      <div class="back"></div>
    </el-col>
    <el-col :span="5" class="blue">
      <div class="d-t-item">
        <div class="num">100+</div>
        <div class="d-t-title">工艺知识图谱</div>
        <div class="mark">（类别）</div>
      </div>
      <div class="back"></div>
    </el-col>
    <el-col :span="5" class="blue">
      <div class="d-t-item">
        <div class="num">10+</div>
        <div class="d-t-title">藏品评估指标</div>
      </div>
      <div class="back"></div>
    </el-col>
  </el-row>
  <el-row class="d-t-row">
    <el-col :span="5" class="red">
      <div class="d-t-item">
        <div class="d-t-title">藏品图片</div>
        <div class="num">80万</div>
        <div class="mark">张</div>
      </div>
      <div class="back"></div>
    </el-col>
    <el-col :span="5" class="red">
      <div class="d-t-item">
        <div class="d-t-title">工艺文献</div>
        <div class="num">3430万</div>
        <div class="mark">字</div>
      </div>
      <div class="back"></div>
    </el-col>
    <el-col :span="5" class="red">
      <div class="d-t-item">
        <div class="d-t-title">工艺影音</div>
        <div class="num">2300</div>
        <div class="mark">分钟</div>
      </div>
      <div class="back"></div>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  name: "DataTraditionowlab"
}
</script>

<style scoped lang="scss">
.data-traditionowlab {
  color: #FFF;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  .d-t-row {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .d-t-item {
      position: relative;
      width: 170px;
      height: 170px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;

      .d-t-title {
        font-size: 18px;
      }
      .num {
        font-size: 38px;
        font-weight: bold;
        transition: font-size 0.3s ease;
      }
      &:hover .num {
        font-size: 48px;
      }
      .mark {
        font-size: 16px;
      }
    }
    > div {
      position: relative;
    }
    > div.blue > .d-t-item {
       background-color: #4193d1;
      z-index: 10;
    }
    > div.red > .d-t-item {
      background-color: #d02c75;
      z-index: 10;
    }
    > div > .back {
      position: absolute;
      width: 190px;
      height: 190px;
      top: -10px;
      left: -10px;
      z-index: 0;
      border-radius: 50%;
    }
    > div.blue > .back {
      background-color: #dbebf6;
    }
    > div.red > .back {
      background-color: #f6d7e5;
    }
  }
}
</style>
