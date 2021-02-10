<template>
  <div class="travel">
    <!-- <NavBar title="差旅申请" :isleftarrow="true" @onClickLeft="onClickLeft"></NavBar> -->
    <van-form validate-first @submit="onSubmit">
      <div class="label">
        <van-field
          v-model="travelData.title"
          label="标题"
          name="label"
          placeholder="请输入标题"
          input-align="right"
        />
      </div>
      <div class="content">
        <!-- <van-cell title="申请人" value="xx" /> -->
        <van-cell title="出差人员" center>
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
        <van-field
          readonly
          clickable
          is-link
          name="area"
          :value="travelData.city"
          label="出差地区"
          placeholder="点击选择省市区"
          @click="showCity = true"
        />
        <van-cell
          is-link
          title="开始时间"
          :value="travelData.beginTime"
          @click="showStartCalendar = true"
        />
        <van-calendar
          v-model="showStartCalendar"
          color="#1989fa"
          @confirm="onCalendarStartConfirm"
        />
        <van-cell
          is-link
          title="结束时间"
          :value="travelData.endTime"
          @click="showEndCalendar = true"
        />
        <van-calendar
          v-model="showEndCalendar"
          color="#1989fa"
          @confirm="onCalendarEndConfirm"
        />

        <van-popup v-model="showCity" position="bottom">
          <van-area
            :area-list="areaList"
            @confirm="onCityConfirm"
            @cancel="showCity = false"
          />
        </van-popup>
        <van-cell title="时长" :value="duration" />
      </div>
      <!-- <van-cell title="时长">
        <template #default>
          <van-stepper v-model.number="duration" disable-input integer />
        </template>
      </van-cell> -->
      <div class="remark">
        <van-cell title="备注" />
        <van-field
          name="remark"
          v-model="travelData.remark"
          rows="3"
          autosize
          type="textarea"
          placeholder="请填写出差事由"
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
import { Component, Vue, Watch } from "vue-property-decorator";

import { parseTime, getDaysBetween } from "@/utils";
import { AddApply } from "@/api/home";
import { getAreaData } from "@/api/common";

import {
  Button,
  Grid,
  GridItem,
  Cell,
  CellGroup,
  Calendar,
  Field,
  Icon,
  Popup,
  Area,
  Form,
  Collapse,
  CollapseItem
} from "vant";

interface TravelData {
  city: string;
  title: string;
  provinceCode: string;
  cityCode: string;
  areaCode: string;
  beginTime: string;
  endTime: string;
  remark: string;
}

@Component({
  name: "Travel",
  components: {
    [Button.name]: Button,
    [GridItem.name]: GridItem,
    [Grid.name]: Grid,
    [Popup.name]: Popup,
    [Form.name]: Form,
    [Area.name]: Area,
    [Calendar.name]: Calendar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Icon.name]: Icon
  }
})
export default class Travel extends Vue {
  private type: any = "";
  private label: any = "";
  // private value: string = ''
  private show: boolean = false; // 是否展示出差人员
  private showCity: boolean = false;
  private areaList: object[] = [];
  private applyPerson: object[] = []; // 出差人员
  private columns: object[] = [];

  private travelData: TravelData = {
    city: "",
    title: "",
    provinceCode: "",
    cityCode: "",
    areaCode: "",
    beginTime: "",
    endTime: "",
    remark: ""
  }; // 当前页面信息
  private showStartCalendar: boolean = false;
  private showEndCalendar: boolean = false;
  private isValidate: boolean = false;

  beforeRouteLeave(to: any, from: any, next: any) {
    window.localStorage.removeItem("applyPerson");
    next();
  }

  mounted() {
    const { label, type } = this.$route.query;
    this.label = label;
    this.type = type;
    // 出差人员
    let applyPersonLocal: any = window.localStorage.getItem("applyPerson");
    const applyPerson = JSON.parse(applyPersonLocal);
    // 页面信息
    let travelDataLocal: any = window.localStorage.getItem("travelData");
    const travelData = JSON.parse(travelDataLocal);
    if (applyPerson) {
      applyPerson.map((item: any) => (item.isShow = true));
      this.applyPerson = applyPerson;
    }
    if (travelData) {
      this.travelData = { ...travelData };
      console.log(this.travelData);
    }

    getAreaData().then(res => {
      this.areaList = res.data;
      // console.log(this.areaList)
    });
    console.log(this.applyPerson);
  }
  public get applyPersonPart() {
    return this.applyPerson.length > 3
      ? this.applyPerson.slice(0, 2)
      : this.applyPerson;
  }
  public get duration() {
    return (
      getDaysBetween(
        parseTime(this.travelData.beginTime, "{y}-{m}-{d}"),
        parseTime(this.travelData.endTime, "{y}-{m}-{d}")
      ) || ""
    );
  }
  public get timer() {
    const { beginTime, endTime } = this.travelData;
    return {
      beginTime,
      endTime
    };
  }

  @Watch("timer")
  watchTimer({ beginTime, endTime }: any, oval: any) {
    var startDate = Date.parse(beginTime);
    var endDate = Date.parse(endTime);
    if (startDate > endDate) {
      this.travelData.endTime = "";
      this.$toast("结束时间不能早于开始时间");
    }
    // console.log('channge', nval, oval)
  }

  goApplyEmpList() {
    window.localStorage.setItem("travelData", JSON.stringify(this.travelData));
    this.$router.push({
      name: "Contact"
    });
  }
  // 创建申请单
  onSubmit(values: any) {
    const {
      title,
      beginTime,
      endTime,
      remark,
      provinceCode,
      cityCode,
      areaCode
    } = this.travelData;
    const { validate } = this;
    // 是否通过校验

    if (!validate(title, "申请单标题不能为空")) return;
    if (!validate(provinceCode, "出差省份不能为空")) return;
    if (!validate(cityCode, "出差城市不能为空")) return;
    if (!validate(beginTime, "开始时间不能为空")) return;
    if (!validate(endTime, "结束时间不能为空")) return;
    // if (this.applyPerson.length <= 0) {
    //   this.$toast('出差人员不能为空')
    //   return
    // }

    const BxApplyEmpList: Array<object> = [];

    const params = {
      title, //      申请单标题'
      applyType: "0", // 'sys_apply_type  申请单类型(0出差事先申请单、1招待派餐申请单)',
      status: "0", //  'sys_apply_status  状态（0未提交 1待审核 2审核通过 3审核不通过）
      remark, //  事由
      bxApplyTravel: {
        beginTime,
        endTime,
        isDel: "0",
        province: provinceCode,
        city: cityCode,
        area: areaCode,
        duration: this.duration //   时长
      },
      bxApplyEmpList: BxApplyEmpList
    };

    // console.log('submit', values)
    this.applyPerson.forEach((item: any) => {
      params.bxApplyEmpList.push({
        empId: item.userId,
        deptId: item.deptId
      });
    });
    // window.localStorage.removeItem('applyPerson')
    console.log("submit", params);

    AddApply(params).then((res: any) => {
      console.log(res);
      if (res.code === 200 && res.msg.includes("成功")) {
        console.log("success");
        window.localStorage.removeItem("travelData");
        // debugger
        this.$router.push({
          name: "Approval",
          query: {
            id: res.data,
            type: "0"
          }
        });
      }
      // window.localStorage.removeItem('travelData')
    });
  }
  validate(data: any, msg: any) {
    console.log(data);
    if (data === "") {
      this.$toast(msg);
      return false;
    }
    return true;
  }
  assert(exp: any, msg: any) {
    debugger;
    if (exp === "") {
      this.$toast(msg);
      return false;
    }
    return true;
  }
  handleShowNameList() {
    console.log("handleShowNameList");
  }
  onCalendarStartConfirm(date: any) {
    this.showStartCalendar = false;
    this.travelData.beginTime = `${parseTime(date, "{y}-{m}-{d}")}`;
  }
  onCalendarEndConfirm(date: any) {
    this.showEndCalendar = false;
    this.travelData.endTime = `${parseTime(date, "{y}-{m}-{d}")}`;
  }
  onCityConfirm(values: any) {
    console.log(values);
    const [province, city, area] = values;
    this.travelData.provinceCode = province.code;
    this.travelData.cityCode = city.code;
    this.travelData.areaCode = area.code;

    this.travelData.city = values
      .filter((item: any) => !!item)
      .map((item: any) => item.name)
      .join("/");
    this.showCity = false;
  }
  close(index: number) {
    this.applyPerson.splice(index, 1);
  }
}
</script>

<style lang="scss" scoped>
.travel {
  box-sizing: border-box;
  padding-bottom: 70px;
  background-color: $bgColor;
  .label {
    margin: 6px 0;
  }
  .remark {
    margin-top: 6px;
  }
  .btn {
    box-shadow: 0px -4px 8px rgba(66, 66, 66, 0.1);

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
