<template>
  <div class="entertain">
    <!-- <NavBar
      title="招待申请"
      :isleftarrow="true"
      @onClickLeft="onClickLeft"
    ></NavBar> -->

    <van-form validate-first @submit="onSubmit">
      <div class="label">
        <van-field
          v-model="entertainData.title"
          label="标题"
          name="label"
          placeholder="请输入标题"
          input-align="right"
        />
      </div>
      <div class="label">
        <van-cell
          is-link
          title="招待类型"
          :value="entertainData.serveTypeName"
          @click="showServeType = true"
        />
        <van-action-sheet
          v-model="showServeType"
          :actions="serveTypeOptions"
          cancel-text="取消"
          close-on-click-action
          @select="onServeTypeSelect"
          @cancel="onServeTypeCancel"
        />
      </div>
      <div class="content">
        <!-- <van-cell title="申请人" value="xx" /> -->
        <van-field
          v-model="entertainData.deptIdName"
          is-link
          readonly
          label="承担部门"
          placeholder="请选择承担部门"
          @click="deptShow = true"
        />
        <van-popup v-model="deptShow" round position="bottom">
          <van-cascader
            v-model="entertainData.deptId"
            title="请选承担部门"
            :options="options"
            @close="deptShow = false"
            @finish="onFinish"
          />
        </van-popup>
        <van-cell is-link title="陪餐人员" center>
          <template #right-icon>
            <div class="itemBox">
              <van-tag
                v-if="applyPerson.length > 3"
                class="tag"
                type="primary"
                size="medium"
                @click="handleShowNameList"
                >查看全部</van-tag
              >
              <div v-for="(item, index) in applyPersonPart" :key="item.id">
                <span v-if="applyPerson.length > 3">+</span>
                <van-tag
                  class="tag"
                  v-if="item.isShow"
                  type="primary"
                  size="medium"
                  closeable
                  @close="close(index)"
                  >{{ item.realName }}</van-tag
                >
              </div>
              <van-icon name="add-o" @click="goApplyEmpList" />
            </div>
          </template>
        </van-cell>
        <van-cell
          is-link
          title="招待时间"
          :value="entertainData.visitorTime"
          @click="showStartCalendar = true"
        />
        <van-calendar
          v-model="showStartCalendar"
          color="#1989fa"
          @confirm="onCalendarStartConfirm"
        />
        <van-field
          v-model="entertainData.visitorCompany"
          label="来客单位"
          name="label"
          placeholder="请输入单位名称"
          input-align="right"
        />
        <van-cell title="来客人数">
          <template #default>
            <van-stepper
              v-model.number="entertainData.visitorNum"
              disable-input
              integer
            />
          </template>
        </van-cell>
        <van-field
          v-model="entertainData.visitorNames"
          label="来客人员"
          name="label"
          placeholder="请输入来客人员"
          input-align="right"
        />
      </div>
      <div class="remark">
        <van-cell name="remark" title="招待事项说明" />
        <van-field
          v-model="entertainData.remark"
          rows="3"
          autosize
          type="textarea"
          placeholder="请填写招待‘’；kg发达了】【】事由"
        />
      </div>
      <div class="btn">
        <van-button round block type="info" native-type="submit"
          >创建申请单</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { parseTime } from "@/utils";
import { getDeptTree } from "@/api/common";
import { AddApply } from "@/api/home";

interface EntertainData {
  [index: string]: any;
}
@Component({
  name: "Entertain"
})
export default class Entertain extends Vue {
  private type: any = "";
  private label: any = "";
  private showCity: boolean = false;
  private showServeType: boolean = false;
  private deptShow: boolean = false;

  private serveTypeOptions: object[] = [
    {
      name: "外事招待",
      value: "5"
    },
    {
      name: "商务招待",
      value: "6"
    },
    {
      name: "其他公务招待",
      value: "7"
    }
  ];
  private options: object[] = [];
  private applyPerson: object[] = []; // 出差人员
  private entertainData: EntertainData = {
    deptId: "",
    title: "",
    deptIdName: "",
    serveType: "",
    serveTypeName: "",
    visitorCompany: "",
    visitorTime: "",
    visitorNum: "",
    visitorNames: "",
    remark: ""
  };
  private city: string = "";
  private columns: object[] = [];
  private showStartCalendar: boolean = false;
  private showEndCalendar: boolean = false;
  private beginTime: string = "";
  private endTime: string = "";
  private duration: string = "";

  public beforeRouteLeave(to: object, from: object, next: Function): void {
    window.localStorage.removeItem("applyPerson");
    next();
  }
  public mounted(): void {
    this.label = this.$route.query.label;
    this.type = this.$route.query.type;
    const applyPerson = JSON.parse(
      window.localStorage.getItem("applyPerson") as any
    );
    const entertainData = JSON.parse(
      window.localStorage.getItem("entertainData") as any
    );
    if (entertainData) {
      this.entertainData = { ...entertainData };
      console.log(this.entertainData);
    }
    if (applyPerson) {
      applyPerson.map((item: any) => (item.isShow = true));
      this.applyPerson = applyPerson;
    }

    getDeptTree().then(res => {
      console.log(res);
      this.options = res.data;
    });
  }
  private get applyPersonPart(): object[] {
    return this.applyPerson.length > 3
      ? this.applyPerson.slice(0, 2)
      : this.applyPerson;
  }

  onClickLeft() {
    this.$router.push({
      name: "Home"
    });
  }
  // 时间确认
  public onCalendarStartConfirm(date: string): void {
    this.showStartCalendar = false;
    this.entertainData.visitorTime = `${parseTime(date, "{y}-{m}-{d}")}`;
  }
  // 去选择人员
  public goApplyEmpList(): void {
    window.localStorage.setItem(
      "entertainData",
      JSON.stringify(this.entertainData)
    );

    this.$router.push({
      name: "Contact"
    });
  }

  // 全部选项选择完毕后，会触发 finish 事件
  public onFinish({ selectedOptions }: any): void {
    this.deptShow = false;
    this.entertainData.deptIdName =
      selectedOptions[selectedOptions.length - 1].text;
    console.log(this.entertainData.deptId);
    // this.fieldValue = selectedOptions.map(option => option.text).join('/')
  }

  // 查看全部人员
  public handleShowNameList(): void {
    console.log("handleShowNameList");
  }
  // 取消人员
  public close(index: number): void {
    this.applyPerson.splice(index, 1);
  }
  //  招待类型确认
  public onServeTypeSelect(Action: any, index: number): void {
    console.log("onServeTypeSelect", Action, index);
    this.entertainData.serveTypeName = Action.name;
    this.entertainData.serveType = Action.value;
  }
  // 招待类型取消
  public onServeTypeCancel(): void {
    console.log("onServeTypeCancel");
  }
  // 创建申请
  public onSubmit(values: object[]): void {
    // console.log('submit', values)
    const {
      title,
      serveType,
      visitorCompany,
      visitorNum,
      visitorNames,
      remark,
      visitorTime,
      deptId
    }: any = this.entertainData;
    const params: any = {
      title,
      applyType: "1",
      status: "0",
      deptId, // 承担部门
      remark: remark,
      bxApplyServe: {
        serveType, //  招待类型(1外事招待 2商务招待 3其他公务招待)
        // serveAddr: '青岛黄岛区大港口水下', //    '招待地点
        visitorCompany, //  '来客公司
        visitorNum, //  来客人数
        visitorNames, // 人员
        mealNum: this.applyPerson.length, //   陪餐人数
        visitorTime, //     来访时间
        isDel: "0"
      },
      bxApplyEmpList: [] // 人员
    };
    this.applyPerson.forEach((item: any) => {
      params.bxApplyEmpList.push({
        emp_id: item.id,
        dept_id: item.deptId
      });
    });

    AddApply(params).then(res => {
      console.log(res);
      window.localStorage.removeItem("entertainData");

      this.$router.push({
        name: "TravelApproval",
        query: {
          id: res.data,
          type: "1"
        }
      });
    });

    console.log(JSON.stringify(params));
  }
}
</script>

<style lang="scss" scoped>
.entertain {
  box-sizing: border-box;
  padding-bottom: 70px;
  .label {
    margin: 6px 0;
  }
  .remark {
    margin-top: 6px;
  }
  .btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 10px 20px;
    background-color: #fff;
  }
}
.content {
  ::v-deep {
    .van-field__control {
      text-align: right;
    }
  }

  .itemBox {
    display: flex;
    align-items: center;
  }
  .tag {
    margin: 0 4px;
  }
}
</style>
