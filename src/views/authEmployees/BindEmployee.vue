<template>
  <div class="content">
    <!-- <NavBar title="选择员工信息" isleftarrow rightText="" @onClickLeft="onClickLeft"> </NavBar> -->

    <div class="header">
      <van-steps :active="active" @click-step="handleClickStep">
        <van-step>个人信息</van-step>
        <van-step>所属部门</van-step>
        <van-step>所在岗位</van-step>
      </van-steps>
    </div>
    <van-divider />
    <van-radio-group v-model="radio">
      <van-cell-group>
        <van-cell
          v-for="(item, index) in personList"
          clickable
          center
          :key="item.id"
          @click="toggle(index)"
        >
          <template #default>
            <div class="groupItem">
              <div class="left">
                <van-radio :name="index" />
                <div class="employees">
                  <!-- <van-image
                    v-if="item.avatar !== null"
                    class="avatar"
                    width="40"
                    height="40"
                    fit="cover"
                    radius="5"
                    :src="item.avatar"
                  /> -->
                  <!-- <SvgIcon class="icon" iconClass="Shape"></SvgIcon> -->

                  <div class="avatar active">
                    {{
                      isletter(item.customerName)
                        ? item.customerName.slice(0, 2)
                        : item.customerName.slice(-2)
                    }}
                  </div>
                  <div>
                    <div>{{ item.customerName }}</div>
                    <div class="phoneNumber">{{ item.mobile }}</div>
                  </div>
                </div>
              </div>
              <div class="right">
                <div>工号</div>
                <div class="deptId">{{ item.comCode }}</div>
              </div>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <van-button class="btn" type="info" @click="sub" block>下一步</van-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
interface UserAuthData {
  comCode: string;
  personName: string;
}
interface PersonList {
  comCode: string;
  personName: string;
}
@Component({
  name: "BindEmployee"
})
export default class BindEmployee extends Vue {
  private active: number = 0;
  private radio: any = null;
  private personList: PersonList[] = [];
  private userAuthData: UserAuthData = {
    comCode: "",
    personName: ""
  };
  private get isletter(): Function {
    return function(val: string): boolean {
      console.log("val", val);
      return /^[a-zA-Z]+$/.test(val);
    };
  }
  public mounted(): void {
    const personList = window.localStorage.getItem("personList") as any;
    const userAuthData = window.localStorage.getItem("userAuthData") as any;

    this.personList = JSON.parse(personList);
    this.userAuthData = JSON.parse(userAuthData);
    // console.log(this.personList)
  }
  public handleClickStep(index: number): void {
    console.log("handleClickStep", index);
  }
  // 多选
  public toggle(index: number): void {
    this.radio = index;
    console.log(this.personList[index]);
    const { comCode, personName } = this.personList[index];

    this.userAuthData.comCode = comCode;
    this.userAuthData.personName = personName;
    window.localStorage.setItem(
      "userAuthData",
      JSON.stringify(this.userAuthData)
    );
  }
  public sub(): void {
    if (this.radio === null) {
      this.$toast.fail("请选择人员");
      return;
    }
    this.$router.push({
      name: "BindDepartment"
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
  .van-divider {
    margin: 4px 0;
  }
  .van-popup--bottom {
    background-color: #f0f0f0;
  }
}
</style>
