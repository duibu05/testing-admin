import fetch from '@/utils/fetch'

export function fetchList(query) {
  return fetch({
    url: '/joiners',
    method: 'get',
    params: query
  })
}

