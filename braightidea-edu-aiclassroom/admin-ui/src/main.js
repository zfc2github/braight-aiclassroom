import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/dataviz.scss' // dataviz css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download, downloadNoLoading } from '@/utils/request'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, addDateRange2, selectDictLabel, selectDictLabels, handleTree } from "@/utils/dataviz";
// 分页组件
import Pagination from "@/components/Pagination";
import PaginationNext from "@/components/PaginationNext";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.addDateRange2 = addDateRange2
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.downloadNoLoading = downloadNoLoading
Vue.prototype.handleTree = handleTree

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('PaginationNext', PaginationNext)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)



import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';

Vue.use(Viewer);
Viewer.setDefaults({
  Options: {
    inline: true, // 是否启用inline模式
    button: true, // 是否显示右上角关闭按钮
    navbar: true, // 是否显示缩略图底部导航栏
    title: true, // 是否显示当前图片标题，默认显示alt属性内容和尺寸
    toolbar: true, // 是否显示工具栏
    tooltip: true, // 放大或缩小图片时，是否显示缩放百分比，默认true
    fullscreen: true, // 播放时是否全屏，默认true
    loading: true, // 加载图片时是否显示loading图标，默认true
    loop: true, // 是否可以循环查看图片，默认true
    movable: true, // 是否可以拖动图片，默认true
    zoomable: true, // 是否可以缩放图片，默认true
    rotatable: true, // 是否可以旋转图片，默认true
    scalable: true, // 是否可以翻转图片，默认true
    toggleOnDblclick: true, // 放大或缩小图片时，是否可以双击还原，默认true
    transition: true, // 使用 CSS3 过度，默认true
    keyboard: true, // 是否支持键盘，默认true
    zoomRatio: 0.1, // 鼠标滚动时的缩放比例，默认0.1
    minZoomRatio: 0.01, // 最小缩放比例，默认0.01
    maxZoomRatio: 100, // 最大缩放比例，默认100
    url: 'data-source' // 设置大图片的 url
  }
})

Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
DictData.install()

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

import Carousel3d from "vue-carousel-3d";
Vue.use(Carousel3d)

// 无限滚动组件
import InfiniteLoading from "vue-infinite-loading";
Vue.use(InfiniteLoading, {
  system: {
    throttleLimit: 50
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
