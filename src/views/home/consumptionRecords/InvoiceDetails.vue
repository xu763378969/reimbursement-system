<template>
  <div class="invoiceDetails">
    <div v-if="type === '0'">
      <van-cell-group class="group">
        <van-cell title="购买方" :value="billData.purchaserName" />
        <van-cell title="纳税人识别号" :value="billData.purchaserRegisterNum" />
        <van-cell title="购方地址电话" :value="billData.purchaserAddress" />
        <van-cell title="购方开户行账号" :value="billData.purchaserBank" />
      </van-cell-group>
      <van-cell-group class="group">
        <van-cell title="销售方" :value="billData.sellerName" />
        <van-cell title="发票代码" :value="billData.invoiceCode" />
        <van-cell title="发票号码" :value="billData.invoiceNum" />
        <van-cell title="开票时间" :value="billData.invoiceDate" />
        <van-cell title="价税合计" :value="billData.amountInFiguers" />
        <van-cell title="税额" :value="billData.totalTax" />
        <van-cell title="备注" :value="billData.remarks" />
      </van-cell-group>
    </div>
    <div v-else>
      <van-cell-group class="group">
        <van-cell title="姓名" :value="billData.name" />
        <van-cell
          title="发车时间"
          :value="billData.date | formatDate('yyyy-MM-dd')"
        />
        <van-cell title="始发站" :value="billData.startingStation" />
        <van-cell title="目的站" :value="billData.destinationStation" />
        <van-cell title="席位" :value="billData.seatCategory" />
        <van-cell title="金额" :value="billData.ticketRates" />
      </van-cell-group>
    </div>

    <div class="remark">
      <van-cell title="备注" />
      <van-field
        v-model="remark"
        :readonly="isSearch"
        rows="3"
        autosize
        type="textarea"
        :placeholder="!isSearch ? '请填写' : ''"
      />
    </div>
    <div class="upload">
      <BaseUpload
        :maxCount="!isSearch ? bxFileList.length : 2"
        :deletable="!isSearch ? false : true"
        :fileData="imageList"
        :uploadUrl="getUrl()"
        @afterRead="afterRead"
        @handleDelete="handleDelete"
      ></BaseUpload>
    </div>
    <div class="btn" v-if="isSearch">
      <van-button round block type="info" @click="sub">确认</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import {
  getBillInfo,
  billSaveFile,
  billSaveInfo,
  qrCodeInvoiceImport
} from "@/api/consumptionRecords";
import { getInvoiceInfo } from "@/api/common";

import BaseUpload from "@/components/BaseUpload.vue";

@Component({
  name: "InvoiceDetails",
  components: {
    [BaseUpload.name]: BaseUpload
  }
})
export default class InvoiceDetails extends Vue {
  private id: string = "";
  private billData: object[] = [];
  private remark: string = "";
  private type: string = "";
  private isSearch: boolean = false;
  private bxFileList: object[] = [];
  private imageList: object[] = []; // 回显图片
  private fileList: object[] = [];

  public mounted(): void {
    const { id, isDel, invoiceStr, type, localData: data } = this.$route.query;
    console.log("detial", invoiceStr);

    if (type === "add") {
      if (data) {
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        let localData: any = data;
        if (isiOS) {
          // 是ios直接使用
          localData = localData.replace("data:image/jgp", "data:image/jpeg");
          // console.log('localData', localData)
        } else {
          localData = localData
            .replace(/\r|\n/g, "")
            .replace("data:image/jgp", "data:image/jpeg");
          // 第一个替换的是换行符，第二个替换的是图片类型，因为在IOS机上测试时看到它的图片类型时jgp，
          localData = "data:image/jpg;base64," + localData;
          // console.log('图片', localData.substring(0, 30))
        }
        this.uploadImage(localData);
        return;
      }
      qrCodeInvoiceImport({ invoiceStr }).then(res =>
        this.resultDataFormat(res)
      );
    } else {
      this.isSearch = true;
      getBillInfo({ id, isDel }).then(res => this.resultDataFormat(res));
    }
  }

  // 格式化data
  resultDataFormat(res: any) {
    if (res.code !== 200) {
      this.$dialog
        .alert({
          title: "提示",
          message: res.msg
        })
        .then(() => {
          this.$router.replace({
            name: "ConsumptionRecords"
          });
        });
    }
    this.billData =
      res.data.type === "0" ? res.data.bxBillVat : res.data.bxBillTrain;
    this.id = res.data.id;
    this.type = res.data.type;
  }
  async uploadImage(imageData: any) {
    console.log("1111111", imageData);
    getInvoiceInfo({
      fileUrl: imageData
    }).then(res => this.resultDataFormat(res));
  }
  sub() {
    this.uploadFile(this.fileList).then(() => {
      console.log(this.bxFileList);
    });
  }
  // 获取上传图片地址
  getUrl() {
    return "/prod-api/api-oss/lh-oss/uploadImg";
  }

  // 上传图片
  uploadFile(fileArr: any) {
    let count = 0;
    return new Promise(reslove => {
      fileArr.reduce(async (prev: any, next: any) => {
        await prev;

        return prev.then(async () => {
          const config = {
            headers: { "Content-Type": "multipart/form-data" }
          };
          const formData = new FormData(); // 构造一个 FormData，把后台需要发送的参数添加
          formData.append("file", next.file); // 接口需要传的参数

          try {
            const result = await axios.post(this.getUrl(), formData, config);
            console.log("uploadImage ", result);
            // debugger
            if (result.data.ok) {
              count++;
              this.bxFileList.push({
                id: this.id,
                type: this.type,
                filePath: result.data.url,
                fileName: next.file.name
              });
              if (count === fileArr.length) reslove(true);
            } else {
              this.$toast(result.data.msg);
            }
          } catch (e) {
            console.log("errFile: ", e);
          }
        });
      }, Promise.resolve());
    });
  }

  // 上传成功 callback
  afterRead(data: any) {
    console.log("afterRead", data);
    this.fileList = data;
  }
  // 用户删除图片
  handleDelete(index: number) {
    this.bxFileList.splice(index, 1);
  }
}
</script>

<style lang="scss" scoped>
.invoiceDetails {
  box-sizing: border-box;
  padding-bottom: 70px;
}
.group {
  margin-top: 6px;
  &.active {
    padding-bottom: 40px;
    .custom-title {
      margin-bottom: 8px;
    }
  }
}
.remark {
  margin-top: 10px;
}
.btn {
  position: fixed;
  bottom: 0;
  box-shadow: 0px -4px 8px rgba(66, 66, 66, 0.1);

  width: 100%;
  box-sizing: border-box;
  padding: 10px 10px 20px;
  background-color: #fff;
}
.upload {
  padding-left: 10px;
  background-color: #fff;
}
</style>
