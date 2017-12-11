import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */
import Layout from '../views/layout/Layout'

/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* redirect : if `redirect:noredirect` will no redirct in the levelbar
* noDropdown : if `noDropdown:true` will has no submenu
* meta : { role: ['admin'] }  will control the page role
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/profile/password',
    name: '首页',
    hidden: true
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/joiner-mgmt',
    component: Layout,
    redirect: '/joiner-mgmt/list',
    icon: 'form',
    meta: { role: ['admin'] },
    noDropdown: true,
    children: [
      {
        path: 'list',
        component: _import('join-list/index'),
        name: '报名管理',
        meta: { role: ['admin'] }
      }
    ]
  },
  {
    path: '/carousel-mgmt',
    component: Layout,
    redirect: '/carousel-mgmt/index',
    name: '推荐管理',
    icon: 'star',
    meta: { role: ['admin'] },
    children: [
      {
        path: 'index',
        component: _import('carousel-mgmt/index'),
        name: '网站首页',
        meta: { role: ['admin'] }
      },
      {
        path: 'wechat-index',
        component: _import('carousel-mgmt/wechat-index'),
        name: '微信首页',
        meta: { role: ['admin'] }
      },
      {
        path: 'teacher-qe',
        component: _import('carousel-mgmt/teacher-qe'),
        name: '教师资格',
        meta: { role: ['admin'] }
      },
      {
        path: 'juducial-exam',
        component: _import('carousel-mgmt/juducial-exam'),
        name: '司法考试',
        meta: { role: ['admin'] }
      }
    ]
  },
  {
    path: '/website-mgmt',
    component: Layout,
    redirect: '/website-mgmt/news-center',
    name: '网站管理',
    icon: 'component',
    meta: { role: ['admin'] },
    children: [
      {
        path: 'news-center',
        component: _import('website-mgmt/news-center'),
        name: '新闻中心',
        noDropdown: true,
        meta: { role: ['admin'] }
      },
      {
        path: 'news-center/add',
        component: _import('website-mgmt/add-news'),
        name: '新闻中心 / 添加新闻',
        hidden: true,
        meta: { role: ['admin'], isEdit: false }
      },
      {
        path: 'news-center/edit/:id',
        component: _import('website-mgmt/add-news'),
        name: '新闻中心 / 编辑新闻',
        hidden: true,
        meta: { role: ['admin'], isEdit: true }
      },
      {
        path: 'lesson-mgmt',
        component: _import('website-mgmt/lesson-mgmt'),
        name: '课程管理',
        meta: { role: ['admin'] }
      },
      {
        path: 'lesson-mgmt/add',
        component: _import('website-mgmt/add-lesson'),
        name: '课程管理 / 添加课程',
        hidden: true,
        meta: { role: ['admin'], isEdit: false }
      },
      {
        path: 'lesson-mgmt/edit/:id',
        component: _import('website-mgmt/add-lesson'),
        name: '课程管理 / 编辑课程',
        hidden: true,
        meta: { role: ['admin'], isEdit: true }
      },
      {
        path: 'website-content',
        component: _import('website-mgmt/website-content'),
        name: '网站内容',
        meta: { role: ['admin'] }
      },
      {
        path: 'website-content/add',
        component: _import('website-mgmt/add-wcontent'),
        name: '网站内容 / 添加网站内容',
        hidden: true,
        meta: { role: ['admin'], isEdit: false }
      },
      {
        path: 'website-content/edit/:id',
        component: _import('website-mgmt/add-wcontent'),
        name: '网站内容 / 编辑网站内容',
        hidden: true,
        meta: { role: ['admin'], isEdit: true }
      }
    ]
  },
  {
    path: '/wechat-mgmt',
    component: Layout,
    redirect: '/wechat-mgmt/paper-mgmt',
    name: '微信管理',
    icon: 'wechat',
    meta: { role: ['admin'] },
    children: [
      {
        path: 'paper-mgmt',
        component: _import('wechat-mgmt/paper-mgmt'),
        name: '试卷管理',
        meta: { role: ['admin'] }
      },
      {
        path: 'paper-mgmt/add',
        component: _import('wechat-mgmt/add-paper'),
        name: '试卷管理 / 添加试卷',
        hidden: true,
        meta: { role: ['admin'], isEdit: false }
      },
      {
        path: 'paper-mgmt/edit/:id',
        component: _import('wechat-mgmt/add-paper'),
        name: '试卷管理 / 编辑试卷',
        hidden: true,
        meta: { role: ['admin'], isEdit: true }
      },
      {
        path: 'question-mgmt',
        component: _import('wechat-mgmt/question-mgmt'),
        name: '试题管理',
        meta: { role: ['admin'] }
      },
      {
        path: 'question-mgmt/add',
        component: _import('wechat-mgmt/add-question'),
        name: '试题管理 / 添加试题',
        hidden: true,
        meta: { role: ['admin'], isEdit: false }
      },
      {
        path: 'question-mgmt/edit/:id',
        component: _import('wechat-mgmt/add-question'),
        name: '试题管理 / 编辑试题',
        hidden: true,
        meta: { role: ['admin'], isEdit: true }
      },
      {
        path: 'wechat-content',
        component: _import('wechat-mgmt/wechat-content'),
        name: '微信内容',
        meta: { role: ['admin'] }
      },
      {
        path: 'wechat-content/add',
        component: _import('wechat-mgmt/add-wcontent'),
        name: '微信内容 / 添加微信内容',
        hidden: true,
        meta: { role: ['admin'], isEdit: false }
      },
      {
        path: 'wechat-content/edit/:id',
        component: _import('wechat-mgmt/add-wcontent'),
        name: '微信内容 / 编辑微信内容',
        hidden: true,
        meta: { role: ['admin'], isEdit: true }
      }
    ]
  },
  {
    path: '/material-mgmt',
    component: Layout,
    redirect: '/material-mgmt/about-us',
    name: '素材管理',
    icon: 'theme',
    meta: { role: ['admin'] },
    children: [
      {
        path: 'about-us',
        component: _import('material-mgmt/about-us'),
        name: '关于我们',
        meta: { role: ['admin'] }
      },
      {
        path: 'right-sidebar',
        component: _import('material-mgmt/right-sidebar'),
        name: '侧边栏',
        meta: { role: ['admin'] }
      }
    ]
  },
  {
    path: '/category-mgmt',
    component: Layout,
    redirect: '/category-mgmt/shijuan',
    name: '分类管理',
    icon: 'table',
    meta: { role: ['admin'] },
    children: [
      {
        path: 'shijuan',
        component: _import('category-mgmt/shijuan'),
        name: '试卷分类管理',
        meta: { role: ['admin'] }
      },
      {
        path: 'shiti',
        component: _import('category-mgmt/shiti'),
        name: '试题分类管理',
        meta: { role: ['admin'] }
      },
      {
        path: 'web-content',
        component: _import('category-mgmt/web-content'),
        name: '网站内容分类管理',
        meta: { role: ['admin'] }
      },
      {
        path: 'wechat-content',
        component: _import('category-mgmt/wechat-content'),
        name: '微信小程序分类管理',
        meta: { role: ['admin'] }
      }
    ]
  },
  {
    path: '/user-mgmt',
    component: Layout,
    redirect: '/user-mgmt/index',
    noDropdown: true,
    icon: 'people',
    meta: { role: ['admin'] },
    children: [
      {
        path: 'index',
        component: _import('user-mgmt/index'),
        name: '用户管理',
        meta: { role: ['admin'] }
      }
    ]
  },
  {
    path: '/auth',
    component: Layout,
    redirect: '/auth/accounts',
    name: '权限管理',
    icon: 'lock',
    meta: { role: ['admin'] },
    children: [
      {
        path: 'accounts',
        component: _import('auth/accounts'),
        name: '账号管理',
        meta: { role: ['admin'] }
      },
      {
        path: 'roles',
        component: _import('auth/roles'),
        name: '角色管理',
        meta: { role: ['admin'] }
      },
      {
        path: 'roles/add',
        component: _import('auth/add-role'),
        name: '角色管理 / 添加角色',
        hidden: true,
        meta: { role: ['admin'], isEdit: false }
      },
      {
        path: 'roles/edit/:id',
        component: _import('auth/add-role'),
        name: '角色管理 / 编辑角色',
        hidden: true,
        meta: { role: ['admin'], isEdit: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    name: '账号设置',
    icon: 'eye',
    meta: { role: ['admin'] },
    children: [
      {
        path: 'index',
        component: _import('profile/index'),
        name: '个人中心',
        meta: { role: ['admin'] }
      },
      {
        path: 'password',
        component: _import('profile/password'),
        name: '修改密码',
        meta: { role: ['admin'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
