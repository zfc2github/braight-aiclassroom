<template>
  <div class="idea-resource-search">
    <el-row class="i-r-s-header" :gutter="10">
      <el-col :span="4" class="header-l">
        <img src="/assets/home/braightidea-logo.png" alt="和光未来" @click="gotoHome">
      </el-col>
      <el-col :span="12" class="header-m">
        <el-input v-model="keyword"
                  size="medium"
                  @keyup.enter.native="newQueryTableData"
                  clearable
                  placeholder="搜索关键词..."
                  prefix-icon="el-icon-search">
          <el-button slot="append" icon="el-icon-search" @click="newQueryTableData"></el-button>
        </el-input>
      </el-col>
      <el-col :span="8" class="header-r">
        <el-button size="medium" type="text" @click="gotoHome">首页</el-button>
      </el-col>
    </el-row>
    <el-row class="i-r-s-main" :gutter="10">
      <el-col :xs="8" :sm="6" :md="4" :lg="3" class="main-l">
        <el-collapse v-model="activeFilterNames">
          <template v-for="filter in filters">
            <el-collapse-item :title="filter.filterName" :name="filter.key">
              <ul>
                <li v-for="item in filter.items"
                    :ref="'ref_'+filter.key+'_'+item.dictValue"
                    @click="onSelectFilterItem($event, filter, item)"
                    :key="item.dictValue">
                  {{ item.dictLabel }}（{{ item.num }}）
                </li>
              </ul>
            </el-collapse-item>
          </template>
        </el-collapse>
        <div style="text-align: center;margin-left: -45px;">
          <el-button size="medium" type="text" icon="el-icon-refresh-right" @click="resetFilterSelect">重置筛选</el-button>
        </div>
      </el-col>
      <el-col :xs="16" :sm="18" :md="20" :lg="21" class="main-r">
        <el-row class="m-r-1">
          <el-col :span="18">共找到 {{ total }} 个资源</el-col>
          <el-col :span="6" class="m-r-1-sort">
              <label>排序方式：</label>
              <el-select v-model="queryParams.sortType"
                         size="small"
                         class="s-sort-type"
                         @change="handleSortTypeChange">
                <el-option label="最新上传" value="update_time|descending"></el-option>
                <el-option label="最晚上传" value="update_time|ascending"></el-option>
              </el-select>
          </el-col>
        </el-row>
        <el-row class="m-r-list" :gutter="10" v-loading="loading">
          <template v-for="row in tableData">
            <el-col :sm="12" :md="6" :lg="5" :xl="4">
              <figure class="card-item">
                <div class="card-item-pt1">
                  <a href="javascript:void(0)" @click="handleView(row)">
                    <img :src="row.fileThumbnail" class="img-fileThumbnail"/>
                  </a>
                </div>
                <div class="card-item-pt2">
                  <span>{{ transferDisplayLabel(row.label) }}</span>
                  <el-tag size="small" :class="row.businessTag">{{ transferDisplayBusinessName(row.businessTag) }}
                  </el-tag>
                </div>
              </figure>
            </el-col>
          </template>
          <infinite-loading ref="infinite"
                            forceUseInfiniteWrapper=".m-r-list"
                            @infinite="handleInfinite"
                            spinner="spiral"
                            :distance="100">
            <div slot="spinner" style="color: gray;">加载中...</div>
            <div slot="no-results" style="color: gray;">查询数据为空...</div>
            <div slot="no-more" style="color: gray;">没有更多数据了...</div>
          </infinite-loading>
        </el-row>

        <el-row class="m-r-page">
          <pagination-next
            v-show="total>0"
            :total="total"
            :limit.sync="queryParams.pageSize"
            layout="total,->,next"
            @nextClick="getListNext"
            class="r-s-pagination"
          />
        </el-row>
      </el-col>
    </el-row>
    <el-row class="i-r-s-footer" :gutter="10"></el-row>
  </div>
</template>

<script>
import request from "@/utils/request";
import CryptoJS from 'crypto-js';

export default {
  name: "resourceSearch",
  data() {
    return {
      keyword: '',
      activeFilterNames: ['resourceType', 'businessTag'],
      filters: [
        {
          filterName: '资源类型', key: 'resourceType',
          items: []
        },
        {
          filterName: '项目筛选', key: 'businessTag',
          items: []
        },
      ],
      filterSelectMap: {
        resourceType: {},
        businessTag: {}
      },
      queryParams: {
        sortType: 'update_time|descending',
        sortProp: null,
        sortOrder: null,
        pageNum: 0,
        pageSize: 20
      },
      loading: false,
      total: 0,
      tableData: [],
      resourceTypeOptions: [],
      businessTagOptions: [],
      oldFilterConditionMd5: '',
      infiniteFirst: true
    }
  },
  computed: {},
  methods: {
    handleInfinite() {
      this.getListNext();
    },
    resetFilterSelect() {
      for (let key in this.filterSelectMap) {
        for (let k in this.filterSelectMap[key]) {
          this.$refs['ref_' + key + '_' + k][0].className = '';
        }
      }
      this.filterSelectMap = {
        resourceType: {},
        businessTag: {}
      };
      this.newQueryTableData();
    },
    handleSortTypeChange() {
      this.newQueryTableData();
    },
    getListNext() {
      this.queryParams.pageNum++;
      setTimeout(() => {
        this.queryTableData();
      }, 100);
    },
    handleView(row) {
      window.open(this.$router.resolve({
        path: '/search/resourceDetail', query: { id: row._id }
      }).href, '_blank');
    },
    transferDisplayBusinessName(businessTag) {
      let kit = this.businessTagOptions.filter(item => item.dictValue === businessTag)[0];
      if (kit) {
        return kit.dictLabel;
      }
      return businessTag;
    },
    transferDisplayLabel(label) {
      return label ? label['zh-Hans'] : '';
    },
    onSelectFilterItem(event, filter, item) {
      if (event.target.className === 'active') {
        event.target.className = '';
        this.filterSelectMap[filter.key][item.dictValue] = false;
      } else {
        event.target.className = 'active';
        this.filterSelectMap[filter.key][item.dictValue] = true;
      }
    },
    newQueryTableData() {
      this.tableData = [];
      this.queryParams.pageNum = 0;
      this.$refs['infinite'].stateChanger.reset();
    },
    queryTableData() {
      this.loading = true;
      this.queryParams.sortProp = this.queryParams.sortType.split('|')[0];
      this.queryParams.sortOrder = this.queryParams.sortType.split('|')[1];
      let resourceTypes = [];
      for (let type in this.filterSelectMap.resourceType) {
        if (this.filterSelectMap.resourceType[type]) {
          resourceTypes.push(type);
        }
      }
      let businessTags = [];
      for (let businessTag in this.filterSelectMap.businessTag) {
        if (this.filterSelectMap.businessTag[businessTag]) {
          businessTags.push(businessTag);
        }
      }
      let filterParams = {
        keyword: this.keyword,
        resourceTypes,
        businessTags,
      };
      let state = this.$refs['infinite'].stateChanger;
      let filterConditionMd5 = CryptoJS.MD5(JSON.stringify(filterParams)).toString();
      if (this.oldFilterConditionMd5 !== filterConditionMd5) {
        // 查询条件有变化
        this.tableData = [];
        if (this.infiniteFirst) {
          this.queryParams.pageNum = 1;
          this.infiniteFirst = false;
        } else {
          this.loading = false;
          this.queryParams.pageNum = 0;
          this.oldFilterConditionMd5 = filterConditionMd5;
          this.$refs['infinite'].stateChanger.reset();
          return;
        }
      }
      this.oldFilterConditionMd5 = filterConditionMd5;
      request({
        url: '/api/resourceSearch/pageList',
        method: 'post',
        data: {
          ...filterParams,
          ...this.queryParams,
        }
      }).then(response => {
        this.total = response.total || 0;
        if (response.rows && response.rows.length > 0) {
          this.tableData.push(...response.rows);
        }
        if (response.meta['resourceCollection:businessTagCount']) {
          let items = this.filters.filter(i=>i.key==='businessTag')[0].items;
          for (let item of items) {
            let count = response.meta['resourceCollection:businessTagCount'][item.dictValue];
            item.num = count ? count : 0;
          }
        }
        if (response.meta['resourceCollection:resourceTypeCount']) {
          let items = this.filters.filter(i=>i.key==='resourceType')[0].items;
          for (let item of items) {
            let count = response.meta['resourceCollection:resourceTypeCount'][item.dictValue];
            item.num = count ? count : 0;
          }
        }
        setTimeout(()=>{
          this.loading = false;
        }, 20)
        if (state) {
          if (response.rows && response.rows.length == 0) {
            state.complete();
          } else {
            state.loaded();
          }
        }
      })
        .catch(() => {
          this.loading = false;
        });
    },
    gotoHome() {
      this.$router.push({path: '/'})
    },
    queryResourceTypeOptions() {
      return request({
        url: '/api/resourceSearch/queryResourceTypeOptions',
        method: 'get',
      }).then(response => {
        if (response.code === 200) {
          this.resourceTypeOptions = response.data;
          this.filters.filter(i=>i.key==='resourceType')[0].items = response.data;
          for (let idx in response.data) {
            this.filterSelectMap.resourceType[response.data[idx].dictValue] = false;
          }
        } else {
          this.$message.error('查询资源类型失败：' + response.msg);
        }
      })
        .catch(message => {
          this.$message.error('查询资源类型失败：' + message);
        });
    },
    queryBusinessTagOptions() {
      return request({
        url: '/api/resourceSearch/queryBusinessTagOptions',
        method: 'get',
      }).then(response => {
        if (response.code === 200) {
          this.businessTagOptions = response.data;
          this.filters.filter(i=>i.key==='businessTag')[0].items = response.data;
          for (let idx in response.data) {
            this.filterSelectMap.businessTag[response.data[idx].dictValue] = false;
          }
        } else {
          this.$message.error('查询项目筛选失败：' + response.msg);
        }
      })
        .catch(message => {
          this.$message.error('查询项目筛选失败：' + message);
        });
    },
  },
  async mounted() {
    await this.queryResourceTypeOptions();
    await this.queryBusinessTagOptions();
  }
}
</script>

<style scoped lang="scss">
.idea-resource-search {
  font-family: Roboto;

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    list-style-type: none;
    padding-left: 20px;
    cursor: pointer;

    &.active {
      color: #2563EB;
      background-color: rgba(37, 99, 235, 0.1);
    }
  }

  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 14px;
  background-color: #f9fafb;

  > div {
    padding: 0 40px;
  }

  .i-r-s-header {
    height: 50px;
    box-shadow: 0 5px 10px rgba(128, 128, 128, 0.5);
    background-color: #FFFFFF;

    > div {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .header-l {
      img {
        height: 40px;
        cursor: pointer;
      }
    }

    .header-m {
      justify-content: start;
    }

    .header-r {
      justify-content: start;

      button {
        margin-left: 20px;
      }
    }
  }

  .i-r-s-main {
    height: calc(100vh - 100px);
    padding-top: 20px;
    overflow-y: auto;

    .main-l {
      ::v-deep .el-collapse {
        border: none;
      }

      ::v-deep .el-collapse-item__header {
        font-weight: 500;
        font-size: 14px;
        border: none;
        background-color: #f9fafb;
      }

      ::v-deep .el-collapse-item__wrap {
        border: none;
      }

      ::v-deep .el-collapse-item__content {
        font-weight: 400;
        font-size: 14px;
        padding-bottom: 10px;
        background-color: #f9fafb;
      }

      ::v-deep .el-collapse-item__arrow {
        display: none;
      }
    }

    .main-r {
      height: 100%;
      > div {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .m-r-1 {
        height: 40px;
        font-weight: 500;
        font-size: 18px;
        color: #111827;
        .m-r-1-sort {
          display: flex;
          justify-content: flex-end;
          label {
            font-size: 14px;
            font-weight: normal;
            color: #6B7280;
            line-height: 32px;
          }
          .s-sort-type {
            width: 140px;
          }
        }
      }

      .m-r-list {
        display: flex;
        flex-wrap: wrap;
        overflow-y: auto;
        height: calc(100vh - 210px);
        align-items: flex-start;
        justify-content: flex-start;
        align-content: flex-start;

        ::v-deep .el-loading-mask {
          position: fixed;
        }

        figure {
          margin: 10px 0;
        }

        > div {
          min-width: 269px;
          margin-right: 20px;
        }

        .card-item {
          width: 269px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          background: transparent;
        }

        .card-item-pt1 {
          text-align: center;
          height: 240px;
          width: 100%;
          background: #F3F4F6;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;

          a {
            display: flex;
            width: 100%;
            height: 100%;
            overflow: hidden;
            justify-content: center;

            img {
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
            }
          }
        }

        .card-item-pt2 {
          font-size: 14px;
          font-weight: 500;
          font-family: Roboto;
          line-height: 24px;
          text-align: center;
          padding: 8px 16px;
          min-height: 78px;
          background-color: #FFF;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          box-shadow: 0 2px 4px rgba(128, 128, 128, 0.5);

          > span {
            margin-right: 8px;
            border: none;
            height: 22px;
            line-height: 22px;
            word-wrap: break-word;
            word-break: break-all;
          }

          span.n-museum {
            color: #67c23a;
            background-color: #f0f9eb;
          }

          span.traditionowlab {
            color: #166534;
            background-color: #F0FDF4;
          }

          span.ccaa {
            background-color: #E5F6FD;
            color: #0369A1;
          }

          span.literature {
            color: #5B21B6;
            background-color: #F5F3FF;
          }

          span.beijing-city-capital-history {
            color: #075985;
            background-color: #F0F9FF;
          }

          span.qin-huai-yin-he {
            color: #9A3412;
            background-color: #FFF7ED;
          }

          span.big-river {
            color: #9F1239;
            background-color: #FEF3F2;
          }
        }
      }

      .m-r-page {
        .r-s-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 200px;
          background-color: transparent;
        }

        .r-s-pagination .el-pagination {
          position: relative;
        }
      }
    }
  }
}
::v-deep .el-pagination.is-background .btn-prev,
::v-deep .el-pagination.is-background .btn-next {
  background-color: transparent;
}
</style>
