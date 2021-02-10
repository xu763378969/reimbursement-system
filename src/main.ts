import Vue from "vue";
import "lib-flexible";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import * as filters from "@/filters";
import "utils/permission";
import SvgIcon from "@/components/SvgIcon.vue";
import NavBar from "@/components/NavBar.vue";

const FastClick = require("fastclick");

import "@/icons"; // icon
import "@/style/common.scss";
import "vant/lib/index.less";
import { Lazyload } from "vant";
import defaultSettings from "@/settings";

// 全局引入按需引入UI库 vant
import "@/plugins/vant";

// options 为可选参数，无则不传
Vue.use(Lazyload);

Vue.component("svg-icon", SvgIcon);
Vue.component("NavBar", NavBar);

if (process.env.NODE_ENV === "development" && defaultSettings.vconsole) {
  const VConsole = require("vconsole");
  new VConsole();
}

FastClick.attach(document.body);

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, (filters as { [key: string]: Function })[key]);
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
