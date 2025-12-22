import request from '@/utils/request'

// 查询右键发送记录列表
export function listEmail(query) {
  return request({
    url: '/system/email/list',
    method: 'get',
    params: query
  })
}

// 查询右键发送记录详细
export function getEmail(id) {
  return request({
    url: '/system/email/' + id,
    method: 'get'
  })
}

// 新增右键发送记录
export function addEmail(data) {
  return request({
    url: '/system/email',
    method: 'post',
    data: data
  })
}

// 修改右键发送记录
export function updateEmail(data) {
  return request({
    url: '/system/email',
    method: 'put',
    data: data
  })
}

// 删除右键发送记录
export function delEmail(id) {
  return request({
    url: '/system/email/' + id,
    method: 'delete'
  })
}
