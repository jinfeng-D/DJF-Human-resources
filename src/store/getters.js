const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token, //建立token的快捷访问
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.userInfo.username, //建立对于用户名的快捷访问
  userId: (state) => state.user.userInfo.userId,
  staffPhoto: (state) => state.user.userInfo.staffPhoto,
  companyId: (state) => state.user.userInfo.companyId, //获取登录用户的id
  routes: (state) => state.permission.routes,
};
export default getters;
