<template>
  <div class="travelPlan">
    <!-- <NavBar
      :title="title"
      :isleftarrow="true"
      @onClickLeft="onClickLeft"
    ></NavBar> -->

    <van-form validate-first @submit="onSubmit">
      <div class="label">
        <van-cell
          v-if="divType === '1' || this.divType === '2'"
          :is-link="!isSearch"
          @click="showTrip"
          title="交通工具"
          :value="tripValue"
        />
        <van-action-sheet
          v-model="isShowTrip"
          :actions="tripList"
          cancel-text="取消"
          close-on-click-action
          @select="onSelectTrip"
          @cancel="onCancel"
        />
        <!-- <van-field v-model="value" label="交通工具" name="label" placeholder="请输入标题" input-align="right" /> -->
      </div>
      <!-- <div class="label">
        <van-cell is-link title="招待类型" value="xx" />
      </div> -->
      <div class="content">
        <van-cell
          :is-link="!isSearch"
          :title="divType !== '1' && divType !== '2' ? '开始时间' : '发车时间'"
          :value="beginTime"
          @click="!isSearch && (showStartCalendar = true)"
        />
        <van-calendar
          v-model="showStartCalendar"
          color="#1989fa"
          @confirm="onCalendarStartConfirm"
        />
        <!-- 住宿、市内交通、伙食补助  start -->
        <van-cell-group
          v-if="divType !== '1' && divType !== '2' && divType !== '6'"
        >
          <van-cell
            :is-link="!isSearch"
            title="结束时间"
            :value="endTime"
            @click="!isSearch && (showEndCalendar = true)"
          />
          <van-calendar
            v-model="showEndCalendar"
            color="#1989fa"
            @confirm="onCalendarEndConfirm"
          />

          <van-cell title="时长（天）" :value="duration" />
        </van-cell-group>
        <!--  住宿、市内交通、伙食补助  end -->

        <!--  交通  start -->
        <van-cell-group v-if="divType === '1' || this.divType === '2'">
          <van-cell
            :is-link="!isSearch"
            title="出发地点"
            :value="beginCity"
            @click="handleShowCityClick('begin')"
          >
            <template #default>
              <div v-if="beginProvinceName">
                {{ `${beginProvinceName}/${beginCityName}/${beginAreaName}` }}
              </div>
            </template>
          </van-cell>

          <van-cell
            :is-link="!isSearch"
            title="到达地点"
            @click="handleShowCityClick"
          >
            <template #default>
              <div v-if="provinceName">
                {{ `${provinceName}/${cityName}/${areaName}` }}
              </div>
            </template>
          </van-cell>
          <van-cell
            :is-link="!isSearch"
            title="席位"
            :value="seatName"
            @click="isShowTripSeat = !isSearch"
          />
          <van-action-sheet
            v-model="isShowTripSeat"
            :actions="tripModeList"
            cancel-text="取消"
            close-on-click-action
            @select="onSelectTripSeat"
          />
          <van-field
            v-model="budgetCost"
            label="预计金额"
            name="label"
            placeholder="请输入金额"
            input-align="right"
          />
        </van-cell-group>
        <!--  交通  end -->

        <!--  住宿  start -->
        <van-cell-group v-else-if="divType === '3'">
          <van-cell
            :is-link="!isSearch"
            title="住宿地点"
            @click="handleShowCityClick"
          >
            <template #default>
              <div v-if="provinceName">
                {{ `${provinceName}/${cityName}/${areaName}` }}
              </div>
            </template>
          </van-cell>
          <van-cell title="住宿人数" v-if="!isSearch">
            <template #default>
              <van-stepper
                v-model.number="empNum"
                button-size="24"
                theme="round"
                disable-input
                integer
              />
            </template>
          </van-cell>
          <!-- <van-cell v-else title="住宿人数" :value="planInfo.stayNum" /> -->
          <van-cell title="住宿标准">
            <template #default>
              <div v-if="basicCostStandard">{{ basicCostStandard }}/人/天</div>
            </template>
          </van-cell>
          <van-cell title="预计金额">
            <template #default>
              <div v-if="standardCost">￥{{ standardCost }}</div>
            </template>
          </van-cell>
        </van-cell-group>
        <!--  住宿  end -->

        <!--  伙食补助  start -->
        <van-cell-group v-else>
          <van-cell title="来客人数" v-if="!isSearch">
            <template #default>
              <van-stepper
                v-model.number="visitorNum"
                button-size="24"
                theme="round"
                disable-input
                integer
              />
            </template>
          </van-cell>
          <van-cell v-else title="人数" :value="planInfo.empNum" />
          <van-cell title="陪餐人数" v-if="!isSearch">
            <template #default>
              <van-stepper
                v-model.number="mealNum"
                button-size="24"
                theme="round"
                disable-input
                integer
              />
            </template>
          </van-cell>
          <van-cell
            :title="
              divType === '4' || this.divType === '5' ? '补助标准' : '陪餐标准'
            "
          >
            <template #default>
              <div>{{ basicCostStandard }}/人/天</div>
            </template>
          </van-cell>
          <van-cell title="预计金额">
            <template #default>
              <div>￥{{ standardCost }}</div>
            </template>
          </van-cell>
        </van-cell-group>
        <!--  伙食补助  end -->
      </div>
      <div class="remark">
        <van-cell title="备注" />
        <van-field
          name="remark"
          v-model="remark"
          :readonly="isSearch"
          rows="3"
          autosize
          type="textarea"
          :placeholder="!isSearch ? '请填写' : ''"
        />
      </div>
      <div class="upload">
        <BaseUpload
          :maxCount="isSearch ? bxFileList.length : 2"
          :deletable="isSearch ? false : true"
          :fileData="imageList"
          :uploadUrl="getUrl()"
          @afterRead="afterRead"
          @handleDelete="handleDelete"
        ></BaseUpload>
      </div>
      <div class="btn" v-if="!isSearch">
        <van-button round block type="info" native-type="submit"
          >确认</van-button
        >
      </div>
    </van-form>
    <van-popup v-model="showCity" position="bottom">
      <van-area
        :area-list="areaList"
        @confirm="onCityConfirm"
        @cancel="showCity = false"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import axios from "axios";

import { parseTime, getDaysBetween } from "@/utils";
import { getDicts, getAreaData } from "@/api/common";
import {
  saveInfo,
  saveInfoStay,
  saveInfoMeal,
  getCostStandard
} from "@/api/home";
import BaseUpload from "@/components/BaseUpload.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
interface PlanInfo {
  [index: string]: any;
}
@Component({
  name: "TravelPlan",
  components: {
    [BaseUpload.name]: BaseUpload
  }
})
export default class TravelPlan extends Vue {
  private id: string = "";
  private tid: string = ""; // 出行计划id
  private type: string = ""; //  0、交通费 1、住宿费 2、市内交通费 3、伙食补助费
  private divType: any = ""; // 1、火车  2、飞机  3、住宿   4、市内交通  5、派餐补助   6、派餐
  private applyType: string = ""; // 类型（0出差 1招待）
  private applyNo: string = ""; // 申请单号
  private isSearch: boolean = false;
  private planInfo: PlanInfo = {};
  private isBeginCity: boolean = false; // false 开始时间/到达城市   true 交通出发城市

  // 交通 start
  private isShowTrip: boolean = false; // 交通工具
  private isShowTripSeat: boolean = false;
  private tripList: object[] = []; // 交通工具
  private tripListLabel: object[] = [];
  private tripModeList: object[] = []; // 席位列表
  private seatName: string = "";
  private tripValue: string = ""; //     出行方式（1火车 2飞机）
  private tripCostStandard: object[] = []; // 出行费用标准
  private stayDay: string = "";

  private tripType: string = ""; //     出行方式（1火车 2飞机）
  private tripTime: string = ""; // 出行时间
  private seat: string = ""; // 席位
  // private type: string = '0' // 类型（0出差 1招待）sys_apply_type
  private budgetCost: string = ""; // 预计费用
  // private province:string= '' // 目的地省份
  // private city:string= '' //     目的地城市
  // private  area:string= '' //       目的地区县
  private beginProvince: string = ""; //   始发省份
  private beginProvinceName: string = "";
  private beginCity: string = ""; //       始发城市
  private beginCityName: string = "";
  private beginArea: string = ""; //  始发地区县
  private beginAreaName: string = "";
  // 交通 end

  // common start
  private basicCostStandard: any = ""; // 基本费用标准
  private fileList: object[] = []; // 文件流
  private imageList: object[] = []; // 回显图片
  private provinceName: string = ""; // 目的地省份
  private province: string = ""; // 目的地省份code
  private cityName: string = ""; //     目的地城市
  private city: string = ""; //     目的地城市code
  private areaName: string = ""; //       目的地区县
  private area: string = ""; //       目的地区县code
  private beginTime: string = ""; // 开始时间
  private endTime: string = ""; // 结束时间
  private empNum: number = 1; // 人数
  private bxFileList: object[] = []; // 提交图片arr
  private remark: string = ""; // 备注
  // common end

  private visitorNum: any = null; // 来客人数
  private mealNum: any = null; // 陪餐人数
  private serveType: any = ""; //  1外事招待派餐 2商务招待派餐 3其他业务招待派餐

  private title: string = "";
  private value: string = "";
  private showCity: boolean = false;
  private areaList: object = {}; // 数据格式见 Area 组件文档
  private columns: object[] = [];
  private showStartCalendar: boolean = false; // 发车时间
  private showEndCalendar: boolean = false;

  public beforeRouteEnter(to: any, from: any, next: Function): void {
    // debugger
    to.meta.title = to.query.title;
    next();
  }
  public beforeRouteLeave(to: any, from: any, next: Function): void {
    window.localStorage.removeItem("planInfo");
    next();
  }

  // 天数
  private get duration(): any {
    // debugger
    return (
      getDaysBetween(
        parseTime(this.beginTime, "{y}-{m}-{d}"),
        parseTime(this.endTime, "{y}-{m}-{d}")
      ) || ""
    );
  }
  /**
   *  出差
   *  1出差住宿 2交通席位 3招待住宿
   *
   *  招待
   *  5外事招待派餐 6商务招待派餐 7其他业务招待派餐
   *
   **/

  private get costStandardType(): string {
    let costStandardType: any = "";
    // debugger
    const { applyType, divType } = this;
    // debugger
    if (applyType === "0") {
      switch (divType) {
        case "1":
        case "2":
          costStandardType = 2;
          break;
        case "3":
          costStandardType = 1;
          break;
      }
    }
    if (applyType === "1") {
      switch (divType) {
        // case '1':
        // case '2':
        //   costStandardType = 2
        // break
        case "3":
          costStandardType = 3;
          break;
        case "6":
          costStandardType = this.serveType;
          break;
      }
    }
    return costStandardType;
  }
  // 获取费用标准相关
  private get isGetCostStandard(): object {
    const { beginTime, endTime, province, city, area } = this;
    return {
      beginTime,
      endTime,
      province,
      city,
      area
    };
  }

  // 预计金额
  private get standardCost(): number {
    let standardCost: number = 0;
    const { empNum, divType } = this;
    // debugger
    if (divType === "3" || divType === "5" || divType === "4") {
      standardCost = this.basicCostStandard * empNum * this.duration;
    }
    if (divType === "6") {
      standardCost = this.basicCostStandard * (this.visitorNum + this.mealNum);
    }

    return standardCost;
  }
  private get timer(): object {
    const { beginTime, endTime } = this;
    return {
      beginTime,
      endTime
    };
  }

  // 监听日期变化
  @Watch("timer")
  watchTimer({ beginTime, endTime }: any, oval: any): void {
    var startDate = Date.parse(beginTime);
    var endDate = Date.parse(endTime);
    if (startDate > endDate) {
      this.endTime = "";
      this.$toast("结束时间不能早于开始时间");
      return;
    }
    if (this.planInfo.divType === "3") {
      this.beginTime = beginTime;
      this.endTime = endTime;
    }
    // console.log('channge', nval, oval)
  }
  //
  @Watch("duration")
  watchDuration(n: string, o: string): void {
    this.stayDay = n;
  }
  // 监听
  @Watch("isGetCostStandard")
  wIsGetCostStandard(newVal: object, oldVal: object): void {
    console.log("newVal", newVal);
    const { beginTime: startTime, endTime, province, city, area }: any = newVal;
    const { applyNo, costStandardType } = this;
    if (Object.values(newVal).every(i => i !== "")) {
      const params = {
        province,
        city,
        area,
        startTime,
        endTime,
        applyNo,
        costStandardType
      };
      console.log("params", params);
      // debugger
      // 获取费用标准
      !this.isSearch && this.getCostStandard(params);
    }
  }

  public mounted(): void {
    const {
      id,
      tid,
      title,
      type,
      applyNo,
      divType,
      applyType
    }: any = this.$route.query;

    this.id = id;
    this.tid = tid;

    this.applyType = applyType;
    // debugger
    this.divType = divType; //  判断该交通输入哪种类型 (1、火车  2、飞机  3、住宿   4、市内交通  5、派餐补助   6、派餐)
    // 派餐
    divType === "6" && (this.serveType = this.$route.query.serveType);
    this.title = title;

    this.type = type;
    this.applyNo = applyNo;

    console.log("分类", this.type);

    this.init();
  }

  // 初始化
  public init(): void {
    // 上一页item数据
    const planInfo: any = window.localStorage.getItem("planInfo");
    if (planInfo) {
      this.planInfo = JSON.parse(planInfo);

      this.getSearchData(this.divType);

      console.log("这是传的参数planInfo", JSON.parse(planInfo));
    }

    getAreaData().then(res => {
      this.areaList = res.data;
      // console.log(this.areaList)
    });

    // debugger

    // 2、市内交通费 3、伙食补助费 不可修改
    if (
      this.divType === "4" ||
      this.divType === "5" ||
      this.$route.query.status !== "0"
    ) {
      this.isSearch = true;
      return;
    }

    this.divType === "6" && this.getMealCostStandard();

    // debugger
    (this.divType === "1" || this.divType === "2") && this.getDicts();
  }

  // 获取餐补标准
  public getMealCostStandard(): void {
    const { applyNo, costStandardType } = this;

    this.getCostStandard({
      applyNo,
      costStandardType
    });
  }
  // 获取交通工具
  public async getDicts() {
    const { applyNo, costStandardType } = this;
    // 1、火车  2、飞机    获取交通工具
    const result = await getDicts("sys_trip_mode");
    console.log(result);

    // this.tripValue = result.data[0].dictLabel
    // this.tripType = result.data[0].dictValue

    result.data.forEach(({ dictLabel: name, dictValue: value }: any) => {
      this.tripList.push({
        name,
        value
      });
    });
    // debugger

    this.getCostStandard({
      applyNo,
      costStandardType
    });
  }

  // 获取费用标准
  public getCostStandard(params: object): void {
    getCostStandard(params).then(res => {
      console.log("getCostStandard", res);
      if (this.divType === "3" || this.divType === "6") {
        this.basicCostStandard = res.data.basicCostStandard;
      }

      if (this.divType === "1" || this.divType === "2") {
        const [train] = res.data.tripModeList;
        console.log("1");
        this.tripCostStandard = res.data.tripModeList;

        this.getSeatList(train.seatList);
      }
    });
  }
  // 获取席位列表
  public getSeatList(seatList: object[]): void {
    this.tripModeList = [];

    seatList.forEach(({ label: name, value }: any) => {
      this.tripModeList.push({
        name,
        value
      });
    });
  }
  // 获取详情数据 1、火车  2、飞机  3、住宿  6、派餐)
  public getSearchData(divType: string): void {
    const {
      provinceName,
      province,
      cityName,
      city,
      areaName,
      area,
      remark,
      bxFileList
    }: any = this.planInfo;

    this.remark = remark;

    if (divType !== "6") {
      this.provinceName = provinceName;
      this.province = province;
      this.cityName = cityName;
      this.city = city;
      this.areaName = areaName;
      this.area = area;

      bxFileList.forEach(({ filePath, fileName }: any) => {
        // debugger
        this.imageList.push({
          url: filePath,
          fileName
        });
        this.bxFileList.push({
          filePath,
          fileName
        });
      });
    }

    // 交通
    if (divType === "1" || divType === "2") {
      const {
        tripTime,
        tripName,
        tripType,
        beginProvinceName,
        beginProvince,
        beginCityName,
        beginCity,
        beginAreaName,
        beginArea,
        seat,
        seatName,
        budgetCost
      }: any = this.planInfo;

      this.tripValue = tripName;
      this.tripType = tripType;

      this.seatName = seatName;
      this.seat = seat;

      this.beginTime = tripTime;

      this.beginProvinceName = beginProvinceName;
      this.beginProvince = beginProvince;
      this.beginCityName = beginCityName;
      this.beginCity = beginCity;
      this.beginAreaName = beginAreaName;
      this.beginArea = beginArea;

      this.budgetCost = budgetCost;

      console.log(this.planInfo.type);
    } else if (divType === "3") {
      // this.costStandardType =
      // 住宿
      const { standardCost, stayNum, beginTime, endTime }: any = this.planInfo;
      console.log(this.planInfo.type);

      this.empNum = stayNum;
      // debugger

      this.basicCostStandard = standardCost;

      this.beginTime = beginTime;
      this.endTime = endTime;
    } else {
      // debugger
      //  市内交通、伙食 ----》不可修改
      const { beginTime, endTime, standardCost }: any = this.planInfo;

      this.beginTime = beginTime;
      this.endTime = endTime;
      this.basicCostStandard = standardCost;
    }
  }
  // 获取上传图片地址
  public getUrl(): string {
    return "https://api.sdland-sea.com/api-lh-oss/lh-oss/uploadFile";
  }

  // 上传图片
  public uploadFile(fileArr: object[]) {
    let count = 0;

    return new Promise(reslove => {
      fileArr.reduce(async (prev: any, next: any) => {
        await prev;

        return prev.then(async () => {
          const config = {
            headers: { "Content-Type": "multipart/form-data" }
          };
          const formData = new FormData(); // 构造一个 FormData，把后台需要发送的参数添加
          formData.append("file", next.file); // 接口需要传的参数

          try {
            const result = await axios.post(this.getUrl(), formData, config);
            console.log("uploadImage ", result);
            // debugger
            if (result.data.ok) {
              count++;
              this.bxFileList.push({
                filePath: result.data.url,
                fileName: next.file.name
              });
              if (count === fileArr.length) reslove(true);
            } else {
              this.$toast(result.data.msg);
            }
          } catch (e) {
            console.log("errFile: ", e);
          }
        });
      }, Promise.resolve());
    });
  }
  // 上传成功 callback
  public afterRead(data: object[]): void {
    console.log("afterRead", data);
    this.fileList = data;
  }
  // 用户删除图片
  public handleDelete(index: number): void {
    this.bxFileList.splice(index, 1);
  }

  // 展示交通工具
  public showTrip(): void {
    !this.isSearch && (this.isShowTrip = true);
  }
  // 展示发车时间
  public showTripTime(): void {
    !this.isSearch && (this.showStartCalendar = true);
  }
  // 交通工具确认
  public onSelectTrip({ name, value }: any): void {
    const [train, plane]: any = this.tripCostStandard;

    this.tripValue = name;
    this.tripType = value;

    if (value === "1") this.getSeatList(train.seatList);
    else this.getSeatList(plane.seatList);
  }
  // 席位确认
  public onSelectTripSeat({ name, value }: any): void {
    // this.seat = this.tripModeList
    this.seat = value;
    this.seatName = name;
  }
  // 交通工具取消选择
  public onCancel(): void {
    console.log("cancel");
  }

  // beginTime
  public onCalendarStartConfirm(date: string): void {
    this.showStartCalendar = false;
    this.beginTime = `${parseTime(date, "{y}-{m}-{d}")}`;
  }
  // endTime
  public onCalendarEndConfirm(date: string): void {
    this.showEndCalendar = false;
    this.endTime = `${parseTime(date, "{y}-{m}-{d}")}`;
  }

  // 展示城市列表
  public handleShowCityClick(flag: string): void {
    if (this.isSearch) return;
    this.isBeginCity = flag === "begin";

    this.showCity = true;
  }

  // 修改城市
  public onCityConfirm(values: object[]): void {
    console.log("修改城市", values);

    const [province, city, area]: any = values;

    if (!this.isBeginCity) {
      this.provinceName = province.name;
      this.province = province.code;
      this.cityName = city.name;
      this.city = city.code;
      this.areaName = area.name;
      this.area = area.code;
    } else {
      this.beginProvinceName = province.name;
      this.beginProvince = province.code;
      this.beginCityName = city.name;
      this.beginCity = city.code;
      this.beginAreaName = area.name;
      this.beginArea = area.code;
    }

    this.showCity = false;
  }
  // 获取参数
  public getSubParams(divType: string): object {
    const {
      id: applyId,
      tid,
      applyType: type,
      province,
      city,
      area,
      bxFileList,
      remark
    } = this;
    const common = {
      tid,
      applyId,
      type,
      province,
      city,
      area,
      bxFileList,
      isDel: "0",
      remark
    };
    // debugger

    if (divType === "6") {
      const {
        visitorNum,
        mealNum,
        basicCostStandard: standardMeal,
        duration: stayDay,
        empNum: stayNum,
        standardCost: costMoney,
        beginTime: mealTime
      } = this;

      return {
        serveId: tid,
        applyId,
        stayDay,
        stayNum,
        mealTime, //
        mealNum,
        visitorNum,
        standardMeal,
        costMoney,
        isDel: "0",
        bxFileList,
        remark
      };
    }

    if (divType === "3") {
      const {
        basicCostStandard: stayStandard,
        duration: stayDay,
        empNum: stayNum,
        standardCost,
        beginTime,
        endTime
      } = this;

      const { zid }: any = this.planInfo;
      return {
        zid,
        stayStandard,
        stayDay,
        stayNum,
        standardCost,
        beginTime,
        endTime,
        ...common
      };
    }
    if (divType === "1" || divType === "2") {
      const { hid }: any = this.planInfo;
      const {
        tripType,
        beginTime: tripTime,
        seat,
        budgetCost,
        beginProvince,
        beginCity,
        beginArea
      } = this;
      return {
        hid,
        tripType,
        tripTime,
        seat,
        budgetCost,
        beginProvince,
        beginCity,
        beginArea,
        ...common
      };
    }
    return {};
  }

  // 提交
  public async submit() {
    const { divType } = this;
    const params = this.getSubParams(divType);

    console.log("sub", JSON.stringify(params));

    let result: any;

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
      this.$router.go(-1);
    } else {
      this.$toast(result.msg);
    }
  }
  // 提交修改/保存
  public onSubmit(values: object[]): void {
    if (this.fileList.length > 0)
      this.uploadFile(this.fileList).then(() => this.submit());
    else this.submit();
    // console.log('submit', values)
  }
}
</script>

<style lang="scss" scoped>
.travelPlan {
  box-sizing: border-box;
  padding-bottom: 70px;
  .label {
    margin: 10px 0;
  }
  .remark {
    margin-top: 10px;
  }
  .btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 10px 20px;
    background-color: #fff;
  }
  .upload {
    padding-left: 10px;
    background-color: #fff;
  }
}
.content {
  ::v-deep {
    .van-field__control {
      text-align: right;
    }
    .van-stepper--round .van-stepper__minus,
    .van-stepper--round .van-stepper__plus {
      border-radius: 5px;
      background-color: #4e6ef2;
    }
    .van-stepper--round .van-stepper__minus {
      color: #4e6ef2;
      background-color: #fff;
      border: 1px solid #4e6ef2;
    }
  }
}
</style>
