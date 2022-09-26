import request from "@/utils/request";
/**
 * 获取组织架构数据
 */
export function getDepartments() {
  return request({
    url: "/company/department",
    // get是默认 可写可不写
    method: "GET",
  });
}
/**
 * 删除部门,根据id删除, 接口是根据restful的规则设计的   删除 delete  新增 post  修改put 获取 get
 */
export function delDepartments(id) {
  return request({
    method: "DELETE",
    url: `/company/department/${id}`,
  });
}
/**
 * 添加部门
 */
export function addDepartments(data) {
  return request({
    method: "POST",
    url: "/company/department",
    data,
  });
}
/**
 * 获取部门信息
 */
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`,
  });
}
/**
 * 编辑部门信息
 */
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: "PUT",
  });
}
