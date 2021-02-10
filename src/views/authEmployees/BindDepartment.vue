<template>
  <div class="content">
    <!-- <NavBar
      title="选择部门"
      isleftarrow
      rightText=""
      @onClickLeft="onClickLeft"
    >
    </NavBar> -->

    <div class="header">
      <van-steps :active="active" @click-step="handleClickStep">
        <van-step>个人信息</van-step>
        <van-step>所属部门</van-step>
        <van-step>所在岗位</van-step>
      </van-steps>
    </div>
    <div class="divider"></div>
    <div style="height: 20px"></div>
    <van-field
      v-model="deptIdName"
      is-link
      readonly
      label="所属部门"
      placeholder="请选择所属部门"
      @click="deptShow = true"
    />
    <van-popup v-model="deptShow" round position="bottom">
      <van-cascader
        v-model="deptId"
        title="请选所属部门"
        :options="options"
        @close="deptShow = false"
        @finish="onFinish"
      />
    </van-popup>

    <van-button class="btn" type="info" @click="sub" block>下一步</van-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getDeptTree } from "@/api/common";

interface UserAuthData {
  deptId: string;
}

@Component({
  name: "BindDepartment"
})
export default class BindDepartment extends Vue {
  private active: number = 1;
  private radio: any = null;
  private userAuthData: UserAuthData = {
    deptId: ""
  };
  private deptShow: boolean = false;
  private deptIdName: string = "";
  private deptId: string = "";
  private options: object[] = [];

  private get isletter(): Function {
    return function(val: string): boolean {
      return /^[a-zA-Z]+$/.test(val);
    };
  }
  public mounted(): void {
    const userAuthData = window.localStorage.getItem("userAuthData") as any;
    // debugger
    this.userAuthData = JSON.parse(userAuthData);

    console.log("suserAuthData", this.userAuthData);

    getDeptTree().then(res => {
      console.log(res);
      this.options = res.data;
    });
  }

  public handleClickStep(index: number): void {
    console.log("handleClickStep", index);
  }

  // 全部选项选择完毕后，会触发 finish 事件
  public onFinish({ selectedOptions }: any): void {
    this.deptShow = false;
    this.deptIdName = selectedOptions[selectedOptions.length - 1].text;
    console.log("deptId", this.deptId);
    this.userAuthData.deptId = this.deptId;
    console.log("userAuthData", this.userAuthData);

    // this.fieldValue = selectedOptions.map(option => option.text).join('/')
  }
  public sub(): void {
    if (!this.deptId) {
      this.$toast.fail("请选择所属部门");
      return;
    }
    window.localStorage.setItem(
      "userAuthData",
      JSON.stringify(this.userAuthData)
    );

    this.$router.push({
      name: "BindJob"
    });
  }
}
</script>

<style lang="scss" scoped>
.content {
  background-color: #fff;
  height: 100%;
  box-sizing: border-box;
  // padding: 0 12px;
}
.icon {
  font-size: 220px;
  margin: 40px 0;
}
.header {
  width: 300px;
  margin: 0 auto;
  //   box-sizing: border-box;
  //   padding: 0 12px;
  //   text-align: center;
}
.btn {
  position: fixed;
  bottom: 0;
  left: 0;
}
.divider {
  height: 4px;
  background-color: #dbdbdb;
}
.groupItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    display: flex;
    align-items: center;
    .employees {
      display: flex;
      .avatar {
        margin: 0 12px;
        &.active {
          border-radius: 5px;
          width: 40px;
          height: 40px;
          line-height: 40px;
          background-color: #1989fa;
          color: #fff;
          text-align: center;
        }
      }
      .phoneNumber {
        font-size: 10px;
        color: #808080;
      }
    }
  }
  .right {
    font-size: 10px;
    color: #808080;
    text-align: right;
    .deptId {
      // font-size: 12px;
      color: #4e6ef2;
    }
    &.active {
      margin-right: 12px;
    }
  }
}
::v-deep {
  .van-action-sheet {
    height: 100%;
  }
  .van-field__control {
    text-align: right;
  }
  // .van-popup--bottom {
  //   background-color: #f0f0f0;
  // }
}
</style>
