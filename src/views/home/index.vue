<template>
  <div class="container">
    <div class="header">
      <div class="grid">
        <div
          class="grid-item"
          v-for="(item, index) in gridItemLabel"
          :key="index"
          @click="handleclickItem(item)"
        >
          <div class="img" :class="item.icon"></div>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="label">
        <div class="icon_add"></div>
        <span>新建申请</span>
      </div>
      <div class="grid">
        <van-grid :column-num="3">
          <van-grid-item
            v-for="(item, index) in applicationLabel"
            :key="index"
            @click="handleclickItem(item)"
          >
            <div class="img" :class="item.icon"></div>
            <div class="itemName">{{ item.label }}</div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script lang="ts">
const wx = require("weixin-js-sdk");
import { getJsApiConfig } from "@/api/common";

import { Component, Prop, Vue } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";

@Component({
  name: "Home"
})
export default class extends Vue {
  private gridItemLabel: object[] = [
    { label: "申请表单", name: "ApplyList", icon: "icon_todo" },
    { label: "消费记录", name: "ConsumptionRecords", icon: "icon_consumption" },
    { label: "扫一扫", name: "QrScanner", icon: "icon_scan" },
    { label: "票据识别", name: "camera", icon: "icon_camera" }
  ];
  private applicationLabel: object[] = [
    { label: "差旅申请", type: "0", name: "Travel", icon: "icon_travel" },
    { label: "招待申请", type: "1", name: "Entertain", icon: "icon_entertain" },
    { label: "报销申请", type: "2", name: "Expense", icon: "icon_expense" }
  ];

  mounted() {
    const param = {
      url: location.href.split("#")[0]
    };
    getJsApiConfig(param).then((res: any) => {
      console.log(res);
    });
  }

  public handleclickItem(item: any): void {
    console.log(item);
    let { name, type, label } = item;
    if (name === "QrScanner") {
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: (res: any) => {
          console.log("resultStr", res.resultStr);
          this.$router.push({
            name: "InvoiceDetails",
            query: {
              type: "add",
              invoiceStr: res.resultStr
            }
          });
        }
      });
      return;
    }
    // debugger

    if (name === "camera") {
      console.log("camera");
      // this.chooseImage()
      return;
    }
    this.$router.push({
      name,
      query: {
        type,
        label
      }
    });
  }

  get loading() {
    return this.$store.state["@@loading"].effects.onePlusAsync;
  }

  private async logout() {
    await UserModule.LogOut();
    this.$router.push(`/login?redirect=${this.$route.fullPath}`);
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  .header {
    color: #ffffff;
    border-top: 1px solid #7991f2;
    background-color: $themeColor;
    .grid {
      // border-top: 1px solid #5493ebff;
      height: 88px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      font-size: 12px;
    }
    .grid-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span {
        margin-top: 8px;
      }
    }
  }
  .content {
    background-color: #ffffff;
    // height: 180px;
    box-sizing: border-box;
    margin-top: 6px;
    .label {
      @include line-height(30px);
      font-size: 10px;
      color: #808080;
      font-weight: 400;
      box-sizing: border-box;
      padding-left: 20px;
      display: flex;
      align-items: center;
    }
    .itemName {
      margin-top: 5px;
      color: #333333;
      font-size: 12px;
    }
  }
  .grid {
    height: 88px;
  }

  .img {
    width: 21px;
    height: 20px;
    background-size: 21px 20px;
    background-repeat: no-repeat;
  }
  // .footer {
  //   flex: 1;
  //   background-color: #fff;
  // }
  .icon_travel {
    @include bg-image("~@/assets/images/home/icon_travel");
  }
  .icon_entertain {
    @include bg-image("~@/assets/images/home/icon_entertain");
  }
  .icon_expense {
    @include bg-image("~@/assets/images/home/icon_expense");
  }
  .icon_consumption {
    @include bg-image("~@/assets/images/home/icon_consumption");
  }
  .icon_scan {
    @include bg-image("~@/assets/images/home/icon_scan");
  }
  .icon_camera {
    @include bg-image("~@/assets/images/home/icon_camera");
  }
  .icon_todo {
    @include bg-image("~@/assets/images/home/icon_todo");
  }
  .icon_add {
    width: 8px;
    height: 11px;
    background-size: 8px 11px;
    margin-right: 4px;
    @include bg-image("~@/assets/images/home/icon_add");
  }
  // .header {
  //   color: #ffffff;
  //   border-top: 1px solid #7991f2;
  //   background-color: $themeColor;

  //   .grid {
  //     // border-top: 1px solid #5493ebff;
  //     height: 88px;
  //     display: flex;
  //     justify-content: space-evenly;
  //     align-items: center;
  //     font-size: 14px;
  //   }
  //   .grid-item {
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: center;
  //     align-items: center;
  //     span {
  //       margin-top: 8px;
  //     }
  //   }
  // }
  .content {
    // height: 100%;
    background-color: #ffffff;
    height: calc(100% - 106px);
    display: flex;
    flex-direction: column;
    margin-top: 5px;
    .label {
      @include line-height(30px);
      font-size: 14px;
      color: #808080ff;
      box-sizing: border-box;
      padding-left: 20px;
      .icon {
        margin-right: 8px;
      }
    }
  }
}

// .now-value {
//   padding: 0 15px;
//   box-sizing: border-box;
//   font-size: 16px;
//   // line-height: 30px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// }
// .buttons {
//   padding: 0 15px;
//   font-size: 18px;
//   width: 100%;
//   box-sizing: border-box;
//   display: flex;
//   justify-content: space-around;
//   align-items: center;
//   a {
//     color: #333;
//   }
// }
</style>
