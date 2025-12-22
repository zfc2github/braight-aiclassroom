import request from '@/utils/request'

// 查询第三方登录信息列表
export function listRecording(query) {
  return request({
    url: '/system/recording/list',
    method: 'get',
    params: query
  })
}

// 查询第三方登录信息详细
export function getRecording(id) {
  return request({
    url: '/system/recording/' + id,
    method: 'get'
  })
}

// 新增第三方登录信息
export function addRecording(data) {
  return request({
    url: '/system/recording',
    method: 'post',
    data: data
  })
}

// 修改第三方登录信息
export function updateRecording(data) {
  return request({
    url: '/system/recording',
    method: 'put',
    data: data
  })
}

// 删除第三方登录信息
export function delRecording(id) {
  return request({
    url: '/system/recording/' + id,
    method: 'delete'
  })
}
