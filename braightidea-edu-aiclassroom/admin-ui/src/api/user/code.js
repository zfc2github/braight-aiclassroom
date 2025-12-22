import request from '@/utils/request'

// 查询code发送信息列表
export function listCode(query) {
  return request({
    url: '/system/code/list',
    method: 'get',
    params: query
  })
}

// 查询code发送信息详细
export function getCode(id) {
  return request({
    url: '/system/code/' + id,
    method: 'get'
  })
}

// 新增code发送信息
export function addCode(data) {
  return request({
    url: '/system/code',
    method: 'post',
    data: data
  })
}

// 修改code发送信息
export function updateCode(data) {
  return request({
    url: '/system/code',
    method: 'put',
    data: data
  })
}

// 删除code发送信息
export function delCode(id) {
  return request({
    url: '/system/code/' + id,
    method: 'delete'
  })
}
