<template>
  <div class="content">
    <!-- <NavBar
      title="选择岗位"
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
    <van-radio-group v-model="radio">
      <van-cell-group>
        <van-cell
          v-for="(item, index) in postList"
          clickable
          center
          :key="item.id"
          @click="toggle(index)"
        >
          <template #default>
            <div class="groupItem">
              <div class="left">
                <SvgIcon class="icon" iconClass="Shape"></SvgIcon>
                <div class="employees">
                  <div>
                    <div>{{ item.postName }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #right-icon>
            <van-radio :name="index" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <van-button class="btn" type="info" @click="sub" block>完成</van-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getPostList, employeeRegister } from "@/api/common";
interface EmployeeRegister {}

interface PostList {
  postId: string;
}
interface UserAuthData {
  postId: string;
  comCode: string;
  personName: string;
}

@Component({
  name: "BindJob"
})
export default class BindJob extends Vue {
  private active: number = 2;
  private radio: any = null;
  private userAuthData: UserAuthData = {
    postId: "",
    comCode: "",
    personName: ""
  };
  private postList: PostList[] = [];

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
    getPostList().then(res => {
      console.log(res);
      this.postList = res.data;
    });
  }

  public handleClickStep(index: number): void {
    console.log("handleClickStep", index);
  }

  public toggle(index: number): void {
    this.radio = index;
    console.log(this.postList[index]);
    const { postId } = this.postList[index];
    this.userAuthData.postId = postId;
  }
  public sub(): void {
    console.log(this.userAuthData);
    if (!this.userAuthData.postId) {
      this.$toast.fail("请选择职位");
      return;
    }
    this.userAuthData.comCode = Math.random().toString();
    this.userAuthData.personName = "张三";
    employeeRegister(this.userAuthData).then((res: any) => {
      console.log(res);

      if (res.code === 200) {
        this.$store.dispatch("SET_TOKEN", res.data);
        this.$router.push({
          name: "Home"
        });
        window.localStorage.removeItem("userAuthData");
      } else {
        this.$toast(res.msg);
      }
    });
    //   if (this.radio !== null) {
    //     this.active = 1
    //   }
  }
}
</script>

<style lang="scss" scoped></style>
