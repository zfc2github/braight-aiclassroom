<template>
  <div class="technical-strength-c-wrapper">
    <div class="t-s-c-item t-s-c-category t-s-c-c-fmzl">发明专利</div>
    <div class="t-s-c-item line-1-v1"></div>
    <div class="t-s-c-item item1 line-1-L1" :class="activeItem==='item1'?'active':''"></div>
    <div class="t-s-c-item item2 line-1-L2" :class="activeItem==='item2'?'active':''"></div>
    <div class="t-s-c-item item3 line-1-L3" :class="activeItem==='item3'?'active':''"></div>

    <div class="t-s-c-item t-s-c-category t-s-c-c-rjzz">软件著作</div>
    <div class="t-s-c-item line-2-v1"></div>
    <div class="t-s-c-item item4 line-2-L1" :class="activeItem==='item4'?'active':''"></div>
    <div class="t-s-c-item item5 line-2-L2" :class="activeItem==='item5'?'active':''"></div>
    <div class="t-s-c-item item6 line-2-L3" :class="activeItem==='item6'?'active':''"></div>
    <div class="t-s-c-item item7 line-2-L4" :class="activeItem==='item7'?'active':''"></div>
    <div class="t-s-c-item item8 line-2-L5" :class="activeItem==='item8'?'active':''"></div>
    <div class="t-s-c-item item9 line-2-L6" :class="activeItem==='item9'?'active':''"></div>
    <div class="t-s-c-item item10 line-2-L7" :class="activeItem==='item10'?'active':''"></div>
    <div class="t-s-c-item item11 line-2-L8" :class="activeItem==='item11'?'active':''"></div>
    <div class="t-s-c-item item12 line-2-L9" :class="activeItem==='item12'?'active':''"></div>
    <div class="t-s-c-item item13 line-2-L10" :class="activeItem==='item13'?'active':''"></div>
    <div class="t-s-c-item item14 line-2-L11" :class="activeItem==='item14'?'active':''"></div>
    <div class="t-s-c-item item15 line-2-L12" :class="activeItem==='item15'?'active':''"></div>


    <div class="vertical-text t-s-c-item item-text1 item1" @click="handleItemClick('item1')" :class="activeItem==='item1'?'active':''">纹样处理方法、电子设备及可读存储介质</div>
    <div class="vertical-text t-s-c-item item-text2 item2" @click="handleItemClick('item2')" :class="activeItem==='item2'?'active':''">知识网络构建方法、装置、设备及存储介质</div>
    <div class="vertical-text t-s-c-item item-text3 item3" @click="handleItemClick('item3')" :class="activeItem==='item3'?'active':''">中文命名实体识别及分类方法及装置</div>
    <div class="vertical-text t-s-c-item item-text4 item4" @click="handleItemClick('item4')" :class="activeItem==='item4'?'active':''">文本数据清理与智能分词协作平台</div>
    <div class="vertical-text t-s-c-item item-text5 item5" @click="handleItemClick('item5')" :class="activeItem==='item5'?'active':''">团队协作式项目管理系统<span
      class="horizontal-text">V1.0</span></div>
    <div class="vertical-text t-s-c-item item-text6 item6" @click="handleItemClick('item6')" :class="activeItem==='item6'?'active':''">纹样图像一键矢量化软件<span class="horizontal-text">V1.0</span>
    </div>
    <div class="vertical-text t-s-c-item item-text7 item7" @click="handleItemClick('item7')" :class="activeItem==='item7'?'active':''">纹样图像多分类识别软件<span class="horizontal-text">V1.0</span>
    </div>
    <div class="vertical-text t-s-c-item item-text8 item8" @click="handleItemClick('item8')" :class="activeItem==='item8'?'active':''">非遗文化动态词云关联分析系统<span
      class="horizontal-text">V1.0</span></div>
    <div class="vertical-text t-s-c-item item-text9 item9" @click="handleItemClick('item9')" :class="activeItem==='item9'?'active':''">非遗领域趋势分析系统<span class="horizontal-text">V1.0</span>
    </div>
    <div class="vertical-text t-s-c-item item-text10 item10" @click="handleItemClick('item10')" :class="activeItem==='item10'?'active':''">非遗文化可视化地图系统<span class="horizontal-text">V1.0</span>
    </div>
    <div class="vertical-text t-s-c-item item-text11 item11" @click="handleItemClick('item11')" :class="activeItem==='item11'?'active':''">非遗文化智能分析分析平台<span class="horizontal-text">V1.0</span>
    </div>
    <div class="vertical-text t-s-c-item item-text12 item12" @click="handleItemClick('item12')" :class="activeItem==='item12'?'active':''">色彩分析系统<span class="horizontal-text">V1.0</span></div>
    <div class="vertical-text t-s-c-item item-text13 item13" @click="handleItemClick('item13')" :class="activeItem==='item13'?'active':''">图案一键线稿化软件<span class="horizontal-text">V1.0</span>
    </div>
    <div class="vertical-text t-s-c-item item-text14 item14" @click="handleItemClick('item14')" :class="activeItem==='item14'?'active':''"><span class="horizontal-text">ZHI</span>艺非物质文化遗产虚拟展示平台<span
      class="horizontal-text">V1.0</span></div>
    <div class="vertical-text t-s-c-item item-text15 item15" @click="handleItemClick('item15')" :class="activeItem==='item15'?'active':''">影像历史管理系统<span class="horizontal-text">V1.0</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TechnicalStrength",
  data() {
    return {
      activeItem: 'item5'
    }
  },
  methods: {
    handleItemClick(item) {
      this.activeItem = item;
    }
  }
}
</script>

<style scoped lang="scss">
.technical-strength-c-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .t-s-c-item {
    position: absolute;
    &.active {
      transition: 0.2s;
    }
  }
  .t-s-c-category {
    color: #45E02A;
    font-size: 20px;
  }
  .t-s-c-c-fmzl {
    top: 0;
    left: 140px;
  }
  .t-s-c-c-rjzz {
    top: 0;
    left: 570px;
  }
  .line-1-v1 {
    width: 40px;
    height: 19px;
    top: 40px;
    left: 160px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-1-v1.svg");
    background-size: cover;
    z-index: 10;
  }
  .line-2-v1 {
    width: 242px;
    height: 19px;
    top: 40px;
    left: 487px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-2-v1.svg");
    background-size: cover;
    z-index: 10;
  }
  .line-1-L1 {
    width: 60px;
    height: 230px;
    top: 50px;
    left: 105px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-1-L1.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-1-L1-green.svg");
    }
  }
  .line-1-L2 {
    width: 10px;
    height: 230px;
    top: 50px;
    left: 172px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-1-L2.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-1-L2-green.svg");
    }
  }
  .line-1-L3 {
    width: 44px;
    height: 230px;
    top: 50px;
    left: 194px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-1-L3.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-1-L3-green.svg");
    }
  }
  .line-2-L1 {
    width: 212px;
    height: 230px;
    top: 50px;
    left: 282px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-2-L1.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-2-L1-green.svg");
    }
  }
  .line-2-L2 {
    width: 172px;
    height: 230px;
    top: 50px;
    left: 346px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-2-L2.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-2-L2-green.svg");
    }
  }
  .line-2-L3 {
    width: 132px;
    height: 230px;
    top: 50px;
    left: 404px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-2-L3.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-2-L3-green.svg");
    }
  }
  .line-2-L4 {
    width: 94px;
    height: 230px;
    top: 50px;
    left: 462px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-2-L4.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-2-L4-green.svg");
    }
  }
  .line-2-L5 {
    width: 56px;
    height: 230px;
    top: 50px;
    left: 522px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-2-L5.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-2-L5-green.svg");
    }
  }
  .line-2-L6 {
    width: 19px;
    height: 230px;
    top: 50px;
    left: 580px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-2-L6.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-2-L6-green.svg");
    }
  }
  .line-2-L7 {
    width: 28px;
    height: 230px;
    top: 50px;
    left: 614px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-2-L7.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-2-L7-green.svg");
    }
  }
  .line-2-L8 {
    width: 66px;
    height: 230px;
    top: 50px;
    left: 635px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-2-L8.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-2-L8-green.svg");
    }
  }
  .line-2-L9 {
    width: 102px;
    height: 230px;
    top: 50px;
    left: 658px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-2-L9.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-2-L9-green.svg");
    }
  }
  .line-2-L10 {
    width: 142px;
    height: 230px;
    top: 50px;
    left: 678px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-2-L10.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-2-L10-green.svg");
    }
  }
  .line-2-L11 {
    width: 178px;
    height: 230px;
    top: 50px;
    left: 702px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-2-L11.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-2-L11-green.svg");
    }
  }
  .line-2-L12 {
    width: 216px;
    height: 230px;
    top: 50px;
    left: 723px;
    background-image: url("../../../assets/home/tech_strength/t-s-line-2-L12.svg");
    background-size: cover;
    &.active {
      background-image: url("../../../assets/home/tech_strength/t-s-line-2-L12-green.svg");
    }
  }

  .vertical-text {
    writing-mode: vertical-rl;
    text-orientation: upright;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: 0.2em;
    cursor: pointer;
    top: 270px;
  }
  .vertical-text.active {
    color: #45E02A;
    font-weight: bold;
    margin-left: -1px;
  }
  .horizontal-text {
    writing-mode: horizontal-tb;
  }

  .vertical-text::before {
    content: "";
    width: 14px;
    height: 14px;
    display: inline-block;
    border: 1px solid #45E02A;
    background: #C5C5C5;
    border-radius: 7px;
    margin-bottom: 8px;
  }
  .vertical-text.active::before {
    background: #45E02A;
    border: 1px solid #C5C5C5;
    width: 20px;
    height: 20px;
    border-radius: 10px;
  }
  .item-text1 {
    left: 97px;
  }
  .item-text2 {
    left: 164px;
  }
  .item-text3 {
    left: 226px;
  }
  .item-text4 {
    left: 276px;
  }
  .item-text5 {
    left: 331px;
  }
  .item-text6 {
    left: 389px;
  }
  .item-text7 {
    left: 447px;
  }
  .item-text8 {
    left: 507px;
  }
  .item-text9 {
    left: 565px;
  }
  .item-text10 {
    left: 623px;
  }
  .item-text11 {
    left: 682px;
  }
  .item-text12 {
    left: 741px;
  }
  .item-text13 {
    left: 800px;
  }
  .item-text14 {
    left: 860px;
  }
  .item-text15 {
    left: 922px;
  }
}
</style>
