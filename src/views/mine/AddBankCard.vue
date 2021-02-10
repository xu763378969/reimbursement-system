<template>
  <div class="bindBankCard">
    <div class="title">请绑定持卡人本人的银行卡</div>
    <div class="content">
      <van-cell-group>
        <van-field label="银行名称:" v-model="bankName" :label-width="60" />
        <van-field label="持卡人:" v-model="cardHolder" :label-width="60" />
        <van-field
          label="卡号:"
          v-model="bankNo"
          type="number"
          :label-width="60"
          @click-right-icon="handleIconClick"
        >
          <template #right-icon>
            <svg-icon icon-class="camera-bg"></svg-icon>
          </template>
        </van-field>
      </van-cell-group>
    </div>

    <div class="btn">
      <van-button
        type="info"
        block
        :disabled="disabled"
        @click="handleBindClick"
        >绑定</van-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { addBankCard } from "@/api/user";

@Component({
  name: "AddBankCard"
})
export default class AddBankCard extends Vue {
  private bankName: string = "";
  private bankNo: string = "";
  private cardHolder: string = "";
  private phoneNumber: string = "";

  get disabled() {
    const { bankName, bankNo, cardHolder } = this;
    const params = {
      bankName,
      bankNo,
      cardHolder
    };
    console.log(Object.values(params).every(i => i !== ""));

    return !Object.values(params).every(i => i !== "");
  }
  handleIconClick() {
    console.log("handleIconClick");
  }

  handleBindClick() {
    const { bankName, bankNo, cardHolder, phoneNumber } = this;
    const params = {
      bankName,
      bankNo,
      cardHolder,
      phoneNumber
    };
    console.log(params);
    addBankCard(params).then((res: any) => {
      console.log(res);
      if (res.code === 200) {
        this.$toast("绑定成功");
        setTimeout(() => {
          this.$router.go(-1);
        }, 800);
      } else {
        this.$toast(res.msg);
      }
    });
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .van-field__label {
    @include textauto();
  }
  .van-button--disabled {
    background-color: #cccccc;
    border: none;
  }
}
.bindBankCard {
  height: 100%;
  padding-bottom: 50px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.content {
  width: 80%;
}
.title {
  margin: 80px 0 100px 0;
  color: #424242;
  font-weight: 500;
  font-size: 16px;
}
.btn {
  width: 100%;
  position: fixed;
  bottom: 0;
}
</style>
