import { removeToken, setToken, getToken, setTimeStamp } from "@/utils/auth";
import { login, getUserInfo, getUserDetailById } from "@/api/user";
import { resetRouter } from "@/router";
const state = {
  token: getToken(), //设置token为共享状态,初始化vuex的时候 就先从缓存中读取
  userInfo: {}, //定义一个空对象
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
  setUserInfo(state, result) {
    //更新一个对象
    state.userInfo = result; //这样是响应式
  },
  removeUserInfo(state) {
    state.userInfo = {}; //删除用户信息
  },
};
const actions = {
  // 登录接口
  async login(context, data) {
    // 调用api里面的login接口
    const result = await login(data); //拿到token
    // 这个时候把用户的token储存起来
    context.commit("setToken", result);
    // 设置登录成功时候的时间戳用来判定token是否过期
    setTimeStamp();
  },
  // 封装获取用户资料
  async getUserInfo(context) {
    const result = await getUserInfo(); //获取返回值
    context.commit("setUserInfo", result); //将用户的全部个人资料放在Vuex里面 提交到mutations
    const baseInfo = await getUserDetailById(result.userId); //获取用户的基本信息,里面有头像
    const baseResult = { ...result, ...baseInfo }; //将有头像的和没头像的合并到一起;
    context.commit("setUserInfo", baseResult);
    return result; // 后期做权限留下的伏笔
  },
  // 用户登出的操作
  logout(context) {
    // 删除taken
    context.commit("removeToken");
    // 删除用户资料
    context.commit("removeUserInfo");
    // 重置路由
    resetRouter();
    context.commit("permission/setRoutes", [], { root: true });
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
