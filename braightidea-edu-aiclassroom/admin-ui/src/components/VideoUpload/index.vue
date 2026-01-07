<template>
  <div class="component-upload-video">
    <!-- 视频播放区域，添加悬停容器 -->
    <div class="video-container" @mouseenter="showDeleteBtn = true" @mouseleave="showDeleteBtn = false" style="position: relative;width: 400px;">
      <video
        :src="dialogVideoUrl"
        controls
        v-show="dialogVideoUrl"        style="width: 400px; height: auto;"
      >
        您的浏览器不支持视频播放
      </video>
      <!-- 删除按钮 -->
      <el-button
        v-show="showDeleteBtn && dialogVideoUrl"
        class="delete-btn"
        type="danger"
        icon="el-icon-delete"
        size="mini"
        circle
        @click="handleRemoveVideo"
        style="position: absolute;left: 48%;top: 48%;"
      ></el-button>
    </div>
    <el-upload
      multiple
      :action="uploadVideoUrl"
      :accept="acceptFileType"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      ref="videoUpload"
      :on-remove="handleDelete"
      :show-file-list="false"
      :headers="headers"
      :file-list="fileList"
      :class="{hide: this.fileList.length >= this.limit}"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>

    <!-- 上传提示 -->
    <div class="el-upload__tip" slot="tip" v-if="showTip">
      请上传
      <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
      <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
      的文件
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  name: "VideoUpload",
  props: {
    value: [String, Object, Array],
    // 数量限制
    limit: {
      type: Number,
      default: 1,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 50,
    },
    // 文件类型, 例如['mp4', 'avi', 'mov']
    fileType: {
      type: Array,
      default: () => ["mp4", "avi", "mov", "wmv", "flv", "webm"],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      number: 0,
      uploadList: [],
      dialogVideoUrl: "",
      dialogVisible: false,
      hideUpload: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadVideoUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的视频服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: [],
      showDeleteBtn: false // 控制删除按钮显示
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          // 首先将值转为数组
          const list = Array.isArray(val) ? val : this.value.split(',');
          // 然后将数组转为对象数组
          this.fileList = list.map(item => {
            if (typeof item === "string") {
              if (item.indexOf(this.baseUrl) === -1
                && !item.startsWith("http") && !item.startsWith("https")) {
                item = { name: this.baseUrl + item, url: this.baseUrl + item };
              } else {
                item = { name: item, url: item };
              }
            }
            return item;
          });
        } else {
          this.fileList = [];
        }
        if (this.fileList.length === 1) {
          this.dialogVideoUrl = this.fileList[0].url;
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
    acceptFileType() {
      return this.fileType.length
        ? this.fileType.map(item => {
          if (item.startsWith('.')) {
            return item;
          } else {
            return `.${item}`;
          }
        }).join(",")
        : "video/*";
    },
  },
  methods: {
    // 处理删除视频
    handleRemoveVideo() {
      // 重置视频URL和文件列表
      this.dialogVideoUrl = "";
      this.fileList = [];
      this.$emit("input", "");

      // 如果有对应的上传文件，也从上传列表中移除
      if(this.$refs.videoUpload && this.$refs.videoUpload.fileList) {
        this.$refs.videoUpload.fileList = [];
      }
    },
    // 上传前loading加载
    handleBeforeUpload(file) {
      let isVideo = false;

      if (this.fileType.length) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
        }
        isVideo = this.fileType.some(type => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
      } else {
        isVideo = file.type.indexOf("video") > -1;
      }

      if (!isVideo) {
        this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}视频格式文件!`);
        return false;
      }
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`上传视频大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      this.$modal.loading("正在上传视频，请稍候...");
      this.number++;
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.uploadList.push({ name: res.fileName, url: res.url });
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.videoUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除视频
    handleDelete(file) {
      const findex = this.fileList.map(f => f.name).indexOf(file.name);
      if(findex > -1) {
        this.fileList.splice(findex, 1);
        this.$emit("input", this.listToString(this.fileList));
      }
    },
    // 上传失败
    handleUploadError() {
      this.$modal.msgError("上传视频失败，请重试");
      this.$modal.closeLoading();
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.uploadList = [];
        this.number = 0;
        this.$emit("input", this.listToString(this.fileList));
        this.$modal.closeLoading();
      }
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        if (list[i].url) {
          strs += list[i].url.replace(this.baseUrl, "") + separator;
        }
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : '';
    }
  }
};
</script>
<style scoped lang="scss">
// 隐藏超出限制的上传按钮
::v-deep.hide .el-upload--picture-card {
    display: none;
}
// 去掉动画效果
::v-deep .el-list-enter-active,
::v-deep .el-list-leave-active {
  transition: all 0s;
}

::v-deep .el-list-enter,
::v-deep .el-list-leave-active {
  opacity: 0;
  transform: translateY(0);
}
</style>
<style>
 .component-upload-video .el-upload-list__item-thumbnail {
   height: auto !important;
   max-height: 100% !important;
 }
.component-upload-video .el-upload-list__item {
  display: flex;
  align-items: center;
}
</style>
