import { removeToken, setToken, getToken } from "@/utils/auth";
import { login } from "@/api/user";
const state = {
  token: getToken, //设置token为共享状态,初始化vuex的时候 就先从缓存中读取
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
    // 这个时候把用户的token储存起来
    context.commit("setToken", result); //设置token
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
