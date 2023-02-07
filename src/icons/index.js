import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// 注册了一个全局的图标组件
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
// 以上两行代码代表的是将svg文件夹下的图标一次性引入到项目中
