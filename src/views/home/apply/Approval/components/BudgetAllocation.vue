<template>
  <div class="budgetAllocation">
    <div v-if="resultData">
      <van-cell center v-for="item in resultData" :key="item.id">
        <template #title>
          <div class="left">
            <van-image
              width="18"
              height="10"
              fit="contain"
              :src="require('@/assets/images/travelApproval/icon_plane@2x.png')"
            />
            <div class="title-box">
              <div class="title">分摊部门：{{ item.deptName }}</div>
              <div class="time">分摊比例：{{ item.proportion }}%</div>
            </div>
          </div>
        </template>
        <template #default>
          <div class="right">
            <div class="info">分摊额度</div>
            <div>
              CNY <span class="price">{{ item.consume | NumFormat() }}</span>
            </div>
          </div>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  name: "BudgetAllocation"
})
export default class BudgetAllocation extends Vue {
  @Prop({ default: () => [] }) resultData: object[];
  public mounted() {
    this.$nextTick(() => {
      console.log(this.resultData);
    });
  }
}
</script>

<style lang="scss" scoped>
.budgetAllocation {
  width: 100%;
  height: 100%;
  overflow: hidden;

  background-color: #fff;
}
.btn {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px 20px;
  background-color: #fff;
  border-bottom: 1px solid #ebedf0;
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
  color: #4e6ef2;
  .price {
    font-size: 24px;
  }
  .info {
    color: #989898;
    font-size: 10px;
  }
}
</style>
