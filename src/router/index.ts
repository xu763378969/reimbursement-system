import Vue from "vue";
import Router from "vue-router";
import Home from "views/home/index.vue";
import Layout from "@/layout/index.vue";
import { AppModule } from "@/store/modules/app";

Vue.use(Router);

let routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    meta: {
      auth: true,
      title: "",
      tabIndex: 0
    },
    children: [
      {
        path: "/home",
        name: "Home",
        component: Home,
        meta: {
          auth: true,
          title: "首页",
          keepAlive: false,
          tabIndex: 1
        }
      },
      {
        path: "/mine",
        name: "Mine",
        component: () =>
          import(/* webpackChunkName: "mine" */ "views/mine/index.vue"),
        meta: {
          auth: true,
          title: "我的",
          keepAlive: false,
          tabIndex: 2
        }
      },
      {
        path: "/contact",
        name: "Contact",
        component: () =>
          import(/* webpackChunkName: "contact" */ "views/contact/index.vue"),
        meta: {
          auth: false,
          title: "联系人",
          keepAlive: false
        }
      }
    ]
  },
  {
    path: "/404",
    name: "page404",
    component: () =>
      import(/* webpackChunkName: "page404" */ "views/page404.vue"),
    meta: {
      title: "404",
      keepAlive: true
    }
  }
];

const routerContext = require.context("./", true, /\.ts$/);
routerContext.keys().forEach((route: string) => {
  // 如果是根目录的 index.js 、不处理
  if (route.startsWith("./index")) {
    return;
  }
  const routerModule = routerContext(route);
  /**
   * 兼容 import export 和 require module.export 两种规范
   */
  routes = routes.concat(routerModule.default || routerModule);
});

const createRouter = () =>
  new Router({
    mode: "history", // require service support
    base: process.env.BASE_URL,
    // scrollBehavior: () => ({ y: 0 }),
    routes
  });

const myRouter = createRouter();

const history = window.sessionStorage;
history.clear();
let historyCount = Number(history.getItem("count")) || 0;
history.setItem("/", 0 + "");

myRouter.beforeEach((to, from, next) => {
  if (to.params.direction) {
    AppModule.updateDirection(to.params.direction);
  } else {
    const toIndex = history.getItem(to.path);
    const fromIndex = history.getItem(from.path);
    // 判断并记录跳转页面是否访问过，以此判断跳转过渡方式
    if (toIndex) {
      if (
        !fromIndex ||
        parseInt(toIndex, 10) > parseInt(fromIndex, 10) ||
        (toIndex === "0" && fromIndex === "0")
      ) {
        AppModule.updateDirection("forward");
      } else {
        AppModule.updateDirection("back");
      }
    } else {
      ++historyCount;
      history.setItem("count", historyCount + "");
      to.path !== "/" && history.setItem(to.path, historyCount + "");
      AppModule.updateDirection("forward");
    }
  }
  next();
});

export function resetRouter() {
  myRouter.replace("/login");
}

export default myRouter;
