import { removeToken, setToken, getToken } from "@/utils/auth";
import { login } from "@/api/user";
const state = {
  token: getToken(), //设置token为共享状态,初始化vuex的时候 就先从缓存中读取
};
const mutations = {
  setToken(state, token) {
    state.token = token; // 将数据设置给vuex
    setToken(token); // 将数据同步给缓存
  },
  removeToken(state) {
    state.token = null; //将vuex里面的数据清空
    removeToken(); //同步到缓存
  },
};
const actions = {
  async login(context, data) {
    // 调用api里面的login接口
    const result = await login(data); //拿到token
    console.log(result);
    // 这个时候把用户的token储存起来
    // if (result.data.success) {
    //   context.commit("setToken", result.data.data); //设置token
    // }
    if (result) {
      context.commit("setToken", result);
    }
  },
  // login(context, data) {
  //   return new Promise(function (resolve) {
  //     login(data).then((result) => {
  //       console.log(result);
  //       if (result.data.success) {
  //         context.commit("setToken", result.data.data); // 提交mutations设置token
  //         resolve(); // 表示执行成功了
  //       }
  //     });
  //   });
  // },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
