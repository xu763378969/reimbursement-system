import request from "@/utils/request.ts";

// 根据字典类型查询字典数据信息
export function getDicts(dictType: any) {
  return request({
    url: "/system/dict/data/type/" + dictType,
    method: "get"
  });
}

// 获取JsApiConfig
export function getJsApiConfig(params: any) {
  return request({
    url: `/mobile/enterprise/wechat/getJsApiConfig`,
    method: "get",
    params
  });
}

// 获取网页授权url
export function getOauthUrl() {
  return request({
    url: "/mobile/enterprise/auth/getOauthUrl",
    method: "get"
  });
}
// 授权code获取企业微信用户信息
export function codeToUserInfo(params: any) {
  return request({
    url: "/mobile/enterprise/auth/codeToUserInfo",
    method: "get",
    params
  });
}
// 获取地区数据
export function getAreaData() {
  return request({
    url: "/mobile/enterprise/common/getAreaData",
    method: "get"
  });
}

// 获取部门树
export function getDeptTree() {
  return request({
    url: "/mobile/enterprise/common/getDeptTree",
    method: "get"
  });
}
// 获取岗位列表
export function getPostList() {
  return request({
    url: "/mobile/enterprise/common/getPostList",
    method: "get"
  });
}
// 员工信息录入
export function employeeRegister(data: object) {
  return request({
    url: "/mobile/enterprise/auth/employeeRegister",
    method: "post",
    data
  });
}
// 获取申请或陪同人员列表
export function getApplyPersonList(params: any) {
  return request({
    url: "/mobile/enterprise/common/getApplyPersonList",
    method: "get",
    params
  });
}
// OCR拍照识别
export function getInvoiceInfo(data: any) {
  return request({
    url: "/mobile/enterprise/bill/getInvoiceInfo",
    method: "post",
    data
  });
}

// 获取审批模板
export function getApprovalTemplate() {
  return request({
    url: "/mobile/enterprise/wechat/getApprovalTemplate",
    method: "get"
  });
}
// 获取审批信息
export function getApprovalInfo(params: any) {
  return request({
    url: "/mobile/enterprise/apply/getApprovalInfo",
    method: "get",
    params
  });
}
