<template>
  <el-steps class="braightidea-home-timeline" :active="active" finish-status="wait">
    <template v-for="(item, index) in stepData">
      <div data-v-d4571ee4="" class="el-step is-horizontal" style="margin-right: 0px;" :style="flexBasis(index)">
        <div v-show="item.index>=0" class="el-step__main" :class="active===index?'is-process':'is-wait'">
          <div class="el-step__description" :class="active===index?'is-process':'is-wait'">{{ item.description }}</div>
          <div class="el-step__title" :class="active===index?'is-process':'is-wait'">{{ item.title }}</div>
        </div>
        <div class="el-step__head" :class="active===index?'is-process':'is-wait'">
          <div class="el-step__line" style="margin-right: 0px;">
            <i class="el-step__line-inner" style="transition-delay: -450ms; border-width: 0px; width: 0%;"></i>
          </div>
          <div v-show="item.index>=0" class="el-step__icon is-text" @click="active=index">
            <div class="el-step__icon-inner"></div>
          </div>
          <div class="vertical-line"></div>
          <transition name="fade">
            <div v-if="item.detail && active===index" class="timeline-detail">
            <label class="title">{{ item.detail.label }}</label>
            <label class="sub-title">{{ item.detail.subLabel }}</label>
            <div>{{ item.detail.summary }}</div>
            <div v-if="item.detail.images && item.detail.images.length>0">
              <el-carousel height="300px"
                           indicator-position="outside"
                           arrow="never" v-viewer>
                <el-carousel-item v-for="n in item.detail.images" :key="n">
                  <img class="detail-image" :src="n" />
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          </transition>
        </div>
      </div>
    </template>
  </el-steps>
</template>

<script>
export default {
  name: 'CompanyDevelopment',
  data() {
    return {
      active: 4,
      stepData: [
        {
          index: -1,
        },
        {
          index: 0, title: '2010-2014', description: '',
          detail: {
            label: '中国近现代商业广告数据库',
            subLabel: '合作方：美国莱斯大学',
            summary: '本档案馆以图像为导向、以研究为目的，是一个向学术界开放的在线档案馆。本档案由19世纪末至20世纪中叶在中国主要报纸上刊登的国际品牌广告的高质量数字图片组成，每张图片附有可用于研究的元数据。其内容涵盖所有外国公司所生产和销售的所有商品的广告。我们选取了五个最主要的因条约被迫开放口岸的港口城市中，并选择了其中最重要的商业报纸——包括上海的《申报》、天津的《大公报》、沈阳的《盛京时报》、汉口的《汉口中西报》和广州的《越华报》——以确保样本具有代表性和可比性。',
            images: [
              'assets/home/ccaa-01.png',
              'assets/home/ccaa-02.png',
            ],
          }
        },
        {
          index: 1, title: '2016', description: '',
          detail: {
            label: '中国大运河（江苏段）虚拟展示平台',
            subLabel: '合作方：南京博物馆',
            summary: '',
            images: [
              'assets/home/dyh-01.png',
              'assets/home/dyh-02.png',
            ],
          }
        },
        {
          index: 2, title: '2018', description: '',
          detail: {
            label: 'ZHI艺：非物质文化遗产虚拟展示平台',
            subLabel: '合作方：南京大学、南京市人民政府新闻办公室...',
            summary: '获得2019“中国设计权利榜100”年度案例，入选2020年中国公益慈善项目大赛百强，获得2022“中国数据内容年度案例”，受邀参展2021年深圳文博会。',
            images: [
              'assets/home/zhiyi-01.png',
              'assets/home/zhiyi-02.png',
              'assets/home/zhiyi-03.png',
              'assets/home/zhiyi-04.png',
              'assets/home/zhiyi-05.png',
              'assets/home/zhiyi-06.png',
            ],
          }
        },
        {
          index: 3, title: '2019', description: '',
          detail: {
            label: '中国非物质文化遗产基因数据库',
            subLabel: '合作方：起承研究院',
            summary: '中国非物质文化遗产基因数据库（非遗基因库）是一个基于中国非物质文化遗产大数据的知识共享平台。该数据库搜集、整合了海量中国非物质文化遗产的多媒体资料，搭建了基于专业术语及其知识网络的非遗知识图谱，从工艺、色彩和纹案的维度对非遗知识进行了深入拆解、再现和重组，旨在深入挖掘非遗蕴含的传统文化基因及其演化路径，探索中国非遗在大数据及人工智能时代的创承新模式，助力中国非物质文化遗产的数字化保存与创造性再生。',
            images: [
              'assets/home/tranditionowlab-01.png',
              'assets/home/tranditionowlab-02.png',
              'assets/home/tranditionowlab-03.png',
              'assets/home/tranditionowlab-04.png',
              'assets/home/tranditionowlab-05.png',
            ],
          }
        },
        {
          index: 4, title: '2019', description: '',
          detail: {
            label: '南京云锦数字化保护的开发与应用项目',
            subLabel: '合作方：南京大学、江南丝绸博物馆',
            summary: '2019年与南京大学、江南丝绸博物馆合作建设《南京云锦数字化保护的开发与应用项目》，完成首部数字化云锦色谱，并策划“云锦色彩暨数字化保护成果汇报展”，该项目被评为2020年度江苏省智慧文旅示范项目第一名。',
            images: [

            ],
          },
        },
        {
          index: 5, title: '2020', description: '',
          detail: {
            label: '影像历史数据库',
            subLabel: '合作方：南京艺术学院',
            summary: '影像历史”（英文名 Photographing History）是一个以时间和空间为基本框架的影像数据库项目，旨在以数字化和数据化的方式将底片、照片、信息和历史文本记录转化为模块化的内容，使得摄影者、收藏家及研究者得以在数据框架中共同重组影像的历史，建立不同于经过筛选的艺术影像所书写的历史。',
            images: [
              'assets/home/photographinghistory-01.png',
              'assets/home/photographinghistory-02.png',
            ],
          },
        },
        {
          index: 6, title: '2020', description: '',
          detail: {
            label: '天将RE兽非遗快闪活动',
            subLabel: '合作方：南京市文化馆',
            summary: '南京传统手工艺是南京城市的重要文化遗产,也是南京人民的宝贵精神财富。在经历了万众一心、共志成城的战疫，我们期待着“疫”郁之后的革新和重启，期盼着传统文化所赋予我们新的力量与变的可能。本次活动以“天降RE兽”为主题，以中国传统文化中的“瑞兽”为原型，结合南京云锦织造官补中的瑞兽造型纹样与云锦传统色彩，以设计创新方式打造了一系列具有当代精神的“RE兽”形象，表达了青年人所蕴含的朝气、革新和重启所带来的文化创新力量。',
            images: [
              'assets/home/tianJiangREShou-01.png',
            ],
          }
        },
        {
          index: 7, title: '2022', description: '',
          detail: {
            label: '人类文明数字博物馆（N-Museum）',
            subLabel: '合作方：上海缇安文化',
            summary: 'N- Museum以人类文明为主题，通过重新梳理人、物与文明之间的关系，提炼出以物为核心的“社会”、“情感”、“功能”与“美学”四个语义维 度。在AI算法辅助下，项目对世界各地博物馆藏品的元数据类型进行了分析，并对其中的语义关键词进行了提取。在大数据驱动下，旨在打破传统博物馆的类别区隔，以藏品关键词为基石和联结，以知识图谱技术为核心，围绕以上四个维度构建了N个跨时空的主题，串联起古今中外的造物史，旨在为用户回望人类文明史提供新的视⻆、揭示不同文明之间的隐秘关联、也为用户当下的个人生活提供启发和灵感。在这里，用户所⻅即所建，随着用户探索的延续和深入，用户的足迹逐渐生⻓，用户的个人形象和藏品之馆也随之建立，用户为这些藏品赋予的个人化标签也成为新的关联线索。人们在这里探索，也在这里创造；在这里互联，也在这里汇聚。',
            images: [

            ],
          }
        },
        {
          index: 8, title: '2023', description: '',
          detail: {
            label: '“文都时空”文学大数据可视化平台',
            subLabel: '合作方：南京文投集团',
            summary: '“文都时空”文学大数据可视化平台依托大数据分析、地理信息系统及互联网对南京文学、历史、文化及城市资源进行线上展示，旨在建立一个历史时空框架下、以数据发现为驱动的南京文学-历史文化共生知识网络。该平台将空间叙事、历史叙事、图像研究、文化研究、文学研究等研究方法与主题分析、社交网络分析、情感分析等大数据分析方法相结合，通过计算机与人工智能数字技术，对以南京为主题或相关的文学作品、作家及作家群体、历史事件、地点地理等信息进行深度挖掘和重组，以符合新媒体传播及接受的方式对文学资源进行数据叙事和可视化表达，并通过交互平台与实际城市空间发生互动，进一步支持规划中“城市文学空间体系”的建设和传播，进一步丰富和延伸实体文学客厅、文学驿站等空间建设构想，并最终整合融入南京城市的“文学场所网络”，实现线上和实体两个文学空间的有机互动。“文都时空”文学大数据可视化平台是一个面向公众的公共服务平台，具有双向互动的特征，通过构建交互的、用户定制和增强感知的空间体验，用场所向公众讲好南京的文学故事，加强文学和公众的互动，鼓励公众积极参与南京文学传统的保护、传承和创新，并助力南京“世界文学之都”的品牌打造。',
            images: [
              'assets/home/wenDuShiKong-01.png',
              'assets/home/wenDuShiKong-02.png',
              'assets/home/wenDuShiKong-03.png',
              'assets/home/wenDuShiKong-04.png',
            ],
          }
        },
        {
          index: 9, title: '2023', description: '',
          detail: {
            label: '秦淮音河24小时',
            subLabel: '合作方：南京大学声学媒体实验室',
            summary: '《秦淮音河24小时》以声音为基础媒介，以贯穿了南京不同城区与时代的城市母河-——秦淮河为叙事主线，将空间上的秦淮河流域与时间上的南京市民 24 小时生活相对映，形成一次漫游河上、夜入长江的听觉旅行。“秦淮音河24小时”分时段采集秦淮河流域及两岸实地声音作为基础，再叠加以相关古诗词、民俗音调、历史广播等音频素材，以声景设计保留了金陵深处的听觉记忆。',
            images: [
              'assets/home/qinHuaiYinHe-01.png',
              'assets/home/qinHuaiYinHe-02.png',
            ],
          }
        },
        { index: -2},
      ],
    };
  },
  computed: {},
  methods: {
    flexBasis(index) {
      let factor = 5;
      let flexBasis = 100 / (this.stepData.length - 1);
      let half = Math.floor(this.stepData.length / 2);
      if (index < half) {
        if (this.active === index + 1) {
          return {flexBasis: flexBasis * factor + '%', minWidth: '400px'};
        }
        if (this.active === index) {
          return {flexBasis: flexBasis * 2 + '%'};
        }
      } else {
        if (this.active === index) {
          return {flexBasis: flexBasis * factor + '%', minWidth: '400px'};
        }
        if (this.active === index+1) {
          return {flexBasis: flexBasis * 2 + '%'};
        }
      }
      return {flexBasis: flexBasis + '%'};
    }
  },
  mounted() {}
}
</script>

<style scoped>
.braightidea-home-timeline {
  padding: 0;

  .el-step.is-horizontal {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    transition: flex-basis 0.5s;

    .el-step__main {
      margin-top: 70px;
      margin-bottom: 30px;
      font-family: "Source Han Sans CN";
      font-size: 48px;
      font-weight: bold;
      line-height: 56px;
      color: #080808;

      &.is-process {
         margin-left: -8px;
         position: absolute;
         bottom: 70px;
         left: -40px;
         display: flex;
         flex-direction: column;
         align-items: center;
         margin-top: 0;
      }

      .el-step__title {
        font-size: 16px;
        line-height: 18px;
        font-weight: bold;
        width: max-content;
        margin-right: 20px;
        &.is-wait {
          color: #000000;
        }
        &.is-process {
          font-size: 48px;
          line-height: 56px;
          color: #080808;
        }
      }
      .el-step__description {
        font-size: 14px;
        line-height: 16px;
        font-weight: bold;
      }
      .el-step__description.is-wait {
        color: #6C6C6C;
      }
    }

    .el-step__head {
      .el-step__line {
        bottom: 11px;
        top: unset;
        height: 0.1px !important;
        background-color: #000000;
      }
      .el-step__icon {
        cursor: pointer;
      }
      .el-step__icon.is-text {
        border: none;
        background-color: blue;
        transition: background-color 0.5s;
      }
      &.is-process {
        .el-step__icon.is-text {
          background-color: #56BC44;
          transition: background-color 0.5s;
        }
        .vertical-line {
           position: absolute;
           width: 359px;
           height: 359px;
           opacity: 1;
           top: -162px;
           left: -168px;
          background-image: url("../../../assets/home/142.svg");
        }
      }

      .timeline-detail {
        position: absolute;
        top: 90px;
        width: 800px;
        /*border: 1px solid red;*/
        left: -390px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 20px;
        font-family: "Source Han Sans CN";

        label.title {
          font-size: 24px;
          margin-bottom: 8px;
          font-weight: bold;
        }

        label.sub-title {
          font-size: 16px;
          font-weight: normal;
        }

        > div {
          width: 100%;
          padding: 20px 100px;
          text-align: center;
          white-space: normal;
          word-break: break-word;
          line-height: 1.5;
          font-size: 12px;
          letter-spacing: 0.06em;
        }
        .detail-image {
          max-width: 100%;
          max-height: 100%;
        }
        .el-carousel__button {
          background-color: #cccccc;
        }
      }
    }

  }
}

</style>
