<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
      @submit.native.prevent>
      <el-form-item label="App名称" prop="accessAppName">
        <el-input
          v-model="queryParams.accessAppName"
          placeholder="请输入App名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
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
          v-hasPermi="['system:accesskey:add']"
        >新增AccessKey</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="dataList"
    >
      <el-table-column prop="accessAppName" label="App名称" width="160"></el-table-column>
      <el-table-column prop="accessKeyId" label="AccessKeyId" width="200"></el-table-column>
      <el-table-column prop="accessKeySecret" label="AccessKeySecret"></el-table-column>
      <el-table-column prop="expireDate" label="到期日" width="100"></el-table-column>
      <el-table-column label="创建人" prop="createBy" width="120"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="150"></el-table-column>
      <el-table-column label="操作" align="center" width="90" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:accesskey:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="App名称" prop="accessAppName">
              <el-input v-model="form.accessAppName" placeholder="请输入App名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="到期日" prop="expireDate">
              <el-date-picker clearable
                              v-model="form.expireDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="请选择">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addAccessKey, delAccessKey, listAccessKey} from "@/api/system/accesskey";

export default {
  name: "Accesskey",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      dataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        accessAppName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        accessAppName: [
          { required: true, message: "App名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listAccessKey(this.queryParams).then(response => {
        this.dataList = response.rows || [];
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
        accessAppName: undefined,
        expireDate: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增AccessKey";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addAccessKey(this.form).then(response => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.getList();
          }).catch((err) => {
            console.log(err);
            this.$modal.msgError(err.msg);
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除App名称为"' + row.accessAppName + '"的数据项？').then(function() {
        return delAccessKey(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    }
  }
};
</script>
