import request from '@/utils/request'

// 查询网站指南文案管理列表
export function listContent(query) {
  return request({
    url: '/system/content/list',
    method: 'get',
    params: query
  })
}

// 查询网站指南文案管理详细
export function getContent(id) {
  return request({
    url: '/system/content/' + id,
    method: 'get'
  })
}

// 新增网站指南文案管理
export function addContent(data) {
  return request({
    url: '/system/content',
    method: 'post',
    data: data
  })
}

// 修改网站指南文案管理
export function updateContent(data) {
  return request({
    url: '/system/content',
    method: 'put',
    data: data
  })
}

// 删除网站指南文案管理
export function delContent(id) {
  return request({
    url: '/system/content/' + id,
    method: 'delete'
  })
}
