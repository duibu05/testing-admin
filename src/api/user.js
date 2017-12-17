import fetch from '@/utils/fetch'

export function fetchList(query) {
  return fetch({
    url: '/users',
    method: 'get',
    params: query
  })
}

export function get(id) {
  return fetch({
    url: `/users/${id}`,
    method: 'get'
  })
}

export function save(data) {
  return fetch({
    url: '/users',
    method: 'post',
    data: data
  })
}

export function resetPassword(id, data) {
  return fetch({
    url: `/users/reset-password/${id}`,
    method: 'put',
    data: data
  })
}

export function update(id, data) {
  return fetch({
    url: `/users/${id}`,
    method: 'put',
    data: data
  })
}

export function del(id) {
  return fetch({
    url: `/users/${id}`,
    method: 'delete'
  })
}

export function roles(query) {
  return fetch({
    url: '/users/roles',
    method: 'get',
    params: query
  })
}

