import request from "@/utils/request.ts";

export function login(data: object) {
  return request({
    url: "/users/login",
    method: "post",
    data
  });
}

export function getInfo() {
  return request({
    url: "/users/info",
    method: "post"
  });
}

export const logout = () =>
  request({
    url: "/users/logout",
    method: "post"
  });

// 用户信息  方法
export function getLhtEmployeeList(params: object) {
  return request({
    url: "/mobile/enterprise/common/getLhtEmployeeList",
    method: "get",
    params
  });
}

// 用户信息  方法
export function getUserInfo() {
  return request({
    url: "/mobile/enterprise/wechat/getEmployeeInfo",
    method: "get"
  });
}

// 更新个人信息
export function modifyPersonalInfo(data: object) {
  return request({
    url: "/mobile/enterprise/wechat/modifyPersonalInfo",
    method: "put",
    data
  });
}
// 银行卡
export function getBankCardInfo() {
  return request({
    url: "/mobile/enterprise/wechat/getBankCardInfo",
    method: "get"
  });
}
// 银行卡切换
export function bankCardSwitch(data: object) {
  return request({
    url: "/mobile/enterprise/wechat/bankCardSwitch",
    method: "put",
    data
  });
}

// 添加银行卡
export function addBankCard(data: object) {
  return request({
    url: "/mobile/enterprise/wechat/addBankCard",
    method: "post",
    data
  });
}
