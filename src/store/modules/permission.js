import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.role) {
//     return roles.some(role => route.meta.role.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param routes
 */
function filterAsyncRouter(asyncRouterMap, routes) {
  routes.profile = '管理'
  const accessedRouters = asyncRouterMap.filter(route => {
    if (routes[route.path.substr(1)] === '管理' || route.path === '*') {
      return true
    } else if (routes[route.path.substr(1)] === '浏览') {
      route.meta.readonly = true
      return true
    }

    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, user) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRouter(asyncRouterMap, user.role.body)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
