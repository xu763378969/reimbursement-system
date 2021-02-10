<template>
  <div class="travelPlan">
    <PlanTemplate
      @cell-click="cellClick(index)"
      @before-close="beforeClose(instance, index)"
      v-for="(item, index) in dataArr"
      :key="item.id"
    >
      <div slot="left">
        <div class="left">
          <van-image
            width="18"
            height="10"
            fit="contain"
            :src="
              require(`@/assets/images/travelApproval/${
                item.divType === '1'
                  ? 'icon_railway'
                  : item.divType === '2'
                  ? 'icon_plane'
                  : item.divType === '3'
                  ? 'icon_hotel'
                  : item.divType === '4'
                  ? 'icon_taxi'
                  : 'icon_soup'
              }@2x.png`)
            "
          />
          <div class="title-box">
            <div class="title">{{ showTypeStr(item.divType) }}</div>
            <div class="time">
              {{
                item.divType === "1" || item.divType === "2"
                  ? item.tripTime
                  : item.divType === "3"
                  ? item.stayTime
                  : item.beginTime
              }}
            </div>
            <div class="" v-if="item.fileCount > 0">
              <span class="pic">
                <van-image
                  width="10"
                  height="9"
                  fit="contain"
                  :src="
                    require('@/assets/images/travelApproval/icon_photo@2x.png')
                  "
                />
                {{ item.fileCount }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="right" slot="right">
        CNY
        <span class="price">{{
          item.divType === "1" || item.divType === "2"
            ? item.budgetCost
            : item.divType === "3"
            ? item.standardCost
            : item.costMoney
        }}</span>
      </div>
      <div slot="rightAction">
        <van-button
          class="del"
          v-if="item.divType !== '4' && item.divType !== '5'"
          xsquare
          type="danger"
          text="删除"
          @click="handleDelete(index)"
        />
      </div>
    </PlanTemplate>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import PlanTemplate from "@/components/PlanTemplate.vue";

@Component({
  name: "TravelPlan",
  components: {
    [PlanTemplate.name]: PlanTemplate
  }
})
export default class TravelPlan extends Vue {
  @Prop({ default: () => {} }) resultData: object[];
  @Prop({ default: "" }) type: string;
  private dataArr: object[] = [];

  @Watch("resultData", { deep: true })
  watchResultData(n: any, o: any) {
    // debugger
    // console.log('这是子页面拿到的数据', n)
    let arr = [];
    if (this.type === "0") {
      arr = [...n.bxApplyCostOtherList, ...n.bxApplyTrafficList];
    } else {
      arr = [...n.bxApplyMealList];
    }

    this.dataArr = arr.concat([...n.bxApplyStayList]);
    // debugger
    console.log(JSON.stringify(this.dataArr));
  }
  @Emit()
  cellClick(index: number) {
    // debugger;
    this.emitCellClick(index);
  }
  @Emit()
  emitCellClick(index: number) {
    return this.dataArr[index];
  }
  @Emit()
  handleDelete(index: number) {
    return this.dataArr[index];
  }
  public isEmpty(obj: any): boolean {
    return (
      !Object.getOwnPropertyNames(obj).length &&
      !Object.getOwnPropertySymbols(obj).length
    );
  }
  public showTypeStr(type: any) {
    let str = "";
    switch (Number(type)) {
      case 1:
        str = "火车";
        break;
      case 2:
        str = "飞机";
        break;
      case 3:
        str = "住宿";
        break;
      case 4:
        str = "市内交通";
        break;
      case 5:
        str = "派餐补助";
        break;
      case 6:
        str = "派餐";
        break;
    }
    return str;
  }
}
</script>

<style lang="scss" scoped>
.travelPlan {
  width: 100%;
  height: 100%;
  overflow: hidden;

  background-color: #fff;
}
.del {
  height: 100%;
}

.left {
  display: flex;
  align-items: center;
  line-height: 20px;
  .title-box {
    margin-left: 8px;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    color: #333333;
    .time {
      color: #989898;
      font-size: 10px;
    }
  }
}
.right {
  color: #f9771d;
  .price {
    font-size: 24px;
  }
}
</style>
