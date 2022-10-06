// 管理所有的自定义指令
// 头像图片获取出现异常情况
export const imagerror = {
  // created list: []
  // beforeUpdate updated
  inserted(dom, options) {
    //如果src是null，那么就将value（也就是默认值）给src
    dom.src = dom.src || options.value;

    dom.onerror = function () {
      dom.src = options.value;
    };
  },
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value;
  },
};
