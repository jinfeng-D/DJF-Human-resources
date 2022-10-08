// vuex的权限管理
import { constantRoutes, asyncRoutes } from "@/router";
// vuex中的permission模块用来存放当前的静态路由 和 当前用户的权限路由
const state = {
  // 所有人默认拥有静态路由（所以默认路由就是静态路由）
  routes: constantRoutes,
};
const mutations = {
  // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部
  setRoutes(state, newRouter) {
    // 应该是每次更新 都应该在静态路由的基础上进行追加
    state.routes = [...constantRoutes, ...newRouter];
  },
};
const actions = {
  filterRoutes(context, menus) {
    const routes = [];
    //   筛选出 动态路由中和menus中能够对上的路由
    menus.forEach((key) => {
      // key就是标识
      // asyncRoutes 找 有没有对象中的name属性等于 key的 如果找不到就没权限 如果找到了 要筛选出来
      routes.push(...asyncRoutes.filter((item) => item.name === key)); // 得到一个数组 有可能 有元素 也有可能是空数组
    });
    // 得到的routes是所有模块中满足权限要求的路由数组
    // routes就是当前用户所拥有的 动态路由的权限
    context.commit("setRoutes", routes); // 将动态路由提交给mutations
    return routes; // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  },
  // filterRoutes(context, menus) {
  //   const routes = [];
  //   // asyncRoutes 找 有没有对象中的name属性等于 key的 如果找不到就没权限 如果找到了 要筛选出来
  //   // 得到一个数组 有可能 有元素 也有可能是空数组

  //   const currentRoutes = asyncRoutes.filter((item) => {
  //     // console.log(item.name, "name");
  //     return menus.includes(item.name);
  //   });

  //   // 得到的routes是所有模块中满足权限要求的路由数组
  //   // routes就是当前用户所拥有的 动态路由的权限
  //   context.commit("setRoutes", currentRoutes); // 将动态路由提交给mutations
  //   return routes; // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  // },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
