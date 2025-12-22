import request from '@/utils/request'

// 查询专题素材管理列表
export function listMaterial(query) {
  return request({
    url: '/system/material/list',
    method: 'get',
    params: query
  })
}

// 查询专题素材管理详细
export function getMaterial(id) {
  return request({
    url: '/system/material/' + id,
    method: 'get'
  })
}

// 新增专题素材管理
export function addMaterial(data) {
  return request({
    url: '/system/material',
    method: 'post',
    data: data
  })
}

// 修改专题素材管理
export function updateMaterial(data) {
  return request({
    url: '/system/material',
    method: 'put',
    data: data
  })
}

// 删除专题素材管理
export function delMaterial(id) {
  return request({
    url: '/system/material/' + id,
    method: 'delete'
  })
}
