<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="中文标题" prop="titlecn">
        <el-input
          v-model="queryParams.titlecn"
          placeholder="请输入中文标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="英文标题" prop="titleen">
        <el-input
          v-model="queryParams.titleen"
          placeholder="请输入英文标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="内容映射" prop="type">
        <el-input
          v-model="queryParams.type"
          placeholder="请输入内容映射"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:content:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:content:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:content:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:content:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" width="55" align="center" prop="id" />
      <el-table-column label="内容映射" width="100" align="center" prop="type" />
      <el-table-column label="中文标题" align="center" prop="titlecn" />
      <el-table-column label="中文内容" align="center" prop="contextcn" >
        <template slot-scope="scope">
          <div class="ellipsis" :title="scope.row.contextcn">{{scope.row.contextcn}}</div>
        </template>
      </el-table-column>
      <el-table-column label="英文标题" align="center" prop="titleen" />
      <el-table-column label="英文内容" align="center" prop="contexten" >
        <template slot-scope="scope">
          <div class="ellipsis" :title="scope.row.contexten">{{scope.row.contexten}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:content:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:content:remove']"
          >删除</el-button>
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

    <!-- 添加或修改网站指南文案管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="内容映射" prop="type">
          <el-input v-model="form.type" placeholder="请输入内容映射" />
        </el-form-item>
        <el-form-item label="中文标题" prop="titlecn">
          <el-input v-model="form.titlecn" placeholder="请输入中文标题" />
        </el-form-item>
        <el-form-item label="中文内容" prop="contextcn">
          <editor v-model="form.contextcn" :min-height="192"/>
          <!-- <el-input v-model="form.contextcn" type="textarea" placeholder="请输入内容" /> -->
        </el-form-item>
        <el-form-item label="英文标题" prop="titleen">
          <el-input v-model="form.titleen" placeholder="请输入英文标题" />
        </el-form-item>
        <el-form-item label="英文内容" prop="contexten">
          <editor v-model="form.contexten" :min-height="192"/>
          <!-- <el-input v-model="form.contexten" type="textarea" placeholder="请输入内容" /> -->
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
import { listContent, getContent, delContent, addContent, updateContent } from "@/api/system/content";

export default {
  name: "Content",
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
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contextcn: null,
        status: null,
        titlecn: null,
        titleen: null,
        contexten: null,
        type: null
      },
      // 表单参数
      form: {},
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
      listContent(this.queryParams).then(response => {
        this.contentList = response.rows;
        this.total = response.total;
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
      this.form = {
        id: null,
        contextcn: null,
        createTime: null,
        status: null,
        titlecn: null,
        titleen: null,
        updateTime: null,
        contexten: null,
        type: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加网站指南文案管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getContent(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改网站指南文案管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateContent(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addContent(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除网站指南文案管理编号为"' + ids + '"的数据项？').then(function() {
        return delContent(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/content/export', {
        ...this.queryParams
      }, `content_${new Date().getTime()}.xlsx`)
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
