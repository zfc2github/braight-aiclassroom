<template>
  <div class="idea-subject-database-detail">
    <el-row class="i-r-s-header" :gutter="10">
      <el-col :span="4" class="header-l">
        <el-button icon="el-icon-back" type="text" size="small" @click="handleBack">关闭</el-button>
      </el-col>
    </el-row>
    <el-row class="i-r-s-main" :gutter="40">
      <el-col :xs="12" :sm="14" :md="15" :lg="17" :xl="18" class="main-l">
        <el-row class="m-r-1">
          <el-col :span="24" class="m-r-1-label1">{{ subjectDatabaseDetail.sdName?subjectDatabaseDetail.sdName:'' }}</el-col>
          <el-col :span="24" class="m-r-1-label2">{{ subjectDatabaseDetail.sdTitle?subjectDatabaseDetail.sdTitle:'' }}</el-col>
          <el-col :span="24" class="m-r-1-divider">
            <el-divider/>
          </el-col>
          <el-col :span="24" class="m-r-1-images">
            <el-carousel height="600px"
                         indicator-position="outside"
                         arrow="never">
              <el-carousel-item v-for="n in detailImages" :key="n.file_path">
                <img :src="n.file_path" v-viewer />
              </el-carousel-item>
            </el-carousel>
          </el-col>
          <el-col :span="24" class="m-r-1-description">
            {{ subjectDatabaseDetail.sdDescription }}
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="12" :sm="10" :md="9" :lg="7" :xl="6" class="main-r">
        <el-row class="main-r-1">
          <div><label>专题数据库简介</label></div>
          <div>
            <p class="main-r-1-subject-database">
              <span class="svg-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="14" height="14" viewBox="0 0 14 14"><defs><clipPath id="master_svg0_17_0575"><rect x="0" y="0" width="14" height="14" rx="0"/></clipPath></defs><g clip-path="url(#master_svg0_17_0575)"><g transform="matrix(1,0,0,-1,0,26.8515625)"><g><path d="M0.875,25.67578125L13.125,25.67578125L0.875,25.67578125L13.125,25.67578125Q13.5078,25.67578125,13.7539,25.42968125Q14,25.18358125,14,24.80078125L14,23.92578125Q14,23.54298125,13.7539,23.296871250000002Q13.5078,23.05078125,13.125,23.05078125L0.875,23.05078125Q0.492188,23.05078125,0.246094,23.296871250000002Q0,23.54298125,0,23.92578125L0,24.80078125Q0,25.18358125,0.246094,25.42968125Q0.492188,25.67578125,0.875,25.67578125ZM0.875,22.17578125L13.125,22.17578125L0.875,22.17578125L13.125,22.17578125L13.125,15.17578125Q13.0977,14.43750125,12.6055,13.94531225Q12.1133,13.45312505,11.375,13.42578125L2.625,13.42578125Q1.88672,13.45312505,1.39453,13.94531225Q0.902344,14.43750125,0.875,15.17578125L0.875,22.17578125ZM4.375,19.98828125Q4.40234,19.57812125,4.8125,19.55078125L9.1875,19.55078125Q9.59766,19.57812125,9.625,19.98828125Q9.59766,20.39844125,9.1875,20.42578125L4.8125,20.42578125Q4.40234,20.39844125,4.375,19.98828125Z" fill="#FFFFFF" fill-opacity="1" style="mix-blend-mode:passthrough"/></g></g></g></svg>
              </span>
              <el-link type="primary"
                       :underline="false"
                       style="font-size:16px;font-weight:400;line-height:24px;letter-spacing:normal;vertical-align: baseline;"
                       @click="handleSubjectDatabaseClick(subjectDatabaseDetail.sdUrl)">
                {{ subjectDatabaseDetail.sdName}}
              </el-link>
            </p>
          </div>
          <el-row class="main-r-1-properties">
            <el-col :span="8">时间</el-col>
            <el-col :span="16">{{ subjectDatabaseDetail.sdPeriodDate }}</el-col>
          </el-row>
          <el-row class="main-r-1-properties">
            <el-col :span="8">合作方</el-col>
            <el-col :span="16">{{ subjectDatabaseDetail.sdPartner }}</el-col>
          </el-row>
          <el-row class="main-r-1-properties">
            <el-col :span="8">关键词</el-col>
            <el-col :span="16">{{ subjectDatabaseDetail.sdKeywords }}</el-col>
          </el-row>
          <el-row class="main-r-1-properties">
            <el-col :span="8">数据概览</el-col>
            <el-col :span="16">{{ subjectDatabaseDetail.sdDataViews }}</el-col>
          </el-row>
        </el-row>
        <el-divider></el-divider>
        <el-row class="main-r-2"></el-row>
      </el-col>
    </el-row>
    <el-row class="i-r-s-footer" :gutter="10"></el-row>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "SubjectDatabaseDetail",
  data() {
    return {
      sdBusinessTag: null,
      subjectDatabaseDetail: {},
      detailImages: [],
    }
  },
  computed: {},
  methods: {
    handleSubjectDatabaseClick(url) {
      window.open(url, "_blank");
    },
    handleBack() {
      window.close();
    },
    querySubjectDatabaseDetail() {
      return request({
        url: '/api/resourceSearch/subjectDatabase/detailByBusinessTag/'+this.sdBusinessTag,
        method: 'get',
      }).then(response => {
        if (response.code === 200) {
          this.subjectDatabaseDetail = response.data;
          if (this.subjectDatabaseDetail.sdImageUrls) {
            let urls = this.subjectDatabaseDetail.sdImageUrls.split(',');
            for (let idx in urls) {
              this.detailImages.push({file_path: urls[idx] });
            }
          }
        } else {
          this.$message.error('查询资源信息失败：' + response.msg);
        }
      });
    },
  },
  async mounted() {
    this.sdBusinessTag = this.$route?.query?.sdBusinessTag;
    await this.querySubjectDatabaseDetail();
  }
}
</script>

<style scoped lang="scss">
.idea-subject-database-detail {
  font-family: Roboto;

  padding: 0;
  width: 100%;
  overflow: hidden;
  font-size: 14px;
  background-color: #ffffff;

  > div {
    padding: 0 40px;
  }

  .i-r-s-header {
    height: 50px;
    box-shadow: 0 5px 10px rgba(128, 128, 128, 0.5);

    > div {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .header-l {
      img {
        height: 40px;
      }
    }
  }

  .i-r-s-main {
    height: calc(100vh - 100px);
    padding-top: 48px;
    overflow-y: auto;

    .main-l {
      .m-r-1 {
        > div {
          margin-bottom: 8px;
        }
        .m-r-1-label1 {
          font-size: 24px;
          font-weight: bold;
          line-height: 32px;
          letter-spacing: normal;
          color: #2A5CAA;
        }
        .m-r-1-label2 {
          font-size: 14px;
          font-weight: normal;
          line-height: 20px;
          letter-spacing: normal;
          color: #4B5563;
        }
        .m-r-1-divider {
          .el-divider--horizontal {
            margin: 16px 0;
          }
        }
        .m-r-1-images {
          text-align: center;
          padding-right: 50px;
          .el-carousel__container {
            > div {
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
          ::v-deep img {
            max-width: 100%;
            max-height: 100%;
          }
        }
        .m-r-1-description {
          font-size: 16px;
          font-weight: normal;
          line-height: 26px;
          letter-spacing: normal;
          color: #374151;
        }
      }
    }

    .main-r {
      padding: 24px;
      border-radius: 12px;
      background: #F9FAFB;
      min-height: 800px;
      display: flex;
      flex-direction: column;
      > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
      }
      label {
        font-size: 18px;
        font-weight: 500;
        line-height: 28px;
        letter-spacing: normal;
        color: #000000;
      }
      p {
        font-size: 16px;
        font-weight: normal;
        line-height: 24px;
        letter-spacing: normal;
        color: #374151;
        margin: 16px 0;
      }

      .main-r-1 {
        font-weight: 500;
        font-size: 18px;
        color: #111827;

        > div {
          width: 100%;
        }
        .main-r-1-subject-database {
          display: flex;
          align-items: center;
          > span.svg-wrapper {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 32px;
            height: 32px;
            border-radius: 9999px;
            background: #C62F2F;
            margin-right: 8px;
            > svg {
              width: 14px;
              height: 14px;
            }
          }
        }
        .main-r-1-properties {
          > div {
            font-size: 14px;
            font-weight: normal;
            line-height: 20px;
            letter-spacing: normal;
            color: #6B7280;
            margin: 8px 0;
          }
        }
      }

      .m-r-list {
        display: flex;
        flex-wrap: wrap;
        overflow-y: auto;
        height: 1024px;
        align-items: flex-start;
        justify-content: flex-start;

        > div {
          min-width: 269px;
          margin-right: 20px;
        }

      }

    }
  }
}
</style>
