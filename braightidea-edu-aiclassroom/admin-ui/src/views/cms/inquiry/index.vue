<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <right-toolbar :search="false" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contentList">
      <el-table-column label="角色" width="100" align="left" prop="role" />
      <el-table-column label="咨询人名称" align="left" prop="name" />
      <el-table-column label="邮箱" align="left" prop="email" />
      <el-table-column label="电话" align="left" prop="phone" />
      <el-table-column label="需求或问题" align="left" prop="message" >
        <template slot-scope="scope">
          <div class="ellipsis" :title="scope.row.message">{{scope.row.message}}</div>
        </template>
      </el-table-column>
      <el-table-column label="学校名称" align="left" prop="schoolName" />
      <el-table-column label="职位" align="left" prop="position" />
      <el-table-column label="学生人数" align="left" prop="schoolSize" />
      <el-table-column label="感兴趣的内容" align="left" >
        <template slot-scope="scope">
          <div class="ellipsis">{{ scope.row.role === 'school'
            ? (scope.row.interests?scope.row.interests.join(', '):'')
            : (scope.row.role === 'teacher'
              ? (scope.row.teacherInterests?scope.row.teacherInterests.join(', '):'')
              : (scope.row.parentInterests?scope.row.parentInterests.join(', '):'')) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="课题主题" align="left" prop="subject" />
      <el-table-column label="年级" align="left" >
        <template slot-scope="scope">
          <div class="ellipsis">{{ scope.row.role === 'teacher'
            ? scope.row.grade
            : scope.row.role === 'parent'
              ? scope.row.childGrade
              : '' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="希望获得什么" align="left" prop="learningGoal" >
        <template slot-scope="scope">
          <div class="ellipsis">{{scope.row.learningGoal}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['cms:solution:query']"
          >详细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色：">{{ form.role }}</el-form-item>
            <el-form-item label="咨询人名称：">{{ form.name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱：">{{ form.email }}</el-form-item>
            <el-form-item label="电话：">{{ form.phone }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="需求或问题：">{{ form.message }}</el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.role === 'school'">
            <el-form-item label="学校名称：">{{ form.schoolName }}</el-form-item>
            <el-form-item label="职位：">{{ form.position }}</el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.role === 'school'">
            <el-form-item label="学生人数：">{{ form.schoolSize }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="感兴趣的内容：">{{ form.role === 'school'
              ? (form.interests?form.interests.join(', '):'')
              : (form.role === 'teacher'
                ? (form.teacherInterests?form.teacherInterests.join(', '):'')
                : (form.parentInterests?form.parentInterests.join(', '):'')) }}</el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.role === 'teacher'">
            <el-form-item label="课题主题：">{{ form.subject }}</el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.role === 'teacher' || form.role === 'parent'">
            <el-form-item label="年级：">{{ form.role === 'teacher'
              ? form.grade
              : form.role === 'parent'
                ? form.childGrade
                : '' }}</el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.role === 'parent'">
            <el-form-item label="希望获得什么：">{{ form.learningGoal }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Inquiry",
  components: { },
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
      contentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {},
      // 表单参数
      form: {

      },
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      request({
        url: '/api/aieduInquiry/list',
        method: 'get',
        params: this.queryParams
      }).then(response => {
        this.contentList = response.rows;
        this.total = response.total;
        console.log(this.contentList);
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
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
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
.cms-solution-form .jsoneditor-outer {
  height: 500px!important;
}
</style>
