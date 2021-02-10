<template>
  <div id="NavBar">
    <van-nav-bar
      :title="title"
      :left-arrow="isleftarrow"
      :left-text="leftText"
      :right-text="rightText"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      safe-area-inset-top
    >
      <template #right>
        <slot name="rightIcon"></slot>
      </template>
    </van-nav-bar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { NavBar } from "vant";

@Component({
  name: "NavBar",
  components: {
    [NavBar.name]: NavBar
  }
})
export default class extends Vue {
  @Prop() title: string;
  @Prop() leftText: string;
  @Prop() rightText: string;
  @Prop() isleftarrow: boolean;

  public onClickLeft(): void {
    this.$emit("onClickLeft");
  }
  public onClickRight(): void {
    this.$emit("onClickRight");
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .van-nav-bar {
    background-color: $themeColor;
    .van-nav-bar__title {
      color: #ffffff;
    }
  }
  .van-hairline--bottom::after {
    border: none;
  }
  .van-nav-bar .van-icon {
    color: #ffffff;
  }
}
</style>
