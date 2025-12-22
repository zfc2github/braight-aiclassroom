import request from '@/utils/request'

// 查询用户数据扩展列表
export function listExtended(query) {
  return request({
    url: '/system/extended/list',
    method: 'get',
    params: query
  })
}

// 查询用户数据扩展详细
export function getExtended(id) {
  return request({
    url: '/system/extended/' + id,
    method: 'get'
  })
}

// 新增用户数据扩展
export function addExtended(data) {
  return request({
    url: '/system/extended',
    method: 'post',
    data: data
  })
}

// 修改用户数据扩展
export function updateExtended(data) {
  return request({
    url: '/system/extended',
    method: 'put',
    data: data
  })
}

// 删除用户数据扩展
export function delExtended(id) {
  return request({
    url: '/system/extended/' + id,
    method: 'delete'
  })
}
