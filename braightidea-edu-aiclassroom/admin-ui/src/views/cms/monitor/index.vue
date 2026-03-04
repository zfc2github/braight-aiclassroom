<template>
  <div class="monitor-container">
    <!-- 顶部统计卡片：登录失败率 -->
    <el-card class="stat-card" shadow="hover">
      <div class="stat-content">
        <div class="stat-label">登录失败率</div>
        <div class="stat-value" :class="{ 'warning': isFailureRateHigh }">{{ loginFailureRate }}</div>
      </div>
    </el-card>

    <div class="lists-container">
      <!-- 左侧列表：接口耗时 TOP20 -->
      <el-card class="list-card" shadow="hover">
        <div slot="header" class="card-header">
          <span>⏱️ 接口耗时 TOP20 (ms)</span>
        </div>
        <el-table :data="topSlowInterfaces" style="width: 100%" height="600" stripe>
          <el-table-column type="index" label="排名" width="60" align="center"></el-table-column>
          <el-table-column prop="title" label="接口名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mct" label="耗时 (ms)" width="120" align="right">
            <template slot-scope="scope">
              <span :class="getDurationClass(scope.row.mct)">{{ scope.row.mct }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 右侧列表：异常接口 TOP20 -->
      <el-card class="list-card" shadow="hover">
        <div slot="header" class="card-header">
          <span>⚠️ 异常接口 TOP20</span>
        </div>
        <el-table :data="topErrorInterfaces" style="width: 100%" height="600" stripe>
          <el-table-column type="index" label="排名" width="60" align="center"></el-table-column>
          <el-table-column prop="title" label="接口名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="errorMsg" label="异常信息" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag type="danger" effect="plain" size="small">{{ scope.row.errorMsg }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "InterfaceMonitor",
  data() {
    return {
      // 登录失败率数据
      loginFailureRate: '0.00%',

      // 接口耗时列表
      topSlowInterfaces: [],

      // 异常接口列表
      topErrorInterfaces: []
    };
  },
  computed: {
    // 用于判断失败率是否过高以改变样式
    isFailureRateHigh() {
      const value = parseFloat(this.loginFailureRate);
      return value > 5.0; // 假设超过 5% 标红
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    /**
     * 获取监控数据
     * 实际开发中请替换为真实的 API 请求，例如:
     * const res = await this.$api.getMonitorData();
     */
    async fetchData() {
      try {
        // --- 模拟数据开始 ---
        /*// 模拟登录失败率
        this.loginFailureRate = '2.35%';

        // 模拟耗时 TOP20
        this.topSlowInterfaces = Array.from({ length: 20 }).map((_, index) => ({
          title: `/api/v1/resource/heavy-load-${index + 1}`,
          mct: Math.floor(Math.random() * 2000) + 500 // 500ms - 2500ms
        }));

        // 模拟异常 TOP20
        const errorMessages = ['Timeout', 'NullPointer', 'DB Connection Failed', 'Auth Failed', 'Service Unavailable'];
        this.topErrorInterfaces = Array.from({ length: 20 }).map((_, index) => ({
          title: `/api/v1/service/critical-${index + 1}`,
          errorMsg: errorMessages[Math.floor(Math.random() * errorMessages.length)]
        }));*/
        // --- 模拟数据结束 ---

        // TODO: 在此处调用真实接口
        request({
          url: '/api/interfaceMonitor/loginErrorRate',
          method: 'get'
        })
          .then(response => {
            this.loginFailureRate = response?.data || '0.00%';
          });
        request({
          url: '/api/interfaceMonitor/top20CostTime',
          method: 'get'
        })
          .then(response => {
            this.topSlowInterfaces = response?.data || [];
          });
        request({
          url: '/api/interfaceMonitor/top20Error',
          method: 'get'
        })
          .then(response => {
            this.topErrorInterfaces = response?.data || [];
          });

      } catch (error) {
        console.error('获取监控数据失败:', error);
        this.$message.error('加载监控数据失败');
      }
    },

    /**
     * 根据耗时返回不同的文字颜色类
     * @param {number} ms - 耗时毫秒数
     */
    getDurationClass(ms) {
      if (ms > 1000) return 'text-danger';
      if (ms > 500) return 'text-warning';
      return 'text-success';
    }
  }
};
</script>

<style lang="scss" scoped>
.monitor-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;

  .stat-card {
    margin-bottom: 20px;
    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .stat-label {
        font-size: 16px;
        color: #606266;
        font-weight: bold;
      }
      .stat-value {
        font-size: 32px;
        font-weight: bold;
        color: #303133;
        &.warning {
          color: #f56c6c;
        }
      }
    }
  }

  .lists-container {
    display: flex;
    gap: 20px;

    @media (max-width: 1200px) {
      flex-direction: column;
    }

    .list-card {
      flex: 1;
      .card-header {
        font-weight: bold;
        font-size: 16px;
        color: #303133;
      }
    }
  }
}

// 辅助颜色类
.text-danger {
  color: #f56c6c;
  font-weight: bold;
}
.text-warning {
  color: #e6a23c;
  font-weight: bold;
}
.text-success {
  color: #67c23a;
  font-weight: bold;
}
</style>
