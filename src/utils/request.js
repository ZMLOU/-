import axios from 'axios'
// 引入vuex的数据
import store from '@/store'
// 引入axios中的模块Message
import { Message } from 'element-ui'
// 引入路由模块router
import router from '@/router'
// 对请求参数做处理
import qs from 'qs'

// create 创建 axios 实例
const request = axios.create({})

function getBaseUrl (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagounews.com'
  } else {
    return 'http://edufront.lagounews.com'
  }
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 通过判断config.url的前缀，来进行baseurl的设置
  config.baseURL = getBaseUrl(config.url)
  // 统一进行鉴权设置
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

// 封装跳转登录方法
function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      // currentRoute存储了路由信息的对象
      redirect: router.currentRoute.fullPath
    }
  })
}

// 声明isRefreshind全局变量，判断是否有正在刷新token的请求
let isRefreshing = false
// 存储请求失败的请求
let requests = []
// 响应拦截器
request.interceptors.response.use(function (response) {
  // console.log('响应成功了', response)
  return response
}, function (error) {
  if (error.response) {
    // 请求发送成功，收到响应，但状态玛为失败
    // 判断状态码错误的情况，主要处理401
    const { status } = error.response
    let errMessage = ''
    if (status === 400) {
      errMessage = '请求参数错误'
    } else if (status === 401) {
      // token无效，更新token
      // 1、没有token，跳转至登录页面
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      // 获取新的token前，判断是否有正在刷新token的请求
      if (isRefreshing) {
        return requests.push(() => {
          // 当前函数调用后，会重新发送请求
          request(error.config)
        })
      }
      isRefreshing = true
      // 2、有token，token过期 无效token
      // 发送请求，获取新的access_token
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // refresh_token无效
        if (res.data.state !== 1) {
          // 清除无效的token信息
          store.commit('setUser', null)
          // 跳转至登录页面
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新token
        store.commit('setUser', res.data.content)
        // 遍历requests数组，重新发送所有失败请求
        requests.forEach(callback => callback())
        // 所有失败请求重新发送后，将requests置为空，以便下次刷新token使用
        requests = []
        // 重新发送第一次发送失败的请求
        return request(error.config)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        isRefreshing = false
      })
    } else if (status === 403) {
      errMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errMessage = '请求资源不存在'
    } else if (status >= 500) {
      errMessage = '服务端错误，请联系管理员'
    }
    Message.error(errMessage)
  } else if (error.request) {
    // 请求发了，响应没收到
    Message.error('请求超时，请重试')
  } else {
    // 意料之外的错误
    Message.error(error.message)
  }
  // 将本次请求的错误对象向后抛出，让接收响应的函数进行操作
  return Promise.reject(error)
})

export default request
