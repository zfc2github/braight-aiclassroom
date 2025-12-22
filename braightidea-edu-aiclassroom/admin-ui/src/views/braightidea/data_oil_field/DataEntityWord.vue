<template>
<div class="data-entity-word">
  <div class="icon-data-circle d-e-w-liu">
    <span class="num">6742</span>
    <span class="d-e-w-title">六朝</span>
    <span class="icon-data-line-vert"></span>
  </div>
  <div class="icon-data-circle d-e-w-ming">
    <span class="num">7408</span>
    <span class="d-e-w-title">明朝</span>
    <span class="icon-data-line-vert"></span>
  </div>
  <div class="icon-data-circle d-e-w-qing">
    <span class="num">5435</span>
    <span class="d-e-w-title">清朝</span>
    <span class="icon-data-line-vert"></span>
  </div>
  <div class="icon-data-circle d-e-w-d">
    <span class="num">15298</span>
    <span class="d-e-w-title">当代</span>
    <span class="icon-data-line-vert"></span>
  </div>
  <div class="icon-data-circle d-e-w-j">
    <span class="num">16726</span>
    <span class="d-e-w-title">近代</span>
    <span class="icon-data-line-vert"></span>
  </div>
  <div class="icon-data-circle d-e-w-nanjing">
    <span class="num">12791</span>
    <span class="d-e-w-title">南京大屠杀</span>
    <span class="icon-data-line-vert"></span>
  </div>
  <div class="line"></div>
</div>
</template>

<script>

export default {
  name: "DataEntityWord",
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.data-entity-word {
  color: #FFF;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;

  .icon-data-circle {
    position: relative;
    background-image: url("/assets/home/icon-data-circle.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 100%;
    z-index: 10;

    span {
      position: absolute;
      font-weight: bold;
      width: 100%;
      text-align: center;

      &.num {
        font-size: 32px;
        top: calc(50% - 50px);
      }
      &.d-e-w-title {
        font-size: 20px;
        bottom: 40px;
      }
      &.icon-data-line-vert {
        width: 8px;
        height: 180px;
        background-image: url("/assets/home/icon-data-line-vert.svg");
        top: calc(50% - 2px);
        left: calc(50% - 4px);
        background-size: contain;
        background-repeat: no-repeat;
      }
    }
  }

  .d-e-w-liu {
    width: 150px;
  }
  .d-e-w-ming {
    width: 180px;
    margin-left: -30px;
  }
  .d-e-w-qing {
    width: 140px;
    margin-left: 2px;
  }
  .d-e-w-d {
    width: 240px;
    margin-left: -30px;
  }
  .d-e-w-j {
    width: 300px;
    margin-left: -60px;
  }
  .d-e-w-nanjing {
    width: 220px;
    margin-left: -100px;
  }
  .line {
    position: absolute;
    width: 100%;
    height: 1px;
    background: #D1D1D1;
    z-index: 0;
  }
}
</style>
