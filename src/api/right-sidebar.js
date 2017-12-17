import fetch from '@/utils/fetch'

export function fetchSidebar(query) {
  return fetch({
    url: '/side-bar',
    method: 'get',
    params: query
  })
}

export function saveSidebar(params) {
  return fetch({
    url: '/side-bar',
    method: 'post',
    data: params
  })
}

