import fetch from '@/utils/fetch'

export function fetchList(query) {
  return fetch({
    url: '/news',
    method: 'get',
    params: query
  })
}

export function get(query) {
  return fetch({
    url: '/news/' + query,
    method: 'get'
  })
}

export function save(query) {
  return fetch({
    url: '/news',
    method: 'post',
    data: query
  })
}

export function update(id, data) {
  return fetch({
    url: `/news/${id}`,
    method: 'put',
    data: data
  })
}

export function del(id) {
  return fetch({
    url: `/news/${id}`,
    method: 'delete'
  })
}

