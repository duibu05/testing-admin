import fetch from '@/utils/fetch'

export function fetchList(query, params) {
  return fetch({
    url: `/${query}/category`,
    method: 'get'
  })
}

export function save(query, params) {
  return fetch({
    url: `/${query}/category`,
    method: 'post',
    params: params
  })
}

export function remove(query, params) {
  return fetch({
    url: `/${query}/category`,
    method: 'delete',
    params: query
  })
}

