import request from "@/utils/request";
/**
 * 获取员工的简单列表
 */
export function getEmployeeSimple() {
  return request({
    url: "/sys/user/simple",
  });
}
/**
 * 获取员工的综合列表数据
 */
export function getEmployeeList(params) {
  return request({
    url: "/sys/user",
    params,
  });
}
/**
 * 删除员工接口
 * ****/

export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: "delete",
  });
}
/**
 * 新增员工的接口
 */
export function addEmployee(data) {
  return request({
    url: "/sys/user",
    method: "POST",
    data,
  });
}
/**
 * 批量导入员工接口
 */
export function importEmployee(data) {
  return request({
    url: "/sys/user/batch",
    method: "POST",
    data,
  });
}
/**
 * 保存员工的基本信息
 */
export function saveUserDetailById(data) {
  return request({
    method: "PUT",
    url: `/sys/user/${data.id}`,
    data,
  });
}
/**
 * 获取用户的详细信息
 */
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`,
  });
}
/**
 * 更新用户的详细信息
 */
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: "put",
    data,
  });
}
/**
 * 获取用户的岗位信息
 */
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`,
  });
}
/**
 * 保存岗位信息
 */
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: "put",
    data,
  });
}
