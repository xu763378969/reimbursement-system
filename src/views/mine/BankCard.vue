<template>
  <div class="bankCard">
    <!-- <van-icon slot="rightIcon" name="plus"/> -->

    <div class="content">
      <div class="cards">
        <div
          class="item"
          :class="item.selected === 1 ? 'active' : ''"
          v-for="item in bankData"
          :key="item.id"
          @click="handleClick(item)"
        >
          <div class="l">
            <div class="img">
              <svg-icon class="icon" icon-class="Unionpay pay"></svg-icon>
            </div>
          </div>
          <div class="r">
            <div class="bankName">{{ item.bankName }}</div>
            <div class="bankNo">{{ item.bankNo }}</div>
          </div>
          <div class="default" v-if="item.selected === 1">默认卡片</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <van-button type="info" class="sub" @click="onClickRight"
        >添加银行卡</van-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getBankCardInfo, bankCardSwitch } from "@/api/user";

@Component({
  name: "BankCard"
})
export default class BankCard extends Vue {
  private bankData: object[] = [];

  mounted() {
    getBankCardInfo().then(res => {
      console.log(res);
      this.bankData = res.data;
    });
  }

  onClickRight() {
    console.log("onClickRight");
    this.$router.push({
      name: "AddBankCard"
    });
  }

  handleClick({ bankNo, selected }: any): void {
    if (selected === 1) return;
    console.log(bankNo);
    this.$dialog
      .confirm({
        title: "提示",
        message: "是否切换该卡片为默认银行卡？"
      })
      .then(() => {
        bankCardSwitch({ bankNo }).then((res: any) => {
          // console.log(res)
          if (res.code === 200) {
            this.$toast("操作成功");
            this.$router.push({
              name: "Mine"
            });
          }
        });
      })
      .catch(() => {
        // on cancel
      });
  }
}
</script>

<style lang="scss" scoped>
.bankCard {
  // height: 100%;
  .content {
    .cards {
      box-sizing: border-box;
      padding: 0 12px;
      .item {
        @include linear-gradient(right, #7c97e0, #5a7dd1, #4264c3);
        height: 80px;
        border-radius: 5px;
        display: flex;
        margin: 10px 0;
        .l {
          width: 72px;
          display: flex;
          justify-content: center;
          align-items: center;
          .img {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #ffffff;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            font-size: 38px;
          }
        }
        .r {
          align-self: center;
          flex: 1;
          font-size: 16px;
          color: #ffffff;

          .bankName {
            font-weight: 400;
          }
          .bankNo {
            font-size: 14px;
            margin-top: 6px;
            font-weight: 400;
          }
        }
        .default {
          color: #ffffff;
          margin: 10px 10px 0 0;
        }
        &.active {
          @include linear-gradient(right, #f5b98e, #f59753, #f7781f);
        }
      }
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  box-shadow: 0px -4px 8px rgba(66, 66, 66, 0.1);
  // box-sizing: border-box;
  // padding: 10px 10px 20px;
  background-color: #fff;
  display: flex;
  width: 100%;
  .save {
    width: 33%;
  }
  .sub {
    flex: 1;
  }
}
</style>
