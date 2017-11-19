import fetch from '@/utils/fetch'

export function fetchSidebar(query) {
  return fetch({
    url: '/right-sidebar',
    method: 'get',
    params: query
  })
}

export function saveSidebar(params) {
  return fetch({
    url: '/right-sidebar',
    method: 'post',
    params: params
  })
}

