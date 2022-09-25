// 管理所有的自定义指令
// 头像图片获取出现异常情况
export const imagerror = {
  inserted(dom, options) {
    // 当图片有地址,但是获取到的时候地址无效,触发错误的时候 触发onerror事件
    dom.onerror = function () {
      // 当图片出现异常的时候 把指令的默认图片设置给src
      dom.src = options.value;
    };
  },
};
