<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="资源标题" prop="titleOrTitleEn">
        <el-input
          v-model="queryParams.titleOrTitleEn"
          placeholder="请输入菜单名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资源类型" prop="type">
        <el-select v-model="queryParams.type" clearable>
          <el-option
            v-for="dict in dict.type.cms_resource_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['cms:resource:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableData"
    >
      <el-table-column prop="type" label="资源类型" width="80"></el-table-column>
      <el-table-column prop="title" label="资源标题">
        <template slot-scope="scope">
          {{scope.row.title}}<br/>
          {{scope.row.titleEn}}
        </template>
      </el-table-column>
<!--      <el-table-column prop="titleEn" label="资源标题"></el-table-column>-->
<!--      <el-table-column prop="coverImage" label="封面图"></el-table-column>-->
      <el-table-column prop="summary" label="摘要"></el-table-column>
      <el-table-column prop="tags" label="标签">
        <template slot-scope="scope">
          <el-tag v-for="tag in scope.row.tags" :key="tag">{{tag}}</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column prop="tagEn" label="标签"></el-table-column>-->
      <el-table-column prop="featured" label="是否精选" width="80" >
        <template slot-scope="scope">
          {{scope.row.featured?'是':'否'}}
        </template>
      </el-table-column>
<!--      <el-table-column prop="linkType" label="链接类型" ></el-table-column>-->
<!--      <el-table-column prop="linkUrl" label="链接"></el-table-column>-->
      <el-table-column prop="author" label="作者" width="160"></el-table-column>
<!--      <el-table-column prop="duration" label="时长"></el-table-column>-->
<!--      <el-table-column prop="grade" label="年级"></el-table-column>-->
<!--      <el-table-column prop="summaryEn" label="摘要"></el-table-column>-->
      <el-table-column prop="createdAt" label="创建时间" width="160"></el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" width="160"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:resource:query']"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:resource:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cms:resource:remove']"
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
    <!-- 添加或修改菜单对话框 -->
    <el-dialog class="resource-dialog" :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="height: 100%;padding-right: 20px;">
        <el-row>
          <el-col :span="24">
            <el-form-item label="资源类型" prop="type">
              <el-select v-model="form.type" clearable>
                <el-option
                  v-for="dict in dict.type.cms_resource_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="资源中文标题" prop="title">
              <el-input v-model="form.title" maxlength="255" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="资源英文标题" prop="title">
              <el-input v-model="form.titleEn" maxlength="255" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="中文摘要" prop="summary">
              <el-input type="textarea" v-model="form.summary" rows="3" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="英文摘要" prop="summaryEn">
              <el-input type="textarea" v-model="form.summaryEn" rows="3" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="中文标签" prop="tag">
              <el-select v-model="form.tags" multiple filterable allow-create clearable>
                <el-option
                  v-for="dict in dict.type.cms_resource_tag"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="英文标签" prop="tagEn">
              <el-select v-model="form.tagEns" multiple filterable allow-create clearable>
                <el-option
                  v-for="dict in dict.type.cms_resource_tagen"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否精选" prop="featured">
              <el-switch v-model="form.featured" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="form.author" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="链接类型" prop="linkType">
              <el-select v-model="form.linkType" clearable>
                <el-option
                  v-for="dict in dict.type.cms_resource_link_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="链接URL" prop="linkUrl">
              <el-input v-model="form.linkUrl" maxlength="1000" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="封面图" prop="coverImage">
              <el-input v-model="form.coverImage" maxlength="1000" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时长" prop="duration">
              <el-input v-model="form.duration" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级" prop="grade">
              <el-input v-model="form.grade" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容（HTML/Markdown）" prop="content">
              <editor v-model="form.content" :min-height="192" />
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
import request from "@/utils/request";

export default {
  name: "Resource",
  dicts: ['cms_resource_type', 'cms_resource_tag', 'cms_resource_tagen', 'cms_resource_link_type'],
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      tableData: [],
      total: 0,
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 查询参数
      queryParams: {
        titleOrTitleEn: undefined,
        type: undefined,
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          { required: true, message: "资源类型不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "资源中文标题不能为空", trigger: "blur" }
        ],
        titleEn: [
          { required: true, message: "资源英文标题不能为空", trigger: "blur" }
        ],
        summary: [
          { required: true, message: "资源中文摘要不能为空", trigger: "blur" }
        ],
        summaryEn: [
          { required: true, message: "资源英文摘要不能为空", trigger: "blur" }
        ],
        linkType: [
          { required: true, message: "链接类型不能为空", trigger: "blur" }
        ],
        coverImage: [
          { required: true, message: "封面图不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      request({
        url: '/api/aieduResource/list',
        method: 'get',
        params: this.queryParams
      }).then(response => {
        this.tableData = response.rows;
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
        title: "",
        titleEn: "",
        summary: "",
        summaryEn: "",
        grade: "",
        coverImage: "",
        type: "",
        duration: "",
        tag: "",
        tagEn: "",
        linkType: "",
        linkUrl: "",
        featured: false,
        content: "",
        author: ""
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
      this.title = "添加资源";
      this.open = true;
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.form = row;
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = row;
      this.open = true;
      this.title = "修改资源";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log(this.form);
          if (this.form.id != undefined) {
            request({
              url: '/api/aieduResource/edit',
              method: 'post',
              data: this.form
            }).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            request({
              url: '/api/aieduResource/add',
              method: 'post',
              data: this.form
            }).then(response => {
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
      this.$modal.confirm('是否确认删除名称为"' + row.title + '"的数据项？').then(function() {
        return request({
          url: '/api/aieduResource/delete/' + row.id,
          method: 'post'
        });
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    }
  }
};
</script>
<style type="text/css">
.resource-dialog .el-dialog {
  height: 84vh!important;
}
.resource-dialog .el-dialog__body {
  height: 70vh!important;
  overflow-y: scroll;
}
</style>
