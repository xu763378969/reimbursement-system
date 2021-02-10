import request from "@/utils/request.ts";

// （备注）消费记录列表
export function getBillList(params: any) {
  return request({
    url: "/mobile/enterprise/bill/billList",
    method: "get",
    params
  });
}
// （备注）消费记录详情
export function getBillInfo(params: any) {
  return request({
    url: "/mobile/enterprise/bill/getInfo",
    method: "get",
    params
  });
}
// 图片
export function billSaveFile(data: any) {
  return request({
    url: "/mobile/enterprise/bill/saveFile",
    method: "post",
    data
  });
}
// 保存
export function billSaveInfo(data: any) {
  return request({
    url: "/mobile/enterprise/bill/saveInfo",
    method: "post",
    data
  });
}

// 二维码发票导入
export function qrCodeInvoiceImport(data: any) {
  return request({
    url: "/mobile/enterprise/bill/qrCodeInvoiceImport`",
    method: "post",
    data
  });
}
