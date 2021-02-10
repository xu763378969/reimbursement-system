<template>
  <div class="workflow">
    <div class="title">审批流程</div>
    <van-steps
      direction="vertical"
      :active="approvalInfo[0].approverStep"
      inactive-color="#323233"
    >
      <van-step
        v-for="(item, index) in approvalInfo[0].nodeList"
        :key="item.id"
      >
        <div class="box">
          <van-image
            width="30"
            height="30"
            :src="item.nodeItemList[0].itemImage"
          />
          <span class="name">{{ item.nodeItemList[0].itemName }}</span>
          <span v-if="approvalInfo[0].approverStep >= index"
            >({{
              item.nodeItemList[0].itemStatus === 1
                ? "审批中"
                : item.nodeItemList[0].itemStatus === 2
                ? "已通过"
                : item.nodeItemList[0].itemStatus === 3
                ? "已驳回"
                : "已取消"
            }})</span
          >
        </div>
      </van-step>
    </van-steps>
    <div class="img" v-if="approvalInfo.length <= 0">
      <van-image
        width="225"
        height="225"
        fit="contain"
        :src="require('@/assets/images/travelApproval/icon_workflow@2x.png')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { getApprovalInfo } from "@/api/common";

import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  name: "Workflow"
})
export default class Workflow extends Vue {
  @Prop({ default: "" }) applyNo: string;
  private approvalInfo: object[] = [];
  public mounted(): void {
    // debugger
    this.$nextTick(() => {
      console.log("v", this.applyNo);
      getApprovalInfo({
        applyNo: this.applyNo
      }).then(res => {
        console.log(res);
        this.approvalInfo = res.data;
      });
    });
  }
}
</script>

<style lang="scss" scoped>
.workflow {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  .title {
    margin-left: 12px;
    line-height: 38px;
    font-size: 12px;
    color: #989898;
  }
}
.box {
  margin-left: 10px;
  display: flex;
  align-items: center;
  // color: #989898;
  .name {
    margin: 0 8px;
  }
}
.img {
  width: 225px;
  margin: 50px auto 0;
}
</style>
