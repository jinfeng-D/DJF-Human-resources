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
        const { roles } = await store.dispatch("user/getUserInfo");
        // 如果说后续 需要根据用户资料获取数据的话 这里必须改成 同步
        // 筛选用户的可用路由
        // actions中函数 默认是Promise对象 调用这个对象 想要获取返回的值话 必须 加 await或者是then
        // actions是做异步操作的
        const routes = await store.dispatch(
          "permission/filterRoutes",
          roles.menus
        );
        // routes就是筛选得到的动态路由
        // 动态路由 添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
        // addRoutes  必须 用 next(地址) 不能用next()  (这是一个已知缺陷)
        console.log(routes);
        router.addRoutes([
          ...routes,
          { path: "*", redirect: "/404", hidden: true },
        ]); // 添加动态路由到路由表  铺路
        // 添加完动态路由之后
        // 跳转到 要去的路径 这是一个bug , 如果使用了addRoutes之后, 必须使用next(to.path)来跳转到要去的路径, 不能使用next()
        next(to.path);
        return;
      } else {
        next();
      }
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
