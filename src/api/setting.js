import request from "@/utils/request";
/**
 * 获取角色列表数据信息
 */
export function getRoleList(params) {
  return request({
    url: "/sys/role",
    params,
  });
}
/**
 * 根据id查询企业信息
 */
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`,
  });
}
/**
 * 删除角色接口
 */
export function deleteRole(id) {
  return request({
    method: "DELETE",
    url: `/sys/role/${id}`,
  });
}
// 通过id更新角色
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: "put",
  });
}
/**
 * 获取角色详情
 * **/
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`,
  });
}
/**
 * 新增角色
 */
export function addRole(data) {
  return request({
    url: "/sys/role",
    method: "POST",
    data,
  });
}
