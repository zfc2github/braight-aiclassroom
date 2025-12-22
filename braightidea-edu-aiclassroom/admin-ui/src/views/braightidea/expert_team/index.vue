<template>
  <div class="braightidea-home-expertteam">
    <div v-for="(expert,idx) in experts" class="expert-item-wrapper" :class="'wrapper'+(idx%2)">
      <div class="head-image-wrapper" :class="'back-image'+(idx%2)">
        <div class="head-image back">
          <img :src="expert.img" alt="" />
        </div>
        <div class="head-image">
          <img :src="expert.img" alt="" />
        </div>
      </div>
      <div class="name" :class="'back-color'+(idx%2)">{{ expert.name }}</div>
      <div class="level">{{ expert.level }}</div>
      <div class="summary">{{ expert.summary }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      experts: [
        {
          name: '陈静',
          level: '博士 / 副教授',
          img: 'assets/home/head-image.png',
          summary: '南京大学艺术学院 艺术与文化创意系副系主任 科研兴趣及主要研究方向：文化与媒介研究、数字人文、数字艺术、媒介转型期的视觉知识生产 近年来主持包括"Chinese Commercial Advertisement Archive"等多项文化遗产相关项目'
        },
        {
          name: '李宜斐',
          level: '策展人、艺术评论家',
          img: '',
          summary: ''
        },
        {
          name: '季春霖',
          level: '光启联合创始人 / 光启高等理工研究院副院长 / 大数据与人工智能首席科学家',
          img: 'assets/home/head-image-jiChunLin.png',
          summary: '杜克大学统计科学系博士、哈佛大学统计系博士后、超材料电磁调制国家重点实验室副主任和学术委员会委员，研究领域：贝叶斯统计学、超材料、数据科学、人工智能算法、机器学习'
        },
        {
          name: '陈皓',
          level: '副教授 / 硕士生导师',
          img: 'assets/home/head-image-chenHao.png',
          summary: '南京艺术学院设计学院副教授\n' +
            '主要研究方向：视觉传达设计，信息设计，平面设计\n' +
            '曾参与设计2014年南京青年奥林匹克运动会展馆项目，2014、2015年紫金奖江苏省文化创意设计大赛视觉形象系统设计和展陈设计项目'
        },
        {
          name: '邓柯',
          level: '博士 / 副教授 / 博士生导师',
          img: 'assets/home/head-image-dengKe.png',
          summary: '清华大学统计学研究中心长聘副教授\n' +
            '主要研究方向：贝叶斯统计，统计计算，生物信息，文本分析，人工智能方法\n' +
            '在 JRSS-B, JASA, Biometrika,等学术期刊和会议发表学术论文40余篇'
        },
        {
          name: '鲁安东',
          level: '博士 / 教授 / 博士生导师',
          img: 'assets/home/head-image-luAnDong.png',
          summary: '南京大学建筑与城市规划学院教授，南京大学人文社会科学高级研究院城市研究中心主任，南京大学可沟通城市实验室主任\n' +
            '担任国际建筑师协会（UIA）公共空间改造工作组中国席代表、中国建筑学会城市设计分会理事'
        },
        {
          name: '何捷',
          level: '博士 / 教授',
          img: '',
          summary: '哈尔滨工业大学（深圳）建筑学院城乡规划系\n' +
            '“智慧城市与数字空间规划”特色学科方向联合负责人\n' +
            '研究方向：数字人文,城市计算,地理设计\n' +
            '当前正在进行：历史建筑、城市与景观场所对象的多来源与多手段知识挖掘与知识图谱建构等'
        },
        {
          name: '李路珂',
          level: '助理教授 / 博士生导师',
          img: 'assets/home/head-image-liLuKe.png',
          summary: '清华大学建筑学院\n' +
            '主要研究方向：外国近现代建筑史教学及西方建筑理论经典著作翻译；古典建筑与法式制度；建筑装饰与色彩；植根传统的建筑设计方法研究'
        },
        {
          name: '陈刚',
          level: '博士 / 副教授 / 硕士生导师',
          img: 'assets/home/head-image-chenGang.png',
          summary: '南京大学地理与海洋科学学院\n' +
            '中国古都学会理事、南京市行政区划地名协会副会长、江苏省遥感与地理信息系统学会副秘书长、南京大学数字人文研究中心副主任，主持南京大学数字人文与超媒体GIS实验室建设'
        },
        {
          name: '陈振宇',
          level: '博士 / 教授 / 博士生导师',
          img: 'assets/home/head-image-chenZhengYu.png',
          summary: '南京大学软件学院\n' +
            '主要从事智能软件工程研究，长期致力于产教研融合。IEEE国际软件测试大赛发起人，江苏省计算机学会产业工委执行主任，CCF杰出会员与杰出讲者，国家级一流本科课程《软件测试》负责人'
        },
        {
          name: '钟建明',
          level: '副教授 / 硕士生导师',
          img: 'assets/home/head-image-zhongJianMing.png',
          summary: '南京艺术学院传媒学院摄影系主任\n' +
            '著名摄影家、中国摄影家协会会员、中国摄影家协会摄影教育委员会副秘书长、中国高等教育学会摄影教育专业委员会理事、江苏省高校摄影学会常务理事、江苏省广告协会理事'
        },
        {
          name: '张莅坤',
          level: '南京博物院图书信息部主任',
          img: 'assets/home/head-image-zhangLiKun.png',
          summary: '中国博物馆协会博物馆数智化专委会秘书长，江苏省博物馆学会传媒与新技术专委会副主任委员，南京市第十三届、十四届、十五届政协委员\n' +
            '研究方向：博物馆数字化、信息化、智慧化、数字展览展示'
        },
      ],
    }
  },
  methods: {
  },
  mounted() {}
}
</script>

<style scoped lang="scss">
.braightidea-home-expertteam {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  overflow: hidden;

  .expert-item-wrapper {
    width: 33.3%;
    height: 434px;
    padding: 20px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &.wrapper0 {
      background: linear-gradient(to bottom, #FFFFFF 0%, #E4FBE0 100%);
      .level {
        color: #56BC44;
      }
    }
    &.wrapper1 {
      background: #FFFFFF;
      .level {
        color: #3B1BF9;
      }
    }

    .head-image-wrapper {
      background-size: contain;
      background-repeat: no-repeat;
      display: flex;
      justify-content: center;
      position: relative;

      .head-image {
        position: absolute;
        img {
          width: 130%;
          height: 130%;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          top: -60px;
          left: -35px;
          border: 1px solid red;
        }
      }

      &.back-image0 {
        width: 239px;
        height: 229px;
        background-image: url("../../../assets/home/back-image0.svg");
        .head-image {
          width: 206px;
          height: 206px;
          top: 1px;
          left: 33px;
          overflow: hidden;
          border-radius: 50%;
          &.back {
            overflow: visible;
            clip-path: inset(-20px 0 50% 0);
            border-radius: unset;
            img {
              overflow: visible;
              border-radius: unset;
            }
          }
        }
      }
      &.back-image1 {
        width: 251px;
        height: 229px;
        background-image: url("../../../assets/home/back-image1.svg");
        .head-image {
          width: 206px;
          height: 206px;
          top: 1px;
          left: 13px;
          border-radius: 50%;
          overflow: hidden;
          &.back {
            overflow: visible;
            clip-path: inset(-20px 0 50% 0);
            border-radius: unset;
            img {
              overflow: visible;
              border-radius: unset;
            }
          }
        }
      }

    }

    .name {
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 0.12em;
      margin: 4px 0;
    }
    .level {
      font-size: 16px;
      font-weight: bold;
      letter-spacing: 0.12em;
      margin: 4px 0;
    }
    .summary {
      font-size: 11px;
      letter-spacing: 0.12em;
      margin: 4px 0;
      text-align: center;
    }
  }
}

</style>
