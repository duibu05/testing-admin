const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews,
  token: state => state.user.token,
  id: state => state.user.id,
  nickname: state => state.user.nickname,
  status: state => state.user.status,
  roles: state => state.user.roles,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
