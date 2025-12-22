import request from '@/utils/request'

// 查询用户收藏信息列表
export function listCollection(query) {
  return request({
    url: '/system/collection/list',
    method: 'get',
    params: query
  })
}

// 查询用户收藏信息详细
export function getCollection(collectionid) {
  return request({
    url: '/system/collection/' + collectionid,
    method: 'get'
  })
}

// 新增用户收藏信息
export function addCollection(data) {
  return request({
    url: '/system/collection',
    method: 'post',
    data: data
  })
}

// 修改用户收藏信息
export function updateCollection(data) {
  return request({
    url: '/system/collection',
    method: 'put',
    data: data
  })
}

// 删除用户收藏信息
export function delCollection(collectionid) {
  return request({
    url: '/system/collection/' + collectionid,
    method: 'delete'
  })
}
