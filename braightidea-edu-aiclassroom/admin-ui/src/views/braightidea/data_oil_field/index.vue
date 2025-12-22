<template>
  <div class="braightidea-home-dataoilfield">
    <div class="dataoilfield-icon-up" :class="activeUp?'active':''">
      <i class="arrow-up" @click="handlePrev"></i>
    </div>
    <div class="content-wrapper">
      <div v-for="(item, idx) in dataList"
           :key="idx"
           class="row-item"
           :class="active===idx?'active':''">
        <div :ref="'rowItem'+idx"
             class="r-i-content"
             :key="idx"
             :class="active===idx?'active':''">
            <div class="item-left">
              <div v-show="active!==idx" class="i-l-line"></div>
              <div v-show="active===idx" class="i-l-content">
                <div style="width: 100%;height: 100%;">
                  <component :is="item.componentName" />
                </div>
              </div>
            </div>
            <div class="item-right">
              <div class="i-r-title" @click="handleSlideClick(idx)">{{ item.title }}</div>
              <div class="i-r-summary" v-show="active===idx">{{ item.summary }}</div>
            </div>
          </div>
      </div>
    </div>
    <div class="dataoilfield-icon-down" :class="activeDown?'active':''">
      <i class="arrow-down" @click="handleNext"></i>
    </div>
  </div>
</template>

<script>

import DataTraditionowlab from "@/views/braightidea/data_oil_field/DataTraditionowlab";
import DataLiterature from "@/views/braightidea/data_oil_field/DataLiterature";
import DataCoreWord from "@/views/braightidea/data_oil_field/DataCoreWord";
import DataEntityWord from "@/views/braightidea/data_oil_field/DataEntityWord";
import DataKnowledgeGraph from "@/views/braightidea/data_oil_field/DataKnowledgeGraph";
import DataBaike from "@/views/braightidea/data_oil_field/DataBaike";
import DataHeritage from "@/views/braightidea/data_oil_field/DataHeritage";
import DataBigRiver from "@/views/braightidea/data_oil_field/DataBigRiver";

export default {
  components: {
    DataTraditionowlab,
    DataLiterature,
    DataCoreWord,
    DataEntityWord,
    DataKnowledgeGraph,
    DataBaike,
    DataHeritage,
    DataBigRiver,
  },
  data() {
    return {
      dataList: [
        {
          index: 0,
          title: '非遗数据',
          summary: '从历史文献文本数据中提取并分类的词语，以及从专业辞典中提取的实体词，涉及地名、人名、人文景观、社会机构、身份、事件和典故、文化习俗和宗教、意象、自然景观、作品等类别。',
          componentName: 'data-traditionowlab',
        },
        {
          index: 1,
          title: '历史文献文本数据',
          summary: '共校对101本文献，1300首诗歌，1637万字。',
          componentName: 'data-literature',
        },
        {
          index: 2,
          title: '核心词表',
          summary: '文学作品、文学人物、文学事件、地理点位。',
          componentName: 'data-core-word',
        },
        {
          index: 3,
          title: '文学实体词表',
          summary: '从历史文献文本数据中提取并分类的词语，以及从专业辞典中提取的实体词，涉及地名、人名、人文景观、社会机构、身份、事件和典故、文化习俗和宗教、意象、自然景观、作品等类别。',
          componentName: 'data-entity-word',
        },
        {
          index: 4,
          title: '知识图谱',
          summary: '基于文学实体词表，从《建康实录》、《南齐书》、《南史》、《世说新语》中提取实体关系与核心词表关系，并基于全部历史文献文本数据构建相关主题知识图谱，包括经济、景观、人物传记、诗歌、外交、文化民俗、宗教等主题。',
          componentName: 'data-knowledge-graph',
        },
        {
          index: 5,
          title: '文学百科',
          summary: '基于核心词表，以及从历史文献文本数据中进行知识发现得到的相关文学实体信息，构建一个基于大数据和算法分析的，多维度、多专题的南京文学百科网络。',
          componentName: 'data-baike',
        },
        {
          index: 6,
          title: '文物数据',
          summary: '',
          componentName: 'data-heritage',
        },
        {
          index: 7,
          title: '大运河数据',
          summary: '中国大运河江苏段沿岸从南至北的10个城市:苏州、无锡、常州、镇江、扬州、高邮、宝应、淮安、徐州和宿迁。',
          componentName: 'data-big-river',
        },
      ],
      active: 0,
    }
  },
  computed: {
    activeUp() {
      return this.active === 0;
    },
    activeDown() {
      return this.active === this.dataList.length - 1;
    },
  },
  methods: {
    handlePrev() {
      if (this.active === 0) {
        return;
      }
      this.active--;
    },
    handleNext() {
      if (this.active === this.dataList.length - 1) {
        return;
      }
      this.active++;
    },
    handleSlideClick(index) {
      if (this.active === index) {
        return;
      }
      setTimeout(() => {
        this.active = index;
      }, 100);
    },
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">
.braightidea-home-dataoilfield {
  padding: 40px 0 40px 50px;
  width: 100%;

  .dataoilfield-icon-up {
    height: 6%;
    display: flex;
    align-items: center;
    i {
      display: inline-block;
      width: 45px;
      height: 23px;
      background-image: url("../../../assets/home/arrow-up.svg");
      position: relative;
      left: 80%;
      cursor: pointer;
    }
    &.active i {
      filter: brightness(0.5);
    }
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 88%;

    > div {
      padding: 8px 0;
    }

    .row-item {
      min-height: 38px;

      > div {
        display: flex;
        justify-content: space-between;
        &.r-i-content {
          height: 0;
          transition: height 0.5s ease;
        }
      }

      .item-left {
        flex-basis: 80%;
        flex-grow: 8;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .i-l-line {
          width: 100%;
          height: 1px;
          border-bottom: 1px dashed #ccc;
        }

        .i-l-content {
          height: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          transition: height 0.5s ease;
        }
      }
      .r-i-content.active {
        height: 500px;
        transition: height 0.5s ease;
        .item-left {
          .i-l-content {
            height: 500px;
          }
        }
        .item-right {
          .i-r-title {
            color: #FFFFFF;
          }
          .i-r-summary {
            width: 60%;
          }
        }
      }
      .item-right {
        flex-basis: 20%;
        flex-grow: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        margin-left: 20px;
        font-size: 12px;
        font-weight: normal;
        line-height: 14px;
        color: #BABABA;

        .i-r-title {
          font-size: 24px;
          font-weight: bold;
          line-height: 28px;
          color: #B0B0B0;
          margin-bottom: 10px;
          cursor: pointer;

        }
      }
    }
  }

  .dataoilfield-icon-down {
    height: 6%;
    display: flex;
    align-items: center;
    i {
      display: inline-block;
      width: 45px;
      height: 23px;
      background-image: url("../../../assets/home/arrow-down.svg");
      position: relative;
      left: 80%;
      cursor: pointer;
    }
    &.active i {
      filter: brightness(0.5);
    }
  }
}

</style>
