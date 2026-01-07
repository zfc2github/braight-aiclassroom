<template>
  <div class="app-container home-config">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" label-position="top" style="height: 84vh;overflow-y: scroll;padding-right: 20px;">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="顶部导航栏" name="sectionNav">
          <el-form-item label="LOGO：" prop="homeConfig.sectionNav.logo">
            <image-upload v-model="form.homeConfig.sectionNav.logo" :limit="1"></image-upload>
          </el-form-item>
          <el-form-item label="导航列表："
                        prop="homeConfig.sectionNav.navItems"
                        class="nav-items">
            <vue-json-editor
              v-model="form.homeConfig.sectionNav.navItems"
              :show-btns="false"
              :mode="'code'"
              lang="zh"
              :expanded-on-start="true"
              @json-save="onJsonSaveNavItems"
            >
            </vue-json-editor>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="Hero" name="sectionHero">
          <el-form-item label="Hero封面图：" prop="homeConfig.sectionHero.posterImage">
            <image-upload v-model="form.homeConfig.sectionHero.posterImage" :limit="1"></image-upload>
          </el-form-item>
          <el-form-item label="Hero视频：" prop="homeConfig.sectionHero.videoUrl">
            <video-upload v-model="form.homeConfig.sectionHero.videoUrl"></video-upload>
          </el-form-item>
          <el-form-item label="Hero信息："
                        prop="homeConfig.sectionHero"
                        class="section-hero">
            <vue-json-editor
              v-model="form.homeConfig.sectionHero"
              :show-btns="false"
              :mode="'code'"
              lang="zh"
              :expanded-on-start="true"
              @json-save="onJsonSaveSectionHero"
            >
            </vue-json-editor>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="课程体系" name="sectionCourse">
          <el-form-item label="课程体系信息："
                        prop="homeConfig.sectionCourse"
                        class="section-course">
            <vue-json-editor
              v-model="form.homeConfig.sectionCourse"
              :show-btns="false"
              :mode="'code'"
              lang="zh"
              :expanded-on-start="true"
              @json-save="onJsonSaveSectionCourse"
            >
            </vue-json-editor>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="应用平台" name="sectionLearningSpaceHeader">
          <el-form-item label="应用平台Header信息："
                        prop="homeConfig.sectionLearningSpaceHeader"
                        class="section-LearningSpaceHeader">
            <vue-json-editor
              v-model="form.homeConfig.sectionLearningSpaceHeader"
              :show-btns="false"
              :mode="'code'"
              lang="zh"
              :expanded-on-start="true"
              @json-save="onJsonSaveSectionLearningSpaceHeader"
            >
            </vue-json-editor>
          </el-form-item>
          <el-form-item label="应用平台应用列表："
                        prop="homeConfig.sectionLearningSpace.modules"
                        class="section-LearningSpace-modules">
            <vue-json-editor
              v-model="form.homeConfig.sectionLearningSpace.modules"
              :show-btns="false"
              :mode="'code'"
              lang="zh"
              :expanded-on-start="true"
              @json-save="onJsonSaveSectionLearningSpaceModules"
            >
            </vue-json-editor>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="教育支持" name="sectionSolutionPreview">
          <el-form-item label="教育支持Header信息："
                        prop="homeConfig.sectionSolutionPreview"
                        class="section-sectionSolutionPreview">
            <vue-json-editor
              v-model="form.homeConfig.sectionSolutionPreview"
              :show-btns="false"
              :mode="'code'"
              lang="zh"
              :expanded-on-start="true"
              @json-save="onJsonSaveSectionSolutionPreview"
            >
            </vue-json-editor>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="最新动态" name="sectionFeatureCarousel">
          <el-form-item label="最新动态Header信息："
                        prop="homeConfig.sectionFeatureCarousel"
                        class="section-sectionFeatureCarousel">
            <vue-json-editor
              v-model="form.homeConfig.sectionFeatureCarousel"
              :show-btns="false"
              :mode="'code'"
              lang="zh"
              :expanded-on-start="true"
              @json-save="onJsonSaveSectionFeatureCarousel"
            >
            </vue-json-editor>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="Footer" name="sectionFooter">
          <el-form-item label="Footer信息："
                        prop="homeConfig.sectionFooter"
                        class="section-sectionFooter">
            <vue-json-editor
              v-model="form.homeConfig.sectionFooter"
              :show-btns="false"
              :mode="'code'"
              lang="zh"
              :expanded-on-start="true"
              @json-save="onJsonSaveSectionFooter"
            >
            </vue-json-editor>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="reset">重 置</el-button>
        <el-button @click="gotoEduSite">访问官网</el-button>
      </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import VueJsonEditor from "vue-json-editor";

export default {
  name: "Config",
  components: { VueJsonEditor },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 网站指南文案管理表格数据
      contentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {},
      // 表单参数
      form: {
        id: 1,
        contentJson: "",
        homeConfig: {
          sectionNav: {
            logo: "",
            navItems: []
          },
          sectionHero: {
            posterImage: "",
            videoUrl: "",
          },
          sectionCourse:{},
          sectionLearningSpaceHeader: {},
          sectionLearningSpace: {
            modules: []
          },
          sectionSolutionPreview: {},
          sectionFeatureCarousel: {},
          sectionFooter: {}
        }
      },
      formCache: "",
      // 表单校验
      rules: {},
      activeName: 'sectionNav',
    };
  },
  created() {
    this.getHomeConfig();
  },
  methods: {
    /** 查询网站指南文案管理列表 */
    getHomeConfig() {
      request({
        url: '/api/aieduHomeConfig/1',
        method: 'get',
      }).then(response => {
        this.form = response.data;
        this.formCache = JSON.stringify(this.form);
      });
    },
    // 表单重置
    reset() {
      this.form = JSON.parse(this.formCache);
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            request({
              url: '/api/aieduHomeConfig/edit',
              method: 'post',
              data: this.form
            }).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.getHomeConfig();
            });
          }
        }
      });
    },
    onJsonSaveNavItems(value) {
      this.form.homeConfig.sectionNav.navItems = value;
    },
    onJsonSaveSectionHero(value) {
      this.form.homeConfig.sectionHero = value;
    },
    onJsonSaveSectionCourse(value) {
      this.form.homeConfig.sectionCourse = value;
    },
    onJsonSaveSectionLearningSpaceHeader(value) {
      this.form.homeConfig.sectionLearningSpaceHeader = value;
    },
    onJsonSaveSectionLearningSpaceModules(value) {
      this.form.homeConfig.sectionLearningSpace.modules = value;
    },
    onJsonSaveSectionSolutionPreview(value) {
      this.form.homeConfig.sectionSolutionPreview = value;
    },
    onJsonSaveSectionFeatureCarousel(value) {
      this.form.homeConfig.sectionFeatureCarousel = value;
    },
    onJsonSaveSectionFooter(value) {
      this.form.homeConfig.sectionFooter = value;
    },
    gotoEduSite() {
      window.open('https://education.braightidea.com/', '_blank');
    }
  }
};
</script>
<style lang="scss" scoped>
.ellipsis{
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 70px;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
}
</style>
<style type="text/css">
.home-config .nav-items .jsoneditor-outer {
  height: 65vh!important;
}
.home-config .section-hero .jsoneditor-outer {
  height: 25vh!important;
}
.home-config .section-course .jsoneditor-outer {
  height: 65vh!important;
}
.home-config .section-LearningSpaceHeader .jsoneditor-outer {
  height: 16vh!important;
}
.home-config .section-LearningSpace-modules .jsoneditor-outer {
  height: 65vh!important;
}
.home-config .section-sectionSolutionPreview .jsoneditor-outer {
  height: 16vh!important;
}
.home-config .section-sectionFeatureCarousel .jsoneditor-outer {
  height: 16vh!important;
}
.home-config .section-sectionFooter .jsoneditor-outer {
  height: 40vh!important;
}
.home-config .el-collapse-item__header {
  background-color: transparent;
  font-weight: bold;
  color: #1c84c6;
}
.home-config .el-collapse-item__wrap {
  background-color: transparent;
}
</style>
