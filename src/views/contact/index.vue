<template>
  <div class="contact">
    <NavBar title="请选择" leftText="取消" @onClickLeft="onClickLeft"></NavBar>
    <div class="content">
      <van-search
        v-model="searchVal"
        shape="round"
        background="#fff"
        @search="onSearch"
        @cancel="onCancel"
        placeholder="请输入搜索关键词"
      />
      <div class="label">通讯录</div>
      <van-checkbox-group v-model="result" @change="handleSelectChange">
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
                  <van-checkbox :name="item" ref="checkboxes" />
                  <div class="employees">
                    <van-image
                      v-if="item.avatar !== null"
                      class="avatar"
                      width="40"
                      height="40"
                      fit="cover"
                      radius="5"
                      :src="item.avatar"
                    />
                    <div v-else class="avatar active">
                      {{
                        isletter(item.realName)
                          ? item.realName.slice(0, 2)
                          : item.realName.slice(-2)
                      }}
                    </div>
                    <div>
                      <div>{{ item.realName }}</div>
                      <div class="phoneNumber">{{ item.mobile }}</div>
                    </div>
                  </div>
                </div>
                <div class="right">
                  <div>工号</div>
                  <div class="deptId">{{ item.deptId }}</div>
                </div>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </div>
    <div class="btn">
      <div v-if="slectNum > 0" @click="handleShowSelectList">
        已选择：{{ slectNum }}人<van-icon class="icon" name="arrow-up" />
      </div>
      <div v-else></div>
      <van-button
        type="info"
        size="small"
        :disabled="slectNum <= 0"
        @click="handleButtonClick"
      >
        确定 {{ `(${slectNum}/${total})` }}
      </van-button>
    </div>
    <van-popup v-model="show" position="bottom" :style="{ height: '100%' }">
      <div class="header">
        <div></div>
        <div class="title" v-if="!slectRemoveChange">请选择</div>
        <div class="title" v-else>已选择数量:{{ slectNum }}</div>
        <div class="confirm" @click="handleConfirm">确定</div>
      </div>
      <div class="body">
        <van-cell v-for="(item, index) in result" center :key="item.id">
          <template #default>
            <div class="groupItem">
              <div class="left">
                <div class="employees">
                  <van-image
                    v-if="item.avatar !== null"
                    class="avatar"
                    width="40"
                    height="40"
                    fit="cover"
                    radius="5"
                    :src="item.avatar"
                  />
                  <div v-else class="avatar active">
                    {{
                      isletter(item.realName)
                        ? item.realName.slice(0, 2)
                        : item.realName.slice(-2)
                    }}
                  </div>
                  <div>
                    <div>{{ item.realName }}</div>
                    <div class="phoneNumber">{{ item.mobile }}</div>
                  </div>
                </div>
              </div>
              <div class="right active">
                <div>工号</div>
                <div class="deptId">{{ item.deptId }}</div>
              </div>
            </div>
          </template>
          <template #right-icon>
            <van-icon name="close" @click="handleRemove(index)" />
          </template>
        </van-cell>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { getApplyPersonList } from "@/api/common";
import { Checkbox } from "vant";

@Component({
  name: "Contact"
})
export default class Contact extends Vue {
  private show: boolean = false;
  private formName: string = "";
  private slectRemoveChange: boolean = false;
  private searchVal: string = "";
  private realName: string = "";
  private deptId: string = "";
  private personList: object[] = [];
  private result: object[] = [];

  public beforeRouteEnter(to: any, { name }: any, next: any) {
    next((vm: any) => {
      vm.formName = name;
    });
  }

  public get total() {
    return this.personList.length;
  }
  public get slectNum() {
    return this.result.length;
  }
  public get isletter() {
    return function(val: any) {
      return /^[a-zA-Z]+$/.test(val);
    };
  }

  public mounted() {
    const applyPersonLoacl: any = window.localStorage.getItem("applyPerson");
    const applyPerson = JSON.parse(applyPersonLoacl);
    if (applyPerson) {
      applyPerson.map((item: any) => (item.isShow = true));
      this.result = applyPerson;
    }
    this.getApplyPersonList();
  }
  handleCellClick() {
    console.log("cell");
  }
  // 返回
  onClickLeft() {
    console.log("1");
    this.$router.go(-1);
  }
  // 获取部门人员
  getApplyPersonList() {
    const { realName, deptId } = this;
    const params = {
      realName,
      deptId
    };
    getApplyPersonList(params).then((res: any) => {
      console.log(res);
      this.personList = res.data;
    });
  }
  // 搜索
  onSearch(val: any) {
    console.log("search", val);
    !this.isIntNum(val) ? (this.realName = val) : (this.deptId = val);
    this.getApplyPersonList();
  }
  // 取消搜索
  onCancel() {
    console.log("onCancel");
  }
  // 选择部门人员
  handleSelectChange(val: any) {
    console.log(val);
  }
  // 展示所选人员
  handleShowSelectList() {
    this.slectNum > 0 && (this.show = true);
  }
  // 删除已选人员
  handleRemove(index: number) {
    this.result.splice(index, 1);
    this.slectRemoveChange = true;
  }
  // 删除已选人员确认
  handleConfirm() {
    this.show = false;
    this.slectRemoveChange = false;
  }
  // 确认所选人员
  handleButtonClick() {
    console.log("handleButtonClick");
    this.$router.go(-1);
    window.localStorage.setItem("applyPerson", JSON.stringify(this.result));
  }
  // 多选
  toggle(index: number) {
    const el: any = this.$refs.checkboxes;
    el[index].toggle();
  }
  // 校验是否是纯数字
  isIntNum(value: any) {
    if (Number(value) + "" !== NaN + "") {
      return true;
    } else {
      return false;
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 44px 0 60px;
  .label {
    background-color: #fff;
    padding-left: 12px;
    line-height: 38px;
    font-size: 14px;
    color: #808080;
    margin-bottom: 12px;
  }
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
  .van-popup--bottom {
    background-color: #f0f0f0;
  }
}
.btn {
  box-shadow: 0px -4px 8px rgba(66, 66, 66, 0.1);
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: #1989fa;
  box-sizing: border-box;
  padding: 10px 12px 20px;
  background-color: #fff;
  .icon {
    margin-left: 12px;
  }
}
.header {
  display: flex;
  padding: 0 12px;
  justify-content: space-between;
  background-color: #fff;
  line-height: 40px;
  font-size: 14px;
  .title {
    font-weight: 600;
  }
}
.body {
  background-color: #fff;
}
</style>
