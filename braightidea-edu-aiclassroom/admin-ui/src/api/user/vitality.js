import request from '@/utils/request'

// 查询用户活跃度列表
export function listVitality(query) {
  return request({
    url: '/system/vitality/list',
    method: 'get',
    params: query
  })
}

// 查询用户活跃度详细
export function getVitality(id) {
  return request({
    url: '/system/vitality/' + id,
    method: 'get'
  })
}

// 新增用户活跃度
export function addVitality(data) {
  return request({
    url: '/system/vitality',
    method: 'post',
    data: data
  })
}

// 修改用户活跃度
export function updateVitality(data) {
  return request({
    url: '/system/vitality',
    method: 'put',
    data: data
  })
}

// 删除用户活跃度
export function delVitality(id) {
  return request({
    url: '/system/vitality/' + id,
    method: 'delete'
  })
}
