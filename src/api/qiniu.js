import fetch from '@/utils/fetch'

export function getToken() {
  return fetch({
    url: 'http://en.admin.ccf-china.com/api/qiniu-uptoken', // 获取七牛云token接口
    method: 'get'
  })
}

export default {
  domain: 'http://cdn1.ccf-china.com/'
}
