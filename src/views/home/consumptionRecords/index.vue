<template>
  <div class="container">
    <!-- <NavBar title="消费记录" isleftarrow rightText="" @onClickLeft="onClickLeft" @onClickRight="onClickRight">
      <van-popover v-model="showPopover" slot="rightIcon" placement="bottom-end" theme="dark" trigger="click">
        <div class="popoverContent">
          <div class="item" v-for="(item, index) in actions" :key="index" @click="handlePoPoverClick(item)">
            <SvgIcon :iconClass="item.icon" class="icon"></SvgIcon>
            <span>{{ item.text }}</span>
          </div>
        </div>
        <template #reference>
          <van-icon name="plus" />
        </template>
      </van-popover>
    </NavBar> -->
    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      style="height: 100vh;width:100vw"
      @refresh="onRefresh"
    >
      <div class="header">
        <!-- <div class="search" @click="goSearch">
          <div class="box">
            <SvgIcon iconClass="screen" class="icon"></SvgIcon>
            <span>搜索标题、单据号</span>
          </div>
        </div> -->
        <van-dropdown-menu>
          <van-dropdown-item
            @change="handleSelectChange"
            v-model="status"
            :options="statusList"
          />
        </van-dropdown-menu>
        <!-- <div>aa</div> -->
        <div class="content">
          <div
            class="item"
            v-for="item in dataResult"
            :key="item.id"
            @click="goDetial(item)"
          >
            <div class="item-t">
              <div class="label-info">
                <!-- <i class="img" :class="item.icon"></i> -->
                <svg-icon icon-class="ticket" class="icon"></svg-icon>
                <div class="info-box">
                  <div class="tltle">
                    {{ item.typeName }}
                  </div>
                  <div class="date">
                    {{ item.createTime | formatDate("yyyy-MM-dd") }}
                  </div>
                  <div class="note">开票单位：{{ item.companyName }}</div>
                </div>
              </div>
            </div>
            <div class="flag" :style="{ color: item.color }">
              {{ item.statusName }}
            </div>
            <div class="price">
              CNY
              <span class="active">{{ item.totalMoney | NumFormat() }}</span>
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script lang="ts">
const wx = require("weixin-js-sdk");

import { Component, Vue } from "vue-property-decorator";
import { getDicts } from "@/api/common";
import { getBillList } from "@/api/consumptionRecords";

@Component({
  name: "ConsumptionRecords"
})
export default class ConsumptionRecords extends Vue {
  private statusArr: object[] = []; // （0待处理 1待提交 2已提交 3审核中 4已完成）
  private isLoading: boolean = false;
  private showPopover: boolean = false;
  private status: any = null;
  private statusList: object[] = [];
  private actions: object[] = [
    { id: 1, text: "发票扫描识别", name: "QrScanner", icon: "scan" },
    { id: 2, text: "OCR 拍照识别", name: "camera", icon: "camera" }
    // { id: 3, text: '微信卡包导入', icon: 'WeChat-card-bag' },
    // { id: 4, text: '支付宝卡包导入', icon: 'alipay-card-bag' }
  ];
  private dataResult: object[] = [];

  mounted() {
    this.getBillList();
    getDicts("sys_bill_status").then((res: any) => {
      console.log("sys_bill_status", res);
      this.statusArr = res.data;
      res.data.forEach(({ dictSort, dictLabel }: any) => {
        this.statusList.push({ text: dictLabel, value: dictSort });
      });
      this.statusList.unshift({ text: "全部", value: null });
    });
  }
  getBillList() {
    const params = { status: this.status };

    getBillList(params).then((res: any) => {
      // console.log(JSON.stringify(res.data))
      res.data.map((item: any) => {
        // item.icon = item.BillListType === '0' ? 'icon_travel' : 'icon_entertain'
        item.color =
          item.status === "0"
            ? "#F9771D"
            : item.status === "1"
            ? "#4E6EF2"
            : "#25B84C";
      });
      this.dataResult = res.data;
      // console.log(res.data.length);
    });
  }
  handleSelectChange(status: any) {
    console.log(status);
    this.status = status;
    this.getBillList();
  }
  // tab check
  handleTabClick(name: any, title: any) {
    console.log(name, title);
  }
  // go item detial
  goDetial({ id, isDel }: any) {
    console.log(id, isDel);
    this.$router.push({
      name: "InvoiceDetails",
      query: {
        id,
        isDel
      }
    });
  }
  resultDataFormat(res: any) {}
  handlePoPoverClick({ name }: any) {
    console.log(name);
    if (name === "QrScanner") {
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: (res: any) => {
          console.log("resultStr", res.resultStr);

          if (res.data !== "") {
            this.$router.push({
              name: "InvoiceDetails",
              query: {
                type: "add",
                invoiceStr: res.resultStr
              }
            });
          } else {
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
        }
      });
      return;
    }
    if (name === "camera") {
      console.log("camera");
      this.chooseImage();
      return;
    }
  }
  chooseImage() {
    wx.checkJsApi({
      jsApiList: ["chooseImage", "getLocalImgData"],
      success: (res: any) => {
        if (res.checkResult.chooseImage) {
          wx.chooseImage({
            count: 1,
            sizeType: ["compressed"],
            sourceType: ["album", "camera"],
            success: (req: any) => {
              wx.getLocalImgData({
                localId: req.localIds[0].toString(),
                success: (res: any) => {
                  this.$router.push({
                    name: "InvoiceDetails",
                    query: {
                      type: "add",
                      invoiceStr: res.resultStr,
                      localData: res.localData
                    }
                  });
                }
              });
            },
            fail: () => {
              this.$toast("选择失败！");
            }
          });
        } else {
          this.$toast("暂不支持拍照！");
        }
      },
      fail: function() {
        this.$toast("暂不支持拍照！");
      }
    });
    this.showPopover = false;
  }
  goSearch() {
    this.$router.push({
      name: "Search"
    });
  }
  onClickRight() {
    console.log("onClickRight");
    // this.$router.go(-1)
    // this.showPopover = true
  }
  onRefresh() {
    setTimeout(() => {
      console.log("refresh");
      this.getBillList();
      this.isLoading = false;
    }, 1000);
  }
}
</script>

<style lang="scss" scoped>
.container {
  // border: none !important;
  // padding-top: 44px;
  background-color: #f0f0f0;
  height: 100%;

  .header {
    .search {
      line-height: 40px;
      margin: 8px 0;
      box-sizing: border-box;
      padding: 0 12px;
      .box {
        background-color: #fff;
        // box-sizing: border-box;
        // padding: 12px;
        color: #808080;
        span {
          font-size: 10px;
        }
        .icon {
          margin: 0 12px;
        }
      }
    }
    .content {
      // overflow: hidden;
      .item {
        box-sizing: border-box;
        padding: 12px;
        // height: 100px;
        background-color: #fff;
        position: relative;
        margin: 6px 0;
        .item-t {
          .label-info {
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
            .tltle {
              font-size: 12px;
              color: #333333;
            }
            .icon {
              font-size: 16px;
            }
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
            .info-box {
              margin-left: 5px;
            }
            .date {
              font-size: 11px;
              color: #595959;
            }
          }
          .note {
            color: #a6a6a6;
            font-size: 11px;
          }
        }
        .item-b {
        }
        .flag {
          position: absolute;
          top: 10px;
          right: 10px;
        }
        .price {
          position: absolute;
          bottom: 5px;
          right: 10px;
          color: #4e6ef2;
          font-weight: 800;
          .active {
            font-size: 18px;
          }
        }
      }
    }
  }

  ::v-deep {
    .van-tabs__line {
      background-color: #ffffff;
    }
    .van-hairline--top-bottom::after,
    .van-hairline-unset--top-bottom::after {
      border: none;
    }
    .van-pull-refresh {
      overflow-y: auto;
    }
  }
}
.popoverContent {
  .item {
    height: 18px;
    line-height: 18px;
    // box-sizing: border-box;
    padding: 12px;
    .icon {
      margin-right: 6px;
    }
  }
}
</style>
