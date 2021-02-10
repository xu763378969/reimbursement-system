<template>
  <div class="container">
    <van-cell-group>
      <van-cell title="头像">
        <template #right-icon>
          <van-image round width="30" height="30" :src="userInfo.thumbAvatar" />
        </template>
      </van-cell>
      <van-cell title="昵称" :value="userInfo.realName" />
      <van-cell title="电话" :value="userInfo.mobile" />
      <van-cell title="企业微信号" :value="userInfo.userId" />
      <van-cell title="性别" :value="userInfo.gender === 1 ? '男' : '女'" />
      <van-cell
        is-link
        title="地区"
        :value="address"
        @click="handleBindAddress"
      />
    </van-cell-group>
    <van-cell
      class="margin"
      is-link
      title="银行卡"
      :value="userInfo.bankCardCount"
      @click="handleBindBankCard"
    />
    <!-- <footer-tabbar /> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { getUserInfo } from "@/api/user";

// import VoPages from "vo-pages"
// import "vo-pages/lib/vo-pages.css"

interface UserInfo {
  [index: string]: any;
}

@Component({
  name: "Mine"
})
export default class Mine extends Vue {
  private userInfo: UserInfo = [];

  get address() {
    let address = "";
    if (this.userInfo.province !== "" && this.userInfo.province !== null) {
      address = `${this.userInfo.provinceName} - ${this.userInfo.cityName}`;
    } else {
      address = "-";
    }
    return address;
  }

  created() {
    getUserInfo().then((res: any) => {
      this.userInfo = res.data;
    });
  }
  // 请求数据案例
  initData() {
    // 请求接口数据，仅作为展示，需要配置src->config下环境文件
    getUserInfo().then(res => {
      console.log(res);
      this.userInfo = res.data;
    });
  }
  // Action 通过 store.dispatch 方法触发
  doDispatch() {
    // this.$store.dispatch('setUserName', '真乖，赶紧关注公众号，组织都在等你~')
  }
  handleBindAddress() {
    if (this.address !== "-") return;
    this.$router.push({
      name: "BindAddress"
    });
  }
  handleBindBankCard() {
    this.$router.push({
      name: "BankCard"
    });
  }
}
</script>
<style lang="scss" scoped>
p {
  margin-block-start: 0;
  margin-block-end: 0;
}
.container {
  height: 100%;
  width: 100%;
  background: #f5f5f5;
  .list-wrap {
    height: 100%;
    overflow-y: hidden;
  }
}

.article-list {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 15px 15px 0;
  .article {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px 15px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 6px #e3e3e3;
    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
    }
    .right {
      padding-left: 15px;
      box-sizing: border-box;
      display: flex;
      width: 235px;
      height: 80px;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-around;
      p {
        width: 100%;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
      }
      .more-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>
