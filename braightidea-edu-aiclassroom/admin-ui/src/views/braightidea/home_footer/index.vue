<template>
  <div class="braightidea-home-footer">
    <el-row :gutter="20" class="footer-wrapper">
      <el-col :span="6">
        <div class="h-f-title">公司介绍</div>
        <div class="content">
          <p>使命：<span>以创新科技和人文关怀，重塑面向未来的文化遗产</span></p>
          <p>愿景：<span>塑造超越时空、全球共享的数字文遗网络</span></p>
          <p>战略：<span>基于文化基因数据库，运用先进的AI技术、创新的视觉呈现和灵活的交互方式，优化文化资产的管理和展示，提升文化遗产的全球互动与传播</span></p>
        </div>
        <el-divider></el-divider>
        <div class="h-f-title">联系我们</div>
        <div class="img-wrapper"><img src="../../../assets/home/contact-us.png" /></div>
        <div class="img-mark">和光未来二维码</div>
      </el-col>
      <el-col :span="6">
        <div class="h-f-title">技术实力</div>
        <div class="content">
          <p>纹样处理方法、电子设备及可读存储介质</p>
          <p>知识网络构建方法、装置、设备及存储介质</p>
          <p>中文命名实体识别及分类方法及装置</p>
          <br/>
          <p>文本数据清理与智能分词协作平台V1.0</p>
          <p>团队协作式项目管理系统V1.0</p>
          <p>纹样图像一键矢量化软件V1.0</p>
          <p>纹样图像多分类识别软件V1.0</p>
          <p>非遗文化动态词云关联分析系统V1.0</p>
          <p>非遗领域趋势分析系统V1.0</p>
          <p>非遗文化可视化地图系统V1.0</p>
          <p>非遗文化智能分析分析平台V1.0</p>
          <p>色彩分析系统V1.0</p>
          <p>图案一键线稿化软件V1.0</p>
          <p>纹样识别分析系统V1.0</p>
          <p>ZHI艺非物质文化遗产虚拟展示平台V1.0</p>
          <p>影像历史管理系统V1.0</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="h-f-title">专家团队</div>
        <div class="content">
          <el-col :span="8">
            <p>陈静</p>
            <p>陈皓</p>
            <p>季春霖</p>
            <p>邓柯</p>
            <p>刘健</p>
            <p>李路珂</p>
            <p>鲁安东</p>
            <p>何捷</p>
            <p>夏翠娟</p>
            <p>王继胜</p>
            <p>龚辛</p>
          </el-col>
          <el-col :span="8">
            <p>邰高娣</p>
            <p>高剑波</p>
            <p>钟建明</p>
            <p>王涛</p>
            <p>陈刚</p>
            <p>陈振宇</p>
            <p>祁庆国</p>
            <p>张莅坤</p>
          </el-col>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="h-f-title">合作伙伴</div>
        <div class="content">
          <p>南京大学艺术学院</p>
          <p>南京市文化馆</p>
          <p>南京艺术学院</p>
          <p>清华大学</p>
          <p>南京普斯康健养老服务中心</p>
          <p>白银有色集团股份有限公司</p>
          <p>零壹工作室</p>
          <p>南京大学声学媒体实验室</p>
          <p>深圳市源点人工智能技术有限公司</p>
          <p>南京市人民政府新闻办公室</p>
          <p>南京市艺术基金</p>
          <p>南京金梭云锦织造研究所</p>
          <p>稀捍行动</p>
          <p>南京文化投资控股集团</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {}
}
</script>

<style scoped lang="scss">
.braightidea-home-footer {
  width: 90%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /*border: 1px solid yellow;*/

  .footer-wrapper {
    height: 100%;
    width: 100%;
    > .el-col {
      height: 100%;
      /*border: 1px solid green;*/
      .h-f-title {
        font-size: 24px;
        font-weight: bold;
        color: #FFFFFF;
        margin-bottom: 20px;
      }
      .content {
        font-size: 14px;
        color: #FFFFFF;
        width: 100%;
        > div {
          margin-top: -14px;
        }
      }
      .el-divider--horizontal {
        width: 70%;
      }
      .img-wrapper {
        width: 122px;
        height: 122px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .img-mark {
        font-size: 16px;
        color: #FFFFFF;
        margin-top: 10px;
      }
    }
  }
}
</style>
