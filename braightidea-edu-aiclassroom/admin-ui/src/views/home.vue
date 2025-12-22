<template>
  <div class="home-container">
    <div class="braightidea-home">
      <div id="homeHeader" class="section-page">
        <div class="home-content header">
          <div class="header-menu">
            <div class="braightidea-logo">
              <div class="logo-svg" @click="scrollToTop"></div>
            </div>
            <div class="menu-items">
              <div class="menu-item-wrapper">
                <template v-for="item in menuItems">
                  <div class="menu-item"
                       :class="menuKey===item.key?'active':''"
                       @click="handleMenuItem(item.key)">
                    <i :class="'icon-'+item.key"></i><span class="menu-name">{{ item.name }}</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="header-title" @click="handleEnter"></div>
        </div>
      </div>
      <div id="company-profile" class="section-page">
        <div class="home-content company-profile">
          <div class="title-box">
            <div class="title-svg"></div>
          </div>
          <div class="content-box">
            <div class="title-1">以创新科技和人文关怀，传承面向未来的文化遗产</div>
            <div class="p-1">作为文化机构数字化的领航者，致力于为全球文化机构提供卓越的数字化服务<br/>
              我们专注于为博物馆、图书馆和档案馆提供尖端的数字化解决方案<br/>
              通过技术的力量，守护并传承人类的文化遗产，同时推动知识的广泛传播和应用
            </div>
            <div class="title-1" style="margin-top: 20px;margin-bottom: 8px;">联系我们</div>
            <div class="img-wrapper">
              <img class="vr-code" src="../assets/home/contact-us.png"/>
            </div>
            <div class="p-2">和光未来二维码</div>
          </div>
          <div class="c-p-types">
            <div class="company-success-case">
              <div class="c-p-line1">
                <span class="c-p-num">50</span>
                <span class="c-p-plus">+</span>
                <span class="c-p-unit">项</span>
              </div>
              <div class="c-p-type">成功案例</div>
              <div class="c-p-type-en">Success Cases</div>
            </div>
            <div class="company-c-p">
              <div class="c-p-line1">
                <span class="c-p-num">50</span>
                <span class="c-p-plus">+</span>
                <span class="c-p-unit">家</span>
              </div>
              <div class="c-p-type">合作对象</div>
              <div class="c-p-type-en">Collaboration Partner</div>
            </div>
            <div class="company-i-e">
              <div class="c-p-line1">
                <span class="c-p-num">15</span>
                <span class="c-p-plus"></span>
                <span class="c-p-unit">年</span>
              </div>
              <div class="c-p-type">行业经验</div>
              <div class="c-p-type-en">Industry Experience</div>
            </div>

          </div>
        </div>
      </div>
      <div id="company-development" class="section-page">
        <div class="home-content company-development">
          <div class="content-title">
            <div class="content-icon"></div>
          </div>
          <div class="content-box">
            <company-development/>
          </div>
        </div>
      </div>
      <div id="technical-strength" class="section-page">
        <div class="home-content technical-strength">
          <div class="content-box-1">
            <div class="t-s-title"></div>
          </div>
          <div class="content-box-2">
            <div class="t-s-content">
              <technical_strength />
            </div>
          </div>
          <div class="content-box-3">
            <div class="t-s-stats">
              <div>
                <span class="stats-num">3</span>
                <span class="stats-unit">项</span>
                <span class="vertical-line"></span>
                <div class="tech-item-category">
                  <span>发明专利</span>
                  <span class="name-en">Invention Patent</span>
                </div>
              </div>
              <div>
                <span class="stats-num">13</span>
                <span class="stats-unit">项</span>
                <span class="vertical-line"></span>
                <div class="tech-item-category">
                  <span>软件著作权</span>
                  <span class="name-en">Software Copyright</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="product-system" class="section-page">
        <div class="home-content product-system">
          <div class="content-box-1">
            <div @click="handleProductSystemClick('applicationScene')"
                 :class="productKey==='applicationScene'? 'active': ''">
              <span class="icon-app-scene"></span>
              <div class="product-category">
                <span class="name-zh">应用场景</span>
                <span class="name-en">Application Scene</span>
              </div>
            </div>
            <div @click="handleProductSystemClick('abilityDevelopment')"
                 :class="productKey==='abilityDevelopment'? 'active': ''">
              <span class="icon-ability-development"></span>
              <div class="product-category">
                <span class="name-zh">能力开发</span>
                <span class="name-en">Ability Development</span>
              </div>
            </div>
            <div @click="handleProductSystemClick('dataProcessing')"
                 :class="productKey==='dataProcessing'? 'active': ''">
              <span class="icon-data-processing"></span>
              <div class="product-category">
                <span class="name-zh">数据处理</span>
                <span class="name-en">Data Processing</span>
              </div>
            </div>
            <div @click="handleProductSystemClick('dataCollection')"
                 :class="productKey==='dataCollection'? 'active': ''">
              <span class="icon-data-collection"></span>
              <div class="product-category">
                <span class="name-zh">数据采集</span>
                <span class="name-en">Data Collection</span>
              </div>
            </div>
          </div>
          <div class="content-box-2">
            <el-carousel ref="carousel" class="p-s-el-c-wrapper" height="100%"
                         indicator-position="none"
                         :autoplay="true"
                         :interval="5000"
                         arrow="always" @change="handleCarouselChange">
              <el-carousel-item name="applicationScene">
                <product-system-app-scene></product-system-app-scene>
              </el-carousel-item>
              <el-carousel-item name="abilityDevelopment">
                <product-system-ability-development />
              </el-carousel-item>
              <el-carousel-item name="dataProcessing">
                <product-system-data-processing />
              </el-carousel-item>
              <el-carousel-item name="dataCollection">
                <product-system-data-collection />
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </div>
      <div id="project-case" class="section-page">
        <div class="home-content project-case">
          <div class="content-title">
            <div class="content-icon"></div>
          </div>
          <div class="content-box">
            <project-case></project-case>
          </div>
        </div>
      </div>
      <div id="data-oilfield" class="section-page">
        <div class="home-content data-oilfield">
          <div class="content-box">
            <data-oil-field></data-oil-field>
          </div>
          <div class="content-box-2">
            <div class="data-oilfield-title"></div>
          </div>
        </div>
      </div>
<!--      <div id="expert-team" class="section-page">
        <div class="expert-team-title-wrapper">
          <div class="expert-team-title"></div>
        </div>
        <div class="home-content expert-team">
          <div class="content-box">
            <expert-team></expert-team>
          </div>
        </div>
      </div>-->
      <div id="cooperative-partner" class="section-page">
        <div class="home-content cooperative-partner">
          <div class="content-box">
            <cooperative-partner></cooperative-partner>
          </div>
        </div>
      </div>
      <div id="home-footer" class="section-page">
        <div class="home-content home-footer">
          <div class="content-box">
            <home-footer></home-footer>
          </div>
        </div>
      </div>
      <el-backtop target=".home-container" :bottom="100">
        <div
          style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
        font-size: 16px;
      }"
        >
          TOP
        </div>
      </el-backtop>
    </div>
  </div>
</template>

<script>
import CompanyDevelopment from '../views/braightidea/company_development/index';
import ProductSystemAppScene from "@/views/braightidea/product_system/productSystemAppScene";
import ProjectCase from '@/views/braightidea/project_case/index';
import DataOilField from '@/views/braightidea/data_oil_field/index';
import ExpertTeam from '@/views/braightidea/expert_team/index';
import CooperativePartner from '@/views/braightidea/cooperative_partner/index';
import HomeFooter from '@/views/braightidea/home_footer/index';
import productSystemAbilityDevelopment from "@/views/braightidea/product_system/productSystemAbilityDevelopment";
import productSystemDataProcessing from "@/views/braightidea/product_system/productSystemDataProcessing";
import productSystemDataCollection from "@/views/braightidea/product_system/productSystemDataCollection";
import Technical_strength from "@/views/braightidea/technical_strength";

export default {
  name: 'Home',
  components: {
    CompanyDevelopment,
    ProductSystemAppScene,
    productSystemAbilityDevelopment,
    productSystemDataProcessing,
    productSystemDataCollection,
    ProjectCase,
    DataOilField,
    ExpertTeam,
    CooperativePartner,
    HomeFooter,
    Technical_strength,
  },
  data() {
    return {
      menuKey: '',
      menuItems: [
        {key: 'company-profile', name: '公司介绍'},
        {key: 'company-development', name: '公司基因'},
        {key: 'technical-strength', name: '技术实力'},
        {key: 'product-system', name: '产品体系'},
        {key: 'project-case', name: '项目案例'},
        {key: 'data-oilfield', name: '数据油田'},
        // {key: 'expert-team', name: '专家团队'},
        {key: 'cooperative-partner', name: '合作伙伴'},
      ],
      productKey: 'applicationScene',
    }
  },
  methods: {
    handleCarouselChange(index) {
      this.productKey = this.$refs.carousel.items[index].name;
    },
    handleProductSystemClick(key) {
      this.productKey = key;
      this.$refs.carousel.setActiveItem(key);
    },
    handleEnter() {
      this.$router.push({path: '/search'});
    },
    handleMenuItem(key) {
      this.menuKey = key;
      const element = document.getElementById(key);
      if (!element) {
        return;
      }
      const offset = 78; // 向下偏移 78px
      let top = element.offsetTop;
      const offsetPosition = top - offset;

      document.querySelector('.home-container')
        .scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
    },
    scrollToTop() {
      document.querySelector('.home-container')
        .scrollTo({
          top: 0,
          behavior: 'smooth',
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  height: 100vh;
  width: 100%;
  overflow-y: scroll;
  //overflow-x: hidden;
  //display: flex;
  //justify-content: center;
  //align-items: flex-start;
}

.braightidea-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #FFFFFF;
  min-width: 1360px;
  font-family: "Source Han Sans CN";

  > div.section-page {
    width: 100%;;

    .home-content {
      height: 100%;
      width: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }

    &#homeHeader {
      height: 1080px;
    }

    .header {
      background-image: url("../assets/home/home-page01.png");

      .header-menu {
        height: 78px;
        width: 100%;
        min-width: 1360px;
        display: flex;
        position: fixed;
        top: 0;
        left: auto;
        background-color: #1D29478c;
        z-index: 9999;

        > div {
          height: 100%;
        }

        .braightidea-logo {
          height: 100%;
          width: 25%;
          display: flex;
          justify-content: center;
          align-items: center;

          .logo-svg {
            height: 51px;
            width: 238px;
            background-image: url("../assets/home/braightidea.logo.svg");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            cursor: pointer;
          }
        }

        .menu-items {
          height: 100%;
          width: 70%;
          display: flex;
          justify-content: flex-start;
          align-items: flex-end;

          .menu-item-wrapper {
            height: 60px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .menu-item {
              display: flex;
              align-items: center;
              width: 12%;
              height: 100%;
              color: #FFFFFF;
              font-size: 20px;
              font-family: Source Han Sans CN;
              cursor: pointer;

              &.active {
                border-bottom: 5px solid #45E02A;
              }

              > i {
                height: 26px;
                width: 26px;
                display: inline-block;
                margin-right: 10px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
              }

              .icon-company-profile {
                background-image: url("../assets/home/icon-company-profile.svg");
              }

              .icon-company-development {
                background-image: url("../assets/home/icon-company-development.svg");
              }

              .icon-technical-strength {
                background-image: url("../assets/home/icon-technical-strength.svg");
              }

              .icon-product-system {
                background-image: url("../assets/home/icon-product-system.svg");
              }

              .icon-project-case {
                background-image: url("../assets/home/icon-project-case.svg");
              }

              .icon-data-oilfield {
                background-image: url("../assets/home/icon-data-oilfield.svg");
              }

              .icon-expert-team {
                background-image: url("../assets/home/icon-expert-team.svg");
              }

              .icon-cooperative-partner {
                background-image: url("../assets/home/icon-cooperative-partner.svg");
              }
            }
            @media (max-width: 1600px) {
              .menu-item {
                font-size: 16px;
              }
            }
            @media (max-width: 1400px) {
              .menu-item {
                font-size: 14px;
              }
            }
          }
        }
      }

      .header-title {
        height: 242px;
        width: 317px;
        position: relative;
        top: 30%;
        left: 10%;
        background-image: url("../assets/home/137.svg");
        cursor: pointer;
      }
    }

    &#company-profile {
      height: 664px;
    }

    .company-profile {
      background-image: url("../assets/home/home-page02.svg");
      display: flex;
      position: relative;

      .title-box {
        position: relative;
        width: 20%;
        top: 14%;
        height: 319px;
        .title-svg {
          width: 69px;
          height: 319px;
          margin-left: 30%;
          background-image: url("../assets/home/home-page02-title.svg");
        }
      }
      .content-box {
        height: 420px;
        width: 80%;
        position: relative;
        top: 15%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .title-1 {
          font-size: 24px;
          font-weight: bold;
          color: #A9F700;
          line-height: 2;
          letter-spacing: 0.09em;
        }

        .p-1 {
          font-size: 20px;
          color: #FFFFFF;
          line-height: 2;
          letter-spacing: 0.09em;
        }

        .img-wrapper {
          .vr-code {
            width: 122px;
            height: 122px;
            margin-bottom: 8px;
          }
        }

        .p-2 {
          font-size: 16px;
          color: #FFFFFF;
        }
      }
      .c-p-types {
        width: 45%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        position: absolute;
        bottom: 0;
        right: 0;
        font-weight: bold;
        > div {
          height: 137px;
          color: #3B1BF9;
          &.company-success-case {
            width: 50%;
            background: linear-gradient(to left, #3B1BF9 0%, #45E02A 60%, #45E02A);
            border-top-left-radius: 70px;
            border-bottom-left-radius: 70px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-left: 50px;
          }
          &.company-c-p {
            width: calc(50% + 100px);
            background: linear-gradient(to left, #3B1BF9 0%, #DFDF25 60%, #DFDF25);
            border-top-left-radius: 70px;
            border-bottom-left-radius: 70px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-left: 50px;
          }
          &.company-i-e {
            width: calc(50% + 200px);
            background: linear-gradient(to left, #3B1BF9 0%, #45E02A 60%, #45E02A);
            border-top-left-radius: 70px;
            border-bottom-left-radius: 70px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-left: 50px;
          }
        }
        .c-p-line1 {
          display: flex;
          font-weight: bold;
          .c-p-num {
            font-size: 70px;
            align-self: center;
          }
          .c-p-plus {
            font-size: 40px;
            align-self: flex-start;
            margin-top: -10px;
          }
          .c-p-unit {
            font-size: 20px;
            align-self: flex-end;
            margin-bottom: 20px;
          }
        }
        .c-p-type {
          font-size: 16px;
          margin-top: -10px;
          margin-left: 30px;
        }
        .c-p-type-en {
          font-size: 12px;
          margin-top: -4px;
          margin-left: 20px;
        }
      }
    }

    &#company-development {
      height: 1160px;
    }

    .company-development {
      background-image: url("../assets/home/home-page03.svg");

      .content-title {
        padding-top: 60px;
        margin-bottom: 100px;
        display: flex;
        justify-content: center;
        vertical-align: center;
        .content-icon {
          width: 342px;
          height: 92px;
          background-image: url("../assets/home/home-page03-title.svg");
        }
      }

      .content-box {
        height: 780px;
        width: 96%;
        position: relative;
        /*border: 1px solid red;*/
        margin: auto;
      }
    }

    &#technical-strength {
      height: 1080px;
    }

    .technical-strength {
      background-image: url("../assets/home/home-page04.svg");
      display: flex;

      .content-box-1 {
        height: 100%;
        width: 12%;
        display: flex;
        justify-content: center;
        .t-s-title {
          top: 12%;
          height: 340px;
          width: 85px;
          position: relative;
          /*border: 1px solid red;*/
          background-image: url("../assets/home/home-page04-title.svg");
          background-size: cover;
        }
        @media (max-width: 1600px) {
          .t-s-title {
            height: 306px;
            width: 77px;
          }
        }
      }

      .content-box-2 {
        height: 100%;
        width: 68%;
        display: flex;
        justify-content: center;
        .t-s-content {
          top: 14%;
          width: 988px;
          height: 646px;
          position: relative;
          /*border: 1px solid red;*/
          /*background-image: url("../assets/home/home-page04-content.svg");*/
          /*background-size: cover;*/
        }
      }

      .content-box-3 {
        height: 100%;
        width: 20%;
        display: flex;
        justify-content: center;
        .t-s-stats {
          bottom: 20%;
          align-self: flex-end;
          height: 167px;
          width: 300px;
          position: relative;
          /*border: 1px solid red;*/
          display: flex;
          font-size: 20px;
          font-weight: bold;
          color: #FFFFFF;
          flex-direction: column;
          justify-content: space-around;

          > div {
            display: flex;
            align-items: center;

            .stats-num {
              font-size: 48px;
              color: #45E02A;
              width: 60px;
              text-align: right;
              margin-right: 8px;
            }

            .stats-unit {
              align-self: flex-end;
              padding-bottom: 10px;
            }

            .vertical-line {
              height: 68px;
              width: 2px;
              background-color: #56BC44;
              margin: 0 20px;
            }

            .tech-item-category {
              display: flex;
              flex-direction: column;

              .name-en {
                font-size: 14px;
                font-family: "DIN Alternate";
              }
            }
          }
        }
        @media (max-width: 1600px) {
          .t-s-stats {
            font-size: 16px;
            > div {
              .stats-num {
                font-size: 40px;
              }
              .tech-item-category {
                .name-en {
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }

    &#product-system {
      height: 1080px;
    }

    .product-system {
      background-image: url("../assets/home/home-page05.svg");
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 10%;
      padding-left: 10%;

      .content-box-1 {
        height: 56%;
        width: 382px;
        position: relative;
        /*border: 1px solid red;*/
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;

        > div {
          display: flex;
          align-items: center;
          height: 88px;
          border: 2px solid #3B1BF9;
          border-radius: 20px;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 0.16em;
          cursor: pointer;

          > span {
            margin: 0 50px;
          }

          .product-category {
            display: flex;
            flex-direction: column;

            .name-en {
              font-size: 16px;
              letter-spacing: 0.05em;
            }
          }

          .icon-app-scene {
            width: 42px;
            height: 40px;
            background-image: url("../assets/home/icon-app-scene.svg");
          }

          .icon-ability-development {
            width: 42px;
            height: 42px;
            background-image: url("../assets/home/icon-ability-development.svg");
          }

          .icon-data-processing {
            width: 42px;
            height: 39px;
            background-image: url("../assets/home/icon-data-processing.svg");
          }

          .icon-data-collection {
            width: 42px;
            height: 40px;
            background-image: url("../assets/home/icon-data-collection.svg");
          }
        }

        > div.active {
          background-color: #3B1BF9;
          color: #FFFFFF;

          .icon-app-scene {
            background-image: url("../assets/home/icon-app-scene.active.svg");
          }

          .icon-ability-development {
            width: 50px;
            height: 50px;
            background-image: url("../assets/home/icon-ability-development.active.svg");
            margin-top: 4px;
            margin-left: 46px;
          }

          .icon-data-processing {
            background-image: url("../assets/home/icon-data-processing.active.svg");
          }

          .icon-data-collection {
            background-image: url("../assets/home/icon-data-collection.active.svg");
          }
        }
      }

      .content-box-2 {
        height: 90%;
        width: 65%;
        position: relative;
        /*border: 1px solid red;*/
        display: flex;
        justify-content: center;
        align-items: center;

        .p-s-el-c-wrapper {
          width: 94%;
          height: 100%;
        }
      }
    }

    &#project-case {
      height: 1080px;
    }

    .project-case {
      background-image: url("../assets/home/home-page06.svg");

      .content-title {
        padding-top: 80px;
        display: flex;
        justify-content: center;
        vertical-align: center;
        .content-icon {
          width: 246px;
          height: 86px;
          background-image: url("../assets/home/home-page06-title.svg");
        }
      }

      .content-box {
        position: relative;
        display: flex;
        width: 90%;
        height: 700px;
        /*border: 1px solid red;*/
        left: 5%;
      }
    }

    &#data-oilfield {
      height: 1080px;
    }

    .data-oilfield {
      background-image: url("../assets/home/home-page07.svg");
      display: flex;

      .content-box {
        position: relative;
        display: flex;
        width: 92%;
        height: 100%;
        /*border: 1px solid red;*/
      }
      .content-box-2 {
        position: relative;
        display: flex;
        width: 9%;
        height: 100%;
        align-items: center;
        justify-content: center;
        /*border: 1px solid red;*/
        .data-oilfield-title {
          background-image: url("../assets/home/home-page07-title.svg");
          width: 71px;
          height: 329px;
        }
      }
    }

    &#expert-team {
      /*height: 1908px;*/
    }

    .expert-team-title-wrapper {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      .expert-team-title {
        background-image: url("../assets/home/home-page08-01.svg");
        width: 340px;
        height: 90px;
        margin-top: 90px;
        margin-bottom: 40px;
      }
    }

    .expert-team {
      background-image: url("../assets/home/home-page08.svg");
      display: flex;
      justify-content: center;
      align-items: stretch;

      .content-box {
        position: relative;
        display: flex;
        width: 90%;
        /*border: 1px solid red;*/
      }
    }

    &#cooperative-partner {
      height: 591px;
    }

    .cooperative-partner {
      background-image: url("../assets/home/home-page09.svg");

      .content-box {
        position: relative;
        display: flex;
        justify-content: center;
        width: 100%;
        /*border: 1px solid red;*/
        top: 50px;
      }
    }

    &#home-footer {
      height: 1086px;
    }

    .home-footer {
      background-image: url("../assets/home/home-page10.svg");

      .content-box {
        position: relative;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 600px;
        /*border: 1px solid red;*/
        top: 40px;
      }
    }
  }

}
</style>
<style>
.p-s-el-c-wrapper .el-carousel__container .el-carousel__arrow--left .el-icon-arrow-left {
  width: 23px;
  height: 42px;
  background-image: url("../assets/home/arrow-left.svg");
}

.p-s-el-c-wrapper .el-carousel__container .el-carousel__arrow--right .el-icon-arrow-right {
  width: 23px;
  height: 42px;
  background-image: url("../assets/home/arrow-right.svg");
}

.p-s-el-c-wrapper .el-carousel__container .el-carousel__arrow--left,
.p-s-el-c-wrapper .el-carousel__container .el-carousel__arrow--right {
  background-color: transparent;
}

.p-s-el-c-wrapper .el-carousel__container .el-carousel__arrow--left .el-icon-arrow-left::before,
.p-s-el-c-wrapper .el-carousel__container .el-carousel__arrow--right .el-icon-arrow-right::before {
  content: '';
}
</style>
