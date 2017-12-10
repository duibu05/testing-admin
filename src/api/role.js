import fetch from '@/utils/fetch'

export function fetchList(query) {
  return fetch({
    url: '/users/roles',
    method: 'get',
    params: query
  })
}

export function get(id) {
  return fetch({
    url: `/users/roles/${id}`,
    method: 'get'
  })
}

export function save(data) {
  return fetch({
    url: '/users/roles',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return fetch({
    url: `/users/roles/${id}`,
    method: 'put',
    data: data
  })
}

export function del(id) {
  return fetch({
    url: `/users/roles/${id}`,
    method: 'delete'
  })
}

