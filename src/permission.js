// 登录权限文件写在这里
// 问题1：怎么知道目前跳转的是哪个页面?通过路由前置守卫可以知道
// 问题2：从哪里获取token
// 引入路由实例
import router from './router'
// 引入store
import store from '@/store'
// 引入进度条插件
import NProgress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
// 定义白名单列表
const whiteList = ['/login', '404']
// 前置守卫
router.beforeEach(async(to, from, next) => {
  // 在跳转之前 开启进度条
  NProgress.start()
  // to代表的是要去哪里
  // from代表的是从哪里跳转过来的
  // next是一个方法,必须得执行,要不然页面会卡死
  // next()代表直接放行  next(false)代表的是终止跳转：next('路由地址')代表的是跳转到某个页面
  if (store.getters.token) {
    // 如果有token,代表用户已经登录
    if (to.path === '/login') {
      // 如果有token,跳转的是登录页面,则直接跳转到主页,免登录
      next('/')
    } else {
      // 否则.如果是其他页面,则直接放行
      // 在有token的前提下,触发获取用户资料的方法
      // 页面跳转都会经过路由守卫,那就会每跳转一次页面就会触发一次获取用户资料的接口,为了只请求一次,需要加一个判断
      if (!store.getters.userId) {
        // 没有用户资料的时候再去请求接口
        await store.dispatch('user/getUserInfo')
      }
      // 等待用户资料获取成功之后再进行跳转,放行
      next()
    }
  } else {
    // 如果没有token,代表用户没有登录,也分为两种情况:
    // 情况1如果在白名单内,则放过通行
    if (whiteList.indexOf(to.path) > -1) {
      // 如果跳转的页面在白名单内,则放过通行
      next()
    } else {
      // 情况2如果不在白名单内,则强制跳转到登录页面
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决  手动切换地址时 进度条的不关闭的问题
})
// 后置守卫  回调里面只有两个参数,to和from,没有next(),在页面跳转成功之后做一些后续的问题
router.afterEach(function(to, from) {
  // 关闭进度条
  NProgress.done()
})
