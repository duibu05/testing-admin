import fetch from '@/utils/fetch'

export function fetchList(type) {
  return fetch({
    url: '/carousel-cfgs',
    method: 'get',
    params: type
  })
}

export function update(payload) {
  return fetch({
    url: '/carousel-cfgs',
    method: 'post',
    params: payload
  })
}
