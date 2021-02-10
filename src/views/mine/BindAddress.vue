<template>
  <div class="bindAddress">
    <div class="content">
      <van-cell is-link title="地区" :value="value" @click="showCity = true" />
      <van-popup v-model="showCity" position="bottom">
        <van-area
          title="标题"
          :area-list="areaList"
          @confirm="onCityConfirm"
          @cancel="showCity = false"
        />
      </van-popup>
    </div>

    <div class="bottom">
      <div class="info">注：地址绑定后不可修改</div>
    </div>

    <div class="footer">
      <van-button type="info" class="sub" @click="onClickRight"
        >完成</van-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getAreaData } from "@/api/common";
import { modifyPersonalInfo } from "@/api/user";

@Component({
  name: "BindAddress"
})
export default class BindAddress extends Vue {
  private showCity: boolean = false;
  private areaList: object = {};
  private value: string = "";
  private province: string = "";
  private city: string = "";
  private area: string = "";

  mounted() {
    getAreaData().then(res => {
      this.areaList = res.data;
    });
  }
  onCityConfirm(values: any) {
    console.log(values);
    const [province, city, area] = values;
    this.province = province.code;
    this.city = city.code;
    this.area = area.code;
    this.value = values
      .filter((item: any) => !!item)
      .map((item: any) => item.name)
      .join("/");
    this.showCity = false;
  }
  onClickRight() {
    const { province, city, area } = this;

    console.log("onClickRight", province, city, area);
    modifyPersonalInfo({
      province,
      city,
      area
    }).then((res: any) => {
      this.$toast(res.msg);
      this.$router.go(-1);
      console.log(res);
    });
  }
}
</script>

<style lang="scss" scoped>
.bindAddress {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .content {
    height: 44px;
    margin: 6px 0;
  }
  .bottom {
    flex: 1;
    background-color: #fff;
    .info {
      margin-top: 4px;
      margin-left: 14px;
      color: #ee0404;
      font-size: 10px;
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
