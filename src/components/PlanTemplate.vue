<template>
  <div class="planTemplate">
    <van-swipe-cell>
      <van-cell center @click="cellClick">
        <template #title>
          <slot name="left"></slot>
        </template>
        <template #default>
          <slot name="right"></slot>
        </template>
      </van-cell>
      <template #right>
        <slot name="rightAction"></slot>
      </template>
    </van-swipe-cell>

    <van-divider
      :style="{
        color: '#ebedf0',
        borderColor: '#ebedf0',
        padding: '0 10px',
        margin: 0
      }"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
@Component({
  name: "PlanTemplate"
})
export default class PlanTemplate extends Vue {
  @Emit()
  public cellClick() {
    // debugger;
    return true;
  }
}
</script>

<style lang="scss" scoped></style>
