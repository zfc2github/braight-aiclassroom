<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <right-toolbar :search="false" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contentList">
      <el-table-column label="编码" width="100" align="left" prop="id" />
      <el-table-column label="标题" align="left" prop="title" >
        <template slot-scope="scope">
          <div class="ellipsis" :title="scope.row.title">{{scope.row.title}}</div>
        </template>
      </el-table-column>
      <el-table-column label="标题-英文" align="left" prop="titleEn" >
        <template slot-scope="scope">
          <div class="ellipsis" :title="scope.row.titleEn">{{scope.row.titleEn}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:solution:edit']"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>

<!--    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px"
               class="cms-solution-form"
               style="height: 900px;overflow-y: scroll;padding-right: 20px;">
        <el-form-item label="编码" prop="type">
          {{form.id}}
        </el-form-item>
        <el-form-item label="背景颜色" prop="bgColor">
          <el-input v-model="form.bgColor" placeholder="请输入背景颜色（如#daef68）" />
        </el-form-item>
        <el-form-item label="字体颜色" prop="textColor">
          <el-input v-model="form.textColor" placeholder="请输入字体颜色（如#daef68）" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input type="textarea" v-model="form.title" :rows="2" />
        </el-form-item>
        <el-form-item label="标题-英文" prop="titleEn">
          <el-input type="textarea" v-model="form.titleEn" :rows="2" />
        </el-form-item>
        <el-form-item label="标题-桌面版" prop="titleDesktop">
          <el-input type="textarea" v-model="form.titleDesktop" :rows="2" />
        </el-form-item>
        <el-form-item label="标题-桌面版英文" prop="titleDesktopEn">
          <el-input type="textarea" v-model="form.titleDesktopEn" :rows="2" />
        </el-form-item>
        <el-form-item label="标题-手机版" prop="titleMobile">
          <el-input type="textarea" v-model="form.titleMobile" :rows="2" />
        </el-form-item>
        <el-form-item label="标题-手机版英文" prop="titleMobileEn">
          <el-input type="textarea" v-model="form.titleMobileEn" :rows="2" />
        </el-form-item>
        <el-form-item label="产品特点" prop="features">
          <el-input type="textarea" v-model="form.features" :rows="2" />
        </el-form-item>
        <el-form-item label="产品特点-英文" prop="featuresEn">
          <el-input type="textarea" v-model="form.featuresEn" :rows="2" />
        </el-form-item>
        <el-form-item label="背景图片" prop="image">
          <el-input type="textarea" v-model="form.image" :rows="2" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input type="textarea" v-model="form.icon" :rows="2" />
        </el-form-item>
        <el-form-item label="解决方案-Hero信息"
                      prop="solutionDetail.sectionHero"
                      class="section-hero">
          <vue-json-editor
            v-model="form.solutionDetail.sectionHero"
            :show-btns="false"
            :mode="'tree'"
            lang="zh"
            :expanded-on-start="true"
            @json-save="onJsonSavesectionHero"
          >
          </vue-json-editor>
        </el-form-item>
        <el-form-item label="解决方案-学校支持"
                      prop="solutionDetail.sectionSupport"
                      class="section-support">
          <vue-json-editor
            v-model="form.solutionDetail.sectionSupport"
            :show-btns="false"
            :mode="'tree'"
            lang="zh"
            :expanded-on-start="true"
            @json-save="onJsonSavesectionSupport"
          >
          </vue-json-editor>
        </el-form-item>
        <el-form-item label="解决方案-应用场景"
                      prop="solutionDetail.sectionScene"
                      class="section-scene">
          <vue-json-editor
            v-model="form.solutionDetail.sectionScene"
            :show-btns="false"
            :mode="'tree'"
            lang="zh"
            :expanded-on-start="true"
            @json-save="onJsonSavesectionScene"
          >
          </vue-json-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import VueJsonEditor from "vue-json-editor";

export default {
  name: "Solution",
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
        solutionDetail: {
          sectionHero: {
            imageUrl: ''
          },
          sectionSupport: {
            supports: []
          },
          sectionScene: {
            scenes: []
          },
        }
      },
      // 表单校验
      rules: {
        // titlecn: [
        //   { required: true, message: "中文标题不能为空", trigger: "blur" }
        // ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询网站指南文案管理列表 */
    getList() {
      this.loading = true;
      request({
        url: '/api/aieduSolution/list',
        method: 'get',
        params: this.queryParams
      }).then(response => {
        this.contentList = response.data;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      //this.form = {};
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      //this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      request({
        url: '/api/aieduSolution/' + row.tid,
        method: 'get'
      }).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改解决方案";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.tid != null) {
            request({
              url: '/api/aieduSolution/edit',
              method: 'post',
              data: this.form
            }).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    onJsonSavesectionHero(value) {
      this.form.solutionDetail.sectionHero = value;
    },
    onJsonSavesectionSupport(value) {
      this.form.solutionDetail.sectionSupport = value;
    },
    onJsonSavesectionScene(value) {
      this.form.solutionDetail.sectionScene = value;
    },
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
.cms-solution-form .section-hero .jsoneditor-outer {
  height: 320px!important;
}
.cms-solution-form .section-support .jsoneditor-outer {
  height: 500px!important;
}
.cms-solution-form .section-scene .jsoneditor-outer {
  height: 500px!important;
}
</style>
