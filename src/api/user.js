import request from "@/utils/request";
/**
 * 登录接口
 */
export function login(data) {
  return request({
    url: "/sys/login",
    method: "post",
    data,
  });
}
/**
 * 获取用户资料的布局
 */
export function getUserInfo() {
  return request({
    url: "/sys/profile",
    method: "POST",
  });
}
/**
 * 获取员工的基本信息,其实只是为了获取头像
 */
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`,
  });
}
export function logout() {}
