import request from "@/utils/request.ts";

// 事前申请单列表
export function getApplyList(params: any) {
  return request({
    url: "/mobile/enterprise/apply/applyList",
    method: "get",
    params
  });
}
// 事前申请单详情
export function getInfo(params: any) {
  return request({
    url: "/mobile/enterprise/apply/getInfo",
    method: "get",
    params
  });
}
//事前申请单新增（备注）
export function AddApply(data: any) {
  return request({
    url: "/mobile/enterprise/apply/add",
    method: "post",
    data
  });
}

// 出差交通明细保存（单个保存）
export function saveInfo(data: any) {
  return request({
    url: "/mobile/enterprise/apply/saveInfo",
    method: "post",
    data
  });
}
// 出差、招待住宿明细保存（单个保存）
export function saveInfoStay(data: any) {
  return request({
    url: "/mobile/enterprise/apply/saveInfoStay",
    method: "post",
    data
  });
}
// 派餐明细保存（单个保存）
export function saveInfoMeal(data: any) {
  return request({
    url: "/mobile/enterprise/apply/saveInfoMeal",
    method: "post",
    data
  });
}
// 事前申请单出差子表保存
export function saveTravel(data: any) {
  return request({
    url: "/mobile/enterprise/apply/saveTravel",
    method: "post",
    data
  });
}
// 更新事前申请单状态
export function updateStatusById(data: any) {
  return request({
    url: "/mobile/enterprise/apply/updateStatusById",
    method: "post",
    data
  });
}
// 获取费用标准
export function getCostStandard(params: any) {
  return request({
    url: "/mobile/enterprise/apply/getCostStandard",
    method: "get",
    params
  });
}
// 保存验证预算总额是否超标
export function isQuota(params: any) {
  return request({
    url: "/mobile/enterprise/apply/isQuota",
    method: "get",
    params
  });
}
// 派餐详情
export function getMealInfo(params: any) {
  return request({
    url: "/mobile/enterprise/apply/getMealInfo",
    method: "get",
    params
  });
}
//  交通详情
export function getTripInfo(params: any) {
  return request({
    url: "/mobile/enterprise/apply/getTripInfo",
    method: "get",
    params
  });
}
//  市内交通或补助详情
export function getCostInfo(params: any) {
  return request({
    url: "/mobile/enterprise/apply/getCostInfo",
    method: "get",
    params
  });
}
//  住宿详情
export function getStayInfo(params: any) {
  return request({
    url: "/mobile/enterprise/apply/getStayInfo",
    method: "get",
    params
  });
}
