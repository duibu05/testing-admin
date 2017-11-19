import fetch from '@/utils/fetch'

export function getToken() {
  return fetch({
    url: process.env.QINIU_TOKEN_URL, // 获取七牛云token接口
    method: 'get'
  })
}

