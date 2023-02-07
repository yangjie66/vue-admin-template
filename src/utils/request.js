import axios from 'axios'
// 引入element-ui中的信息提示组件
import { Message } from 'element-ui'
import store from '@/store'
// 引入获取时间戳的方法
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
// 创建一个axios的实例
// 定义token过期时间为1个小时
const timeout = 3600
const service = axios.create({
  // 当执行npm run dev的时候,会读取开发环境文件里面的环境变量
  baseURL: process.env.VUE_APP_BASE_API, // 取出的值相当于'/api' // 当baseURl值为空的时候,默认请求的就是本地的后台服务
  timeout: 5000 // 定义接口请求超时时间为5s
})
// 请求拦截器  在请求拦截器中统一注入token
service.interceptors.request.use(config => {
  // console.log(config)
  if (store.getters.token) {
    // 在这里判断token有没有过期
    // 在有token的情况下再请求头中携带token  按照后台要求的格式
    if (isCheckTimeout()) {
      // 如果方法调用完毕是true,代表token过期了,执行退出登录操作,并且跳转登录页面
      store.dispatch('user/logout') // 调用退出登录的方法
      router.push('/login')
      return Promise.reject(new Error('token过时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  // config配置完毕之后必须得return出去
  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})
// 响应拦截器里面有两个参数,一个是响应成功的回调,一个是接口异常响应失败的回调
service.interceptors.response.use(
  response => {
    // 在此回调函数里面代表接口请求成功了
    // console.log(response)
    const { success, data, message } = response.data
    // 接口请求成功之后又分为两种情况
    if (success) {
      // 代表接口请求成功并响应会开数据了
      return data
    } else {
      // 代表接口请求虽然成功,但是没有回来数据,比如说是用户名和密码错误的情况
      // 调用promise中的静态方法reject,让错误信息走catch,可以在catch中获取错误信息
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  }, error => {
    // 走这个回调代表接口异常,比如说404,401,400等这些错误
    // console.log(error)
    Message.error(error.messgae) // 错误信息提示
    return Promise.reject(error)
  }
)
function isCheckTimeout() {
  // 调用接口时获取的最新的时间戳-cookie中存储的时间戳>timeout的话代表token过期了
  const nowTime = Date.now() // 获取最新的时间戳
  const oldTime = getTimeStamp() // 获取旧的时间戳
  return (nowTime - oldTime) / 1000 > timeout
}
export default service // 导出axios实例
