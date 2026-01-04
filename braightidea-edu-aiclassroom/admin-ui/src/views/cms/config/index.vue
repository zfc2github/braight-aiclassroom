<template>
  <div class="app-container home-config">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" style="height: 84vh;overflow-y: scroll;padding-right: 20px;">
      <el-form-item label="配置" prop="homeConfig">
        <vue-json-editor
          v-model="form.homeConfig"
          :show-btns="false"
          :mode="'tree'"
          lang="zh"
          :expanded-on-start="true"
          @json-change="onJsonChange"
          @json-save="onJsonSave"
        >
        </vue-json-editor>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="reset">重 置</el-button>
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
        homeConfig: {}
      },
      formCache: "",
      // 表单校验
      rules: {}
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
    onJsonChange(value) {
    },
    onJsonSave(value) {
      this.form.solutionDetail = value;
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
.home-config .jsoneditor-outer {
  height: 80vh!important;
}
</style>
