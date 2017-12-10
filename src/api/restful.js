import fetch from '@/utils/fetch'

export function fetchList(uri, query) {
  return fetch({
    url: `/${uri}`,
    method: 'get',
    params: query
  })
}

export function get(uri, query) {
  return fetch({
    url: `/${uri}`,
    method: 'get',
    params: query
  })
}

export function save(uri, data) {
  return fetch({
    url: `/${uri}`,
    method: 'post',
    data: data
  })
}

export function update(uri, id, data) {
  return fetch({
    url: `/${uri}/${id}`,
    method: 'put',
    data: data
  })
}

export function del(uri, id) {
  return fetch({
    url: `/${uri}/${id}`,
    method: 'delete'
  })
}

