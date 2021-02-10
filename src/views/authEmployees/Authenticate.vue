<template>
  <div class="content">
    <svg-icon iconClass="security" class="icon"></svg-icon>
    <div class="info">
      为了保证您的账号安全，请先验证身份， 验证成功后将继续进行下一步操作。
    </div>
    <van-field
      v-model="keyword"
      @click-right-icon="handleClickRightIcon"
      :right-icon="keyword.length > 0 ? 'close' : ''"
    />
    <van-button class="btn" type="info" @click="sub" block>确认授权</van-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getLhtEmployeeList } from "@/api/user";
interface UserData {
  [index: string]: any;
}
@Component({
  name: "Authenticate"
})
export default class Authenticate extends Vue {
  private keyword: string = "";
  private userData: object[] = [];
  public mounted(): void {
    const { keyword, userId } = this.$route.query;
    this.keyword = keyword !== null ? (keyword as string) : "";

    const userAuthData: object = {
      comCode: "",
      userId,
      personName: "",
      mobile: "",
      deptId: "",
      postId: ""
    };
    // debugger
    window.localStorage.setItem("userAuthData", JSON.stringify(userAuthData));
  }
  public handleClickRightIcon(): void {
    console.log("handleClickRightIcon");
    this.keyword = "";
  }
  public async sub() {
    const { keyword } = this;
    let userData: UserData = await getLhtEmployeeList({ keyword });
    // console.log(res)
    if (userData.code === 200) {
      this.userData = userData.data;
      window.localStorage.setItem("personList", JSON.stringify(userData.data));
    } else {
      this.$toast.fail(userData.msg);
      return;
    }
    console.log(this.keyword);
    if (this.userData.length <= 0) return;
    this.$router.push({
      name: "BindAccount"
    });
    // debugger
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icon {
  font-size: 220px;
  margin: 40px 0;
}
.info {
  width: 220px;
  color: #989898;
  text-align: center;
}
.btn {
  position: fixed;
  bottom: 0;
}
::v-deep {
  .van-cell {
    width: 240px;
    margin-top: 40px;
    background-color: #f1f1f1;
    border-bottom: 1px solid #989898;
  }
}
</style>
