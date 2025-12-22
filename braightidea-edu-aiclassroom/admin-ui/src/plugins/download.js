import axios from 'axios'
import { Message } from 'element-ui'
import { saveAs } from 'file-saver'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { blobValidate } from "@/utils/dataviz";

const baseURL = process.env.VUE_APP_BASE_API

export default {
  name(name, isDelete = true) {
    var url = baseURL + "/common/download?fileName=" + encodeURIComponent(name) + "&delete=" + isDelete
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    }).then((res) => {
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURIComponent(res.headers['download-filename']))
      } else {
        this.printErrMsg(res.data);
      }
    })
  },
  resource(resource) {
    var url = baseURL + "/common/download/resource?resource=" + encodeURIComponent(resource);
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    }).then((res) => {
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURIComponent(res.headers['download-filename']))
      } else {
        this.printErrMsg(res.data);
      }
    })
  },
  zip(url, name) {
    var url = baseURL + url
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    }).then((res) => {
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data], { type: 'application/zip' })
        this.saveAs(blob, name)
      } else {
        this.printErrMsg(res.data);
      }
    })
  },
  saveAs(text, name, opts) {
    saveAs(text, name, opts);
  },
  async printErrMsg(data) {
    const resText = await data.text();
    const rspObj = JSON.parse(resText);
    const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
    Message.error(errMsg);
  },
  downloadImage(url, query, filename) {
    Message.info({
      showClose: true,
      message: '正在下载数据，请稍候'
    });
    return axios({
      url: process.env.VUE_APP_BASE_API + url,
      method: 'get',
      params: query,
      responseType: 'blob',
      headers: {'Authorization': 'Bearer ' + getToken()}
    }).then((res) => {
      const url = window.URL.createObjectURL(res.data); // 创建一个URL对象，指向Blob对象
      const link = document.createElement('a'); // 创建一个<a>标签
      link.href = url;
      link.target = '_blank';
      let downloadFilename = res.headers['download-filename'];
      if (downloadFilename) {
        downloadFilename = decodeURIComponent(downloadFilename);
      }
      link.download = filename || downloadFilename; // 设置下载的文件名
      document.body.appendChild(link); // 将<a>标签添加到页面中
      link.click(); // 模拟点击<a>标签，触发下载
      document.body.removeChild(link); // 下载完成后移除<a>标签
      window.URL.revokeObjectURL(url); // 释放URL对象
    }).catch((r) => {
      console.log(r);
      this.$message.error('图片下载失败');
    });
  },
  downloadOnlineImage(href, filename) {
    const link = document.createElement('a');
    link.href = href;
    link.target = "_blank";
    link.download = filename || ''; // 指定下载文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

