<template>
  <el-row :gutter="0" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            资产数量
          </div>
          <count-to :start-val="0" :end-val="stats.resourceTotal" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
<!--          <svg-icon icon-class="dashboard" class-name="card-panel-icon" />-->
          <el-icon class="el-icon-picture fontsize48"></el-icon>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            图片数量
          </div>
          <count-to :start-val="0" :end-val="stats.resourceImageTotal" :duration="2100" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-money">
<!--          <svg-icon icon-class="phone" class-name="card-panel-icon" />-->
          <el-icon class="el-icon-video-camera fontsize48"></el-icon>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            视频数量
          </div>
          <count-to :start-val="0" :end-val="stats.resourceVideoTotal" :duration="1200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-shopping">
<!--          <svg-icon icon-class="radio" class-name="card-panel-icon" />-->
          <el-icon class="el-icon-headset fontsize48"></el-icon>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            音频数量
          </div>
          <count-to :start-val="0" :end-val="stats.resourceAudioTotal" :duration="1000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="log" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            文本数量
          </div>
          <count-to :start-val="0" :end-val="stats.resourceTextTotal" :duration="1000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import {queryResourceStats} from "@/views/dashboard/dashboard_util";

export default {
  components: {
    CountTo
  },
  data() {
    return {
      stats: {
        resourceTotal: 0,
        resourceImageTotal: 0,
        resourceVideoTotal: 0,
        resourceAudioTotal: 0,
        resourceTextTotal: 0,
      }
    };
  },
  created() {
    this.query();
  },
  methods: {
    query() {
      queryResourceStats().then(response => {
        this.stats = response.data;
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  flex-wrap: wrap;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    //cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        //background: #40c9c6;
        background: gold;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      //color: #40c9c6;
      color: gold;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      margin-right: 12px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
.fontsize48 {
  font-size: 48px;
}
@media (max-width:1700px) {
  .card-panel-icon-wrapper {
    display: none;
  }
  .panel-group .card-panel .card-panel-description {
    float: left;
    margin: 26px;
  }
}
</style>
