import request from '@/utils/request'

// 查询鲲，蛟，混沌阈值列表
export function listKun(query) {
  return request({
    url: '/system/kun/list',
    method: 'get',
    params: query
  })
}

// 查询鲲，蛟，混沌阈值详细
export function getKun(id) {
  return request({
    url: '/system/kun/' + id,
    method: 'get'
  })
}

// 新增鲲，蛟，混沌阈值
export function addKun(data) {
  return request({
    url: '/system/kun',
    method: 'post',
    data: data
  })
}

// 修改鲲，蛟，混沌阈值
export function updateKun(data) {
  return request({
    url: '/system/kun',
    method: 'put',
    data: data
  })
}

// 删除鲲，蛟，混沌阈值
export function delKun(id) {
  return request({
    url: '/system/kun/' + id,
    method: 'delete'
  })
}
