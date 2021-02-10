<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view class="router"></router-view>
      </keep-alive>
      <router-view class="router" v-else></router-view>
    </transition>
    <service-worker-update-popup />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import defaultSetting from "@/settings";
import ServiceWorkerUpdatePopup from "@/pwa/components/ServiceWorkerUpdatePopup.vue";

@Component({
  name: "App",
  components: {
    ServiceWorkerUpdatePopup
  }
})
export default class extends Vue {
  private isSystemBack: boolean = false;
  get transitionName() {
    if (defaultSetting.needPageTrans && !this.isSystemBack) {
      return this.$store.state.app.direction;
    }
    return "";
  }
  get isIosMoveBack() {
    return this.$store.state.user.isIosMoveBack;
  }

  @Watch("$route")
  routechange(to: any, from: any) {
    let routelink: string = to.path;
  }

  mounted() {
    // getDeviceType函数为判断机型（IOS时返回true)
    if (this.getDeviceType()) {
      //处理原生右边侧滑返回和系统返回键返回的动画效果BUG
      window.addEventListener(
        "popstate",
        () => {
          this.isSystemBack = false;
        },
        false
      );
      document.body.addEventListener(
        "touchmove",
        () => {
          // console.log("touchmove")
          this.isSystemBack = true;
          // this.$store.commit("SET_IsIosMoveBack", true)
        },
        false
      );
    }
  }
  public getDeviceType() {
    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
    if (isiOS) {
      return true;
    } else if (isAndroid) {
      return false;
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: $bgColor;
}

.router {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: absolute;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
