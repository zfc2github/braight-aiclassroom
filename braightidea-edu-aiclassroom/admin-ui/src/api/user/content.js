import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listContent(query) {
  return request({
    url: '/system/content/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getContent(id) {
  return request({
    url: '/system/content/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addContent(data) {
  return request({
    url: '/system/content',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateContent(data) {
  return request({
    url: '/system/content',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delContent(id) {
  return request({
    url: '/system/content/' + id,
    method: 'delete'
  })
}
