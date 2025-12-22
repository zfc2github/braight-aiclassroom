import request from '@/utils/request'


export function listAccessKey(query) {
  return request({
    url: '/system/accessKey/list',
    method: 'get',
    params: query
  })
}

export function addAccessKey(data) {
  return request({
    url: '/system/accessKey',
    method: 'post',
    data: data
  })
}

export function delAccessKey(id) {
  return request({
    url: '/system/accessKey/' + id,
    method: 'delete'
  })
}
