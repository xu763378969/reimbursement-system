<template>
  <div class="layout-container">
    <!-- <NavBar v-show="navShow" :title="title" :isleftarrow="isLeftArrow">
    </NavBar> -->
    <transition :name="transitionName">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view class="layout-content"></router-view>
      </keep-alive>
      <router-view class="layout-content" v-else></router-view>
    </transition>
    <footer-tabbar v-if="showTabbar" />
  </div>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator"
import defaultSetting from "@/settings"
import FooterTabbar from "components/FooterTabbar.vue"
import NavBar from "components/NavBar.vue"

import { Route } from "vue-router"

@Component({
  name: "Layout",
  components: {
    FooterTabbar,
    NavBar
  }
})
export default class extends Vue {
  private transitionName = ""
  private navShow = true
  private isLeftArrow: boolean = false
  public title: string = "首页"
  public isShowSpace: string[] = ["/home", "/mine"]
  public showTabbar: boolean = false

  @Watch("$route", {
    immediate: false
  })
  private changeDir(to: Route, from: Route) {
    if (defaultSetting.layoutNeedPageTrans) {
      const toIndex = to.meta.tabIndex
      const fromIndex = from.meta.tabIndex

      this.showTabbar = this.isShowSpace.includes(to.path)
      this.title = to.meta.title
      this.isLeftArrow = to.meta.isLeftArrow
      this.transitionName = toIndex > fromIndex ? "forward" : "back"
    }
  }

  mounted() {
    // 初始化tab
    this.showTabbar = this.isShowSpace.includes(this.$route.path)
    this.title = this.$route.meta.title
    this.isLeftArrow = this.$route.meta.isLeftArrow
  }
}
</script>
<style lang="scss" scoped>
.layout-content {
  // background-color: #fff;
  // height: calc(100% - 50px) !important;
}
</style>
