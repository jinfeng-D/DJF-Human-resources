// 拦截器在路由跳转的时候 导航守卫
import router from "@/router";
import store from "@/store"; // 组件中的store实例 和this.$store是一回事
import nprogress from "nprogress"; //引入进度条
import "nprogress/nprogress.css"; //引入进度条
// 不需要导出,让代码执行就可以了
// 前置守卫
// next是前置守卫必须执行的钩子next必须执行,如果不执行页面就挂掉了
// next ()执行,通过
// next(false) 终止,跳转
// next(地址) 跳转到该地址
// 白名单
const whitelist = ["/login", "/404"];
router.beforeEach(async (to, from, next) => {
  nprogress.start(); //开启进度条
  // 如果有token
  if (store.getters.token) {
    // 是否前往登录页
    if (to.path === "/login") {
      // 是的话直接跳转到主页
      next("/");
    } else {
      // 不是前往登录页 放行
      // 判断有没有获取过用户的id
      if (!store.getters.userId) {
        // 如果没有用户id 表示没有获取过用户的id, 在这里获取一下
        await store.dispatch("user/getUserInfo");
      }
      next();
    }
  } else {
    // 没有token,判断是否在白名单
    if (whitelist.indexOf(to.path) > -1) {
      //  是在白名单 放过同行
      next();
    } else {
      // 没有在白名单,强制跳到登录页
      next("/login");
    }
  }
  nprogress.done(); //关闭进度条   强制关闭一次ß
});
// 后置守卫
router.afterEach(function () {
  // 在切换路由结束时调用 ***
  nprogress.done(); // 关闭进度条
});
