import fetch from '@/utils/fetch'

export function fetchList(query) {
  return fetch({
    url: '/users',
    method: 'get',
    params: query
  })
}

export function get(query) {
  return fetch({
    url: '/users/' + query,
    method: 'get'
  })
}

export function save(query) {
  return fetch({
    url: '/users',
    method: 'post',
    data: query
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

