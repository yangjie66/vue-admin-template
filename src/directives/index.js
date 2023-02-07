// 将全局自定义指令的第二个参数对象单独封装到此文件中
export const imageerror = {
  inserted(dom, options) {
    // dom代表的是自定义指令所在标签的dom
    // options代表的是自定义指令传递过来的参数所在的对象
    // 当图片地址出现异常是,会触发图片的onerror事件
    if (!dom.src) {
      // 当后台返回的图片地址是null的时候,也需要重新默认一张
      dom.src = options.value
    }
    dom.onerror = function() {
      // 如果出现异常,则默认一张本地图片地址
      dom.src = options.value // options.value代表的是自定义指令时传递过来的参数
    }
  }
}
