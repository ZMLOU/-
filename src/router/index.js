import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */'@/views/login/index')
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: 'layout' */'@/views/layout/index'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */'@/views/home/index')
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */'@/views/advert/index')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */'@/views/advert-space/index')
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */'@/views/course/index')
      },
      {
        path: '/error-page',
        name: 'error-page',
        component: () => import(/* webpackChunkName: 'error-page' */'@/views/error-page/index')
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/index')
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */'@/views/resource/index')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */'@/views/role/index')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */'@/views/user/index')
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/create')
      },
      {
        path: '/menu/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/edit')
      },
      {
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/role/alloc-menu'),
        props: true
      },
      {
        path: '/course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/course/create')
      },
      {
        path: '/course/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/course/edit')
      },
      {
        path: '/course/:courseId/course-section',
        name: 'course-section',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/course/section'),
        props: true
      },
      {
        path: '/course/:courseId/course-video',
        name: 'course-video',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/course/video.vue'),
        props: true
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 验证to路由是否需要进行身份验证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 验证Vuex 的store中是否存储了登录用户信息
    if (!store.state.user) {
      // 没存储，跳转至登录页面
      return next({
        name: 'login',
        // 将本次路由的fullPath 传递给login页面
        query: { redirect: to.fullPath }
      })
    }
    next()
  } else {
    next()
  }
})

export default router
