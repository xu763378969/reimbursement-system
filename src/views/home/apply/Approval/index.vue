<template>
  <div class="travelApproval">
    <!-- <NavBar
      title="出差事前审批单"
      :isleftarrow="true"
      @onClickLeft="onClickLeft"
    ></NavBar> -->

    <div class="travelInfo">
      <div class="budget">
        <div class="title">预算（CNY）</div>
        <div class="price">{{ result.costMoney | NumFormat() }}</div>
      </div>
      <van-divider
        :style="{
          color: '#ebedf0',
          borderColor: '#ebedf0',
          padding: '0 10px',
          margin: 0
        }"
      />
      <div class="infoBox" :class="more ? 'infoBoxActive' : ''">
        <div :class="{ margin: !more }">
          <div class="title">标题：{{ result.title }}</div>
          <!-- <div class="flex">
            <div class="l">申请人：{{ result.createBy }}</div>
            <div class="r">所属部门：{{}}</div>
          </div> -->

          <div class="officials" v-if="result.bxApplyEmpList">
            <div>
              {{ typeValue === "1" ? "陪同人员" : "陪餐人员" }}：{{
                result.bxApplyEmpList.map(i => i.empName).join(",")
              }}
            </div>
          </div>

          <div v-if="result.bxApplyServe">
            <div class="flex">
              <div class="l">
                <div>来客单位：{{ result.bxApplyServe.visitorCompany }}</div>

                <div>招待类型：{{ result.bxApplyServe.serveName }}</div>
              </div>
              <div class="r">
                <div>来客人数：{{ result.bxApplyServe.visitorNum }}人</div>

                <div>招待时间：{{ result.bxApplyServe.visitorTime }}</div>
              </div>
            </div>
            <div class="officials">
              <div>来客人员：{{ result.bxApplyServe.visitorNames }}</div>
            </div>
          </div>
          <div class="flex" v-if="result.bxApplyTravel">
            <div class="l">
              <div>出差地区：{{ result.bxApplyTravel.cityName }}</div>
              <div>开始时间：{{ result.bxApplyTravel.beginTime }}</div>
            </div>
            <div class="r">
              <div>出差时长：{{ result.bxApplyTravel.duration }}天</div>
              <div>结束时间：{{ result.bxApplyTravel.endTime }}</div>
            </div>
          </div>

          <div class="remark">备注： {{ result.remark }}</div>
          <div class="icon">
            <van-image
              width="24"
              height="24"
              @click="handleMore"
              fit="contain"
              :src="
                require(`@/assets/images/travelApproval/${
                  more ? 'icon_top' : 'icon_bottom'
                }@2x.png`)
              "
            />
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <van-tabs v-model="active" animated>
        <van-tab
          v-for="(tab, index) in tabArr"
          :title="tab.name"
          :key="tab.id"
          :disabled="tab.isDisable"
        >
          <div class="addplan" v-if="!isSearch && index === 0">
            <van-button
              icon="add-o"
              size="small"
              block
              plain
              type="info"
              @click="addPlan"
              >{{
                typeValue === "0" ? "添加出差计划" : "添加招待计划"
              }}</van-button
            >
          </div>
          <TravelPlan
            v-if="tab.id === 0 && !isEmpty(travelPlanData)"
            @emit-cell-click="cellClick"
            @handle-delete="handleDelete"
            @handle-select="handleSelect"
            :resultData="travelPlanData"
            :type="type.toString()"
          ></TravelPlan>
          <BudgetAllocation v-if="tab.id === 1" :resultData="bxApplyEmpList">
          </BudgetAllocation>
          <Workflow v-if="tab.id === 2" :applyNo="result.applyNo"></Workflow>
        </van-tab>
      </van-tabs>
    </div>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      description="请选择出差计划分类"
      cancel-text="取消"
      close-on-click-action
      @select="handleSelect"
      @cancel="onCancel"
    />

    <div class="footer" v-if="!isSearch">
      <van-button type="default" class="save" @click="handleButtonClick('save')"
        >保存</van-button
      >
      <van-button type="info" class="sub" @click="handleButtonClick('sub')"
        >提交</van-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import TravelPlan from "./components/TravelPlan.vue";
import BudgetAllocation from "./components/BudgetAllocation.vue";
import Workflow from "./components/Workflow.vue";

import { getApprovalTemplate } from "@/api/common";
import {
  getInfo,
  saveInfo,
  saveInfoStay,
  saveInfoMeal,
  updateStatusById,
  isQuota
} from "@/api/home";

import { Component, Vue } from "vue-property-decorator";
@Component({
  name: "Approval",
  components: {
    TravelPlan,
    BudgetAllocation,
    Workflow
  }
})
export default class Approval extends Vue {
  private typeValue: string = "";
  private active: number = 0;
  private show: boolean = false;
  private more: boolean = false;
  private isSearch: any = false;
  private templateId: string = "";
  private result: any = {};
  private travelPlanData: object = {};
  private bxApplyEmpList: object[] = [];
  private type: any = "";

  public Wi: any = window;
  public Wx: any = this.Wi.wx;

  public get tabArr(): object[] {
    let arr = [];
    if (this.typeValue === "0") {
      arr = [
        { id: 0, name: "出差计划", isDisable: false },
        { id: 1, name: "预算分摊", isDisable: false },
        { id: 2, name: "工作流", isDisable: false }
      ];
    } else {
      arr = [
        { id: 0, name: "招待计划", isDisable: false },
        { id: 2, name: "工作流", isDisable: false }
      ];
    }
    return arr;
  }
  public get actions(): object[] {
    let actions = [];
    if (this.typeValue === "0") {
      actions = [
        { id: "1", name: "交通费" },
        { id: "3", name: "住宿费" }
      ];
    } else {
      actions = [
        { id: "6", name: "派餐费" },
        { id: "3", name: "酒店住宿" }
      ];
    }
    return actions;
  }

  public created(): void {
    console.log(this.$route.query);
    // debugger
    const { type, isSearch } = this.$route.query;

    getApprovalTemplate().then(res => {
      console.log(res);
      this.templateId = res.data;
    });

    this.isSearch = isSearch;
    this.typeValue = type as string;
    console.log(this.tabArr);
    // if(type === "2"){
    //   this.tabArr.splice(1, 1)
    //   this.tabArr.forEach(tab => {
    //     tab.name === "出差计划"
    //   })
    // }
    // debugger
    this.getInfo();
  }
  onClickLeft() {
    this.$router.push({
      name: "Home"
    });
  }
  addPlan() {
    this.show = true;
  }
  isEmpty(obj: any) {
    return (
      !Object.getOwnPropertyNames(obj).length &&
      !Object.getOwnPropertySymbols(obj).length
    );
  }
  async getInfo() {
    const { id, isDel, type } = this.$route.query;
    this.type = type;

    // if (type !== 'search') return
    const params = {
      id,
      isDel: isDel || 0
    };
    const result = await getInfo(params);
    this.result = result.data;
    // debugger
    //   0出差 1招待,
    if (result.data.applyType === "0") {
      this.travelPlanData = result.data.bxApplyTravel;
    } else {
      this.travelPlanData = result.data.bxApplyServe;
    }
    this.bxApplyEmpList = result.data.bxApplyEmpList;

    console.log(JSON.stringify(result.data));
  }
  getType(divType: string) {
    // debugger
    let type, title;
    switch (Number(divType)) {
      case 1:
      case 2:
        type = 0;
        title = "交通费";
        break;
      case 3:
        type = 1;
        title = "住宿费";
        break;
      case 4:
        type = 2;
        title = "市内交通费";
        break;
      case 5:
      case 6:
        type = 3;
        title = this.typeValue === "1" ? "伙食补助费" : "派餐费";
        break;
    }
    return {
      type,
      title
    };
  }
  // 当前行点击
  cellClick(item: any) {
    debugger;
    const { divType } = item;
    const {
      applyNo,
      id,
      applyType,
      bxApplyServe,
      bxApplyTravel,
      status
    } = this.result;
    const { type, title } = this.getType(divType);
    // debugger
    const { id: tid } = applyType === "0" ? bxApplyTravel : bxApplyServe;

    // debugger
    const query: any = {
      id,
      type,
      tid,
      divType,
      title,
      applyNo,
      status,
      applyType,
      serveType: ""
    };

    applyType === "1" && (query.serveType = bxApplyServe.serveType);

    console.log(JSON.stringify(item));

    console.log(tid);

    this.$router.push({
      name: "TravelPlan",
      query
    });
    // debugger
    window.localStorage.setItem("planInfo", JSON.stringify(item));
    // this.$toast('cellClick')
  }

  getParams(divType: any, item: any) {
    const {
      id: applyId,
      applyType: type,
      bxApplyTravel,
      bxApplyServe
    } = this.result;
    const { id: tid } = type === "0" ? bxApplyTravel : bxApplyServe;
    // debugger
    if (divType === "1" || divType === "2") {
      const { hid } = item;
      return {
        applyId,
        tid,
        hid,
        type,
        isDel: "1"
      };
    }
    if (divType === "3") {
      const { zid } = item;
      return {
        applyId,
        tid,
        zid,
        type,
        isDel: "1"
      };
    }
    // debugger
    if (divType === "6") {
      const { serveId, id } = item;

      return {
        applyId,
        serveId,
        id,
        type,
        isDel: "1"
      };
    }
  }

  // 删除出行计划
  async handleDelete(item: any) {
    const { divType } = item;

    const params = this.getParams(divType, item);
    console.log(JSON.stringify(params));
    let result: any;

    // return

    switch (divType) {
      case "1":
      case "2":
        result = await saveInfo(params);
        break;
      case "3":
        result = await saveInfoStay(params);
        break;
      case "6":
        result = await saveInfoMeal(params);
        break;
      default:
        break;
    }

    if (result.code === 200) {
      console.log(result);
      this.getInfo();
    } else {
      this.$toast(result.msg);
    }
    // this.$dialog
    //   .confirm({
    //     message: '确定删除吗？'
    //   })
    //   .then(() => {
    //     console.log('handleDelete', item)
    //   })
  }
  handleMore() {
    this.more = !this.more;
  }
  handleSelect({ id: divType }: any, index: number) {
    console.log(divType);

    const { applyNo, id, applyType, bxApplyServe, bxApplyTravel } = this.result;
    const { id: tid } = applyType === "0" ? bxApplyTravel : bxApplyServe;
    debugger;
    const { type, title } = this.getType(divType);

    const query: any = {
      id,
      type,
      tid,
      divType,
      title,
      applyNo,
      applyType,
      status: "0",
      serveType: ""
    };

    applyType === "1" && (query.serveType = bxApplyServe.serveType);

    // debugger
    this.$router.push({
      name: "TravelPlan",
      query
    });
  }
  onCancel() {
    this.$toast("取消");
  }
  handleButtonClick(flag: any) {
    console.log("handleButtonClick", this.result);
    const { id } = this.result;
    const params = {
      id,
      isDel: "0",
      status: "0"
    };
    flag === "sub" && (params.status = "1");

    isQuota({ id }).then((res: any) => {
      console.log(res);
      // debugger
      const msg = res.msg.includes("succ") ? "" : "费用已超标";
      this.$dialog
        .confirm({
          title: "提示",
          message: `<span style="color: #ee0a24">${msg}</span>是否确认提交？`
        })
        .then(() => {
          this.Wx.invoke(
            "thirdPartyOpenPage",
            {
              oaType: "10001", // String
              templateId: this.templateId, // String
              thirdNo: this.result.applyNo, // String
              extData: {
                fieldList: [
                  {
                    title: "采购类型",
                    type: "text",
                    value: "市场活动"
                  },
                  {
                    title: "订单链接",
                    type: "link",
                    value: "https://work.weixin.qq.com"
                  }
                ]
              }
            },
            (res: any) => {
              // 输出接口的回调信息
              // console.log(res);
              this.$router.push({
                name: "ApplicationForm"
              });
            }
          );
        });
    });
  }
}
</script>

<style lang="scss" scoped>
.travelApproval {
  display: flex;
  height: 100%;
  flex-direction: column;
  background-color: $bgColor;
}
::v-deep {
  .van-tabs__content--animated {
    overflow-y: auto;
  }
  .van-tabs__track {
    height: auto;
  }
}
.content {
  min-height: 400px;
}
.footer {
  position: fixed;
  bottom: 0;
  box-shadow: 0px -4px 8px rgba(66, 66, 66, 0.1);
  box-sizing: border-box;
  // padding: 10px 0 20px;
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
.addplan {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px 20px;
  background-color: #fff;
  border-bottom: 1px solid #ebedf0;
}

.travelInfo {
  box-sizing: border-box;
  position: relative;

  margin: 10px 0;
  background-color: #fff;

  .budget {
    height: 68px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #4e6ef2;
    .title {
      font-size: 10px;
    }
    .price {
      font-weight: 800;
      font-size: 24px;
    }
  }
}
.infoBoxActive {
  height: auto !important;
  transform: translate(0.3);
  background-color: #fff;
}
.infoBox {
  height: 100px;
  overflow: hidden;
  font-size: 12px;
  box-sizing: border-box;
  color: #656565;
  padding: 20px 10px;
  .flex {
    display: flex;
    .l {
      width: 50%;
    }
    .r {
      flex: 1;
    }
  }
  .icon {
    position: absolute;
    bottom: 4px;
    margin-top: 10px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
  }
  .margin {
    height: 50px;
    overflow: hidden;
  }
}
.content {
  background-color: #fff;
}
</style>
