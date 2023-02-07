// 按需引入cookie的几个方法
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { getUserInfo, login, getUserDetailById } from '@/api/user' // 引入登录接口
const state = {
  token: getToken(), // 页面一打开,先从缓存中获取token
  userInfo: {} // 存放的用户资料信息 不能定义为null,因为在.的时候,可能会报错
}
const mutations = {
  // 定义修改token的方法
  xiugaiToken(state, token) {
    state.token = token
    // 存储在vuex的同时在缓存中存储一份
    setToken(token)
  },
  // 定义清空token的方法,在退出登录的时候需要清空
  deleteToken(state) {
    state.token = null
    // 从缓存中清除token
    removeToken()
  },
  // 修改用户资料的方法
  setUserInfo(state, result) {
    state.userInfo = result
  },
  // // 设置用户信息
  // setUserInfo(state, userInfo) {
  //   state.userInfo = { ...userInfo } // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
  // },
  // 在退出登录时,需要清空用户资料
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  // 定义登录的方法，data是表单数据对象,是点击登录按钮时传递过来的参数
  async login(context, data) {
    // 响应拦截器中没有做统一处理时,写法如下 在里面调用登录接口
    // 在里面调用登录接口
    const result = await login(data)
    // console.log(result)
    // 调用mutations里面的方法将后台返回的token存储到vuex中
    context.commit('xiugaiToken', result)
    // 在vuex中存储token的时候,顺便存储一个时间戳
    setTimeStamp()
  },
  // 定义获取用户资料的方法
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 等待上一个获取用户基本信息的接口调用成功之后,在去调用获取头像的接口
    const baseInfo = await getUserDetailById(result.userId)
    // 将两个接口得到的结果进行合并,存储到一个对象里面
    const obj = { ...result, ...baseInfo }
    // 在拿到接口响应回来的结果之后,存储到state的userInfo对象
    context.commit('setUserInfo', obj)
    return result // 这是一个伏笔  做权限管理用
  },
  // 退出登录的方法
  logout(context) {
    // 调用mutations里面的方法删除用户信息和token
    context.commit('deleteToken')
    context.commit('removeUserInfo')
  }
}
// vuex中的用户管理模块
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
