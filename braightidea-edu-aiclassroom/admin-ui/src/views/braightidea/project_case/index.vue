<template>
  <div class="braightidea-home-projectcase">
    <div class="arrow left">
      <div @click="handlePrevious">
        <i class="arrow-left-2"></i>
      </div>
    </div>
    <div class="middle">
      <carousel-3d
        ref="c3d"
        :width="800"
        :height="800"
        :autoplay="false"
        :autoplay-timeout="5000"
        :display="5"
        :perspective="70"
        :space="300"
        :inverseScaling="80"
        :loop="true"
        @after-slide-change="handleCarouselChange"
      >
        <slide v-for="(item, i) in slides" :key="i" :index="i">
          <div class="img-wrapper" style="width: 715px;height: 450px;display: flex;">
            <div class="border-wrapper">
              <!-- 图片支持 -->
              <img v-if="item.type === 'image'"
                   :src="item.src"
                   class="slide-content"
                   @click="handleSlideClick(i)">

              <!-- 视频支持 -->
              <video v-if="item.type === 'video'"
                     controls
                     class="slide-content"
                     @click="handleSlideClick(i)">
                <source :src="item.src" type="video/mp4">
              </video>
            </div>
          </div>
          <transition name="fade" :duration="300">
            <div v-show="active===i" class="carousel-item-content">
              <div v-show="item.title" class="carousel-item-title">{{ item.title }}</div>
              <div class="carousel-item-description">{{ item.description }}</div>
            </div>
          </transition>
        </slide>
      </carousel-3d>
    </div>
    <div class="arrow right">
      <div @click="handleNext">
        <i class="arrow-right-2"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      slides: [
        {
          type: 'image',
          src: '/assets/home/case-zhiyi.png',
          title: 'ZHI艺:南京传统工艺非遗虚拟展示平台',
          description: '南京首个非遗数字博物馆\n' +
            '首个以美学维度呈现的中国非遗展示平台\n' +
            '工匠精神传承、多主题数字展示',
        },
        {
          type: 'image',
          src: '/assets/home/case-ccaa.png',
          title: '中国近现代商业广告数据库（CCAA）',
          description: '近现代商业广告学术宝库\n' +
            '历史与文化的交汇\n' +
            '性别与市场洞察、民族主义与广告、社会商品化与分析'
        },
        {
          type: 'image',
          src: '/assets/home/case-dyh.png',
          title: '中国大运河（江苏段）虚拟展示平台',
          description: '"国内第一个大运河数字展示平台\n' +
            '后“申遗”时代的遗产活态保护\n' +
            '开创性文化遗产保护模式、众包共创模式、精细化影像资源采集"'
        },
        {
          type: 'image',
          src: '/assets/home/case-tranditionowlab.png',
          title: '中国非物质文化遗产基因数据库',
          description: '中国传统文化基因挖掘及创造再生\n' +
            '全国首个非遗基因数据库、非遗知识图谱及数据库平台\n' +
            '一站式的非遗知识管理与转化应用解决方案'
        },
        {
          type: 'image',
          src: '/assets/home/case-wenDuShiKong.png',
          title: '“文都时空”文学大数据可视化平台',
          description: '"文学遗产的数字重构、首个以南京文学为主题的大数据平台\n' +
            '海量文学文本的计量与可视化\n' +
            '国家级项目、南京文学之都空间建设重要组成部分'
        },
        {
          type: 'image',
          src: '/assets/home/case-qinHuaiYinHe.png',
          title: '秦淮音河24小时',
          description: '城市声音的日常叙事\n' +
            '7.1.4全景声/声视融合/声音可视化交互界面'
        },
      ],
      active: 0,
    }
  },
  methods: {
    handleNext() {
      this.active = (this.active + 1) % this.slides.length;
      this.$refs.c3d.goNext();
    },
    handlePrevious() {
      this.active = (this.active + this.slides.length - 1) % this.slides.length;
      this.$refs.c3d.goPrev();
    },
    handleSlideClick(index) {
      this.active = index;
    },
    handleCarouselChange(index) {
      this.active = index;
    },
  },
  mounted() {}
}
</script>

<style scoped lang="scss">
.braightidea-home-projectcase {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .arrow {
    width: 10%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      background-color: #EAEA4D;
      width: 73px;
      height: 73px;
      border: 1px solid #000000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      i {
        display: inline-block;
        width: 26px;
        height: 44px;
        &.arrow-left-2 {
          background-image: url("../../../assets/home/arrow-left-2.svg");
        }
        &.arrow-right-2 {
          background-image: url("../../../assets/home/arrow-right-2.svg");
        }
      }
    }
  }
  .middle {
    width: 80%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .carousel-3d-slide {
    background: transparent;
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &.current {
      .img-wrapper {
        background-color: #3B1BF9;
        border-radius: 24px;
        .border-wrapper {
          width: 100%;
          height: 100%;
          border-radius: 24px;
          border: 24px solid #3B1BF9;
        }
      }
      .img-wrapper img, .img-wrapper video {
        width: 100%;
        height: 100%;
        border-radius: 0;
      }
    }
  }
  .carousel-item-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    padding: 0 50px;
    position: absolute;
    top: 645px;

    .carousel-item-title {
      height: 43px;
      font-size: 24px;
      line-height: 43px;
      color: #FFFFFF;
      background-color: #3B1BF9;
      border-radius: 5px;
      padding: 0 10px;
      margin-bottom: 8px;
    }
    .carousel-item-description {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      text-align: center;
      color: #343434;
      white-space: pre-wrap;
    }
  }

  /* 幻灯片内容样式 */
  .slide-content {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
       transform: scale(1.02);
    }
  }

  /* 视频全屏覆盖 */
  video {
    background: #000;
    &.slide-content {
      width: 100%;
    }
  }
}

</style>
