<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户id" prop="userid">
        <el-input
          v-model="queryParams.userid"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="丰裕度" prop="abundance">
        <el-input
          v-model="queryParams.abundance"
          placeholder="请输入丰裕度"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活跃度" prop="activity">
        <el-input
          v-model="queryParams.activity"
          placeholder="请输入活跃度"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流动度" prop="fluidity">
        <el-input
          v-model="queryParams.fluidity"
          placeholder="请输入流动度"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="融合度" prop="fusion">
        <el-input
          v-model="queryParams.fusion"
          placeholder="请输入融合度"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="独特度" prop="uniqueness">
        <el-input
          v-model="queryParams.uniqueness"
          placeholder="请输入独特度"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="0:鲲，1：蛟，2：混沌" prop="memo">
        <el-input
          v-model="queryParams.memo"
          placeholder="请输入0:鲲，1：蛟，2：混沌"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="相似用户1" prop="userIdOne">
        <el-input
          v-model="queryParams.userIdOne"
          placeholder="请输入相似用户1"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="相似用户2" prop="userIdThree">
        <el-input
          v-model="queryParams.userIdThree"
          placeholder="请输入相似用户2"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="相似用户3" prop="userIdTwo">
        <el-input
          v-model="queryParams.userIdTwo"
          placeholder="请输入相似用户3"
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
          v-hasPermi="['system:vitality:add']"
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
          v-hasPermi="['system:vitality:edit']"
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
          v-hasPermi="['system:vitality:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:vitality:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="vitalityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="用户id" align="center" prop="userid" />
      <el-table-column label="丰裕度" align="center" prop="abundance" />
      <el-table-column label="活跃度" align="center" prop="activity" />
      <el-table-column label="流动度" align="center" prop="fluidity" />
      <el-table-column label="融合度" align="center" prop="fusion" />
      <el-table-column label="独特度" align="center" prop="uniqueness" />
      <el-table-column label="0:鲲，1：蛟，2：混沌" align="center" prop="memo" />
      <el-table-column label="相似用户1" align="center" prop="userIdOne" />
      <el-table-column label="相似用户2" align="center" prop="userIdThree" />
      <el-table-column label="相似用户3" align="center" prop="userIdTwo" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:vitality:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:vitality:remove']"
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

    <!-- 添加或修改用户活跃度对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="userid">
          <el-input v-model="form.userid" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="丰裕度" prop="abundance">
          <el-input v-model="form.abundance" placeholder="请输入丰裕度" />
        </el-form-item>
        <el-form-item label="活跃度" prop="activity">
          <el-input v-model="form.activity" placeholder="请输入活跃度" />
        </el-form-item>
        <el-form-item label="流动度" prop="fluidity">
          <el-input v-model="form.fluidity" placeholder="请输入流动度" />
        </el-form-item>
        <el-form-item label="融合度" prop="fusion">
          <el-input v-model="form.fusion" placeholder="请输入融合度" />
        </el-form-item>
        <el-form-item label="独特度" prop="uniqueness">
          <el-input v-model="form.uniqueness" placeholder="请输入独特度" />
        </el-form-item>
        <el-form-item label="0:鲲，1：蛟，2：混沌" prop="memo">
          <el-input v-model="form.memo" placeholder="请输入0:鲲，1：蛟，2：混沌" />
        </el-form-item>
        <el-form-item label="相似用户1" prop="userIdOne">
          <el-input v-model="form.userIdOne" placeholder="请输入相似用户1" />
        </el-form-item>
        <el-form-item label="相似用户2" prop="userIdThree">
          <el-input v-model="form.userIdThree" placeholder="请输入相似用户2" />
        </el-form-item>
        <el-form-item label="相似用户3" prop="userIdTwo">
          <el-input v-model="form.userIdTwo" placeholder="请输入相似用户3" />
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
import { listVitality, getVitality, delVitality, addVitality, updateVitality } from "@/api/user/vitality";

export default {
  name: "Vitality",
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
      // 用户活跃度表格数据
      vitalityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userid: null,
        abundance: null,
        activity: null,
        fluidity: null,
        fusion: null,
        uniqueness: null,
        memo: null,
        userIdOne: null,
        userIdThree: null,
        userIdTwo: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户活跃度列表 */
    getList() {
      this.loading = true;
      listVitality(this.queryParams).then(response => {
        this.vitalityList = response.rows;
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
        userid: null,
        abundance: null,
        activity: null,
        fluidity: null,
        fusion: null,
        uniqueness: null,
        memo: null,
        createTime: null,
        updateTime: null,
        userIdOne: null,
        userIdThree: null,
        userIdTwo: null
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
      this.title = "添加用户活跃度";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getVitality(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户活跃度";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateVitality(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addVitality(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除用户活跃度编号为"' + ids + '"的数据项？').then(function() {
        return delVitality(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/vitality/export', {
        ...this.queryParams
      }, `vitality_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
