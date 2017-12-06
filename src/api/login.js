import fetch from '@/utils/fetch'

export function loginByUsername(account, password) {
  const data = {
    account,
    password
  }
  return fetch({
    url: '/users/signin',
    method: 'post',
    data
  })
}

export function logout() {
  return fetch({
    url: '/users/signout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return fetch({
    url: `/users/token/${token}`,
    method: 'get'
  })
}

