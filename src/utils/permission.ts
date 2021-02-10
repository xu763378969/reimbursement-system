import router from "@/router";
import store from "@/store";
import { Notify } from "vant";
import { getToken, setToken } from "@/utils/auth"; // get token from cookie
import { UserModule } from "@/store/modules/user";
import getPageTitle from "@/utils/get-page-title";
import { getOauthUrl } from "@/api/common";

const whiteList = ["/login", "/register"]; // 白名单列表

setToken(
  "eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjY4NGE5YTk1LWUzMGItNGRiZi05OGE1LTVhNDEzMDZjMDgxYSJ9.62RuhAxRZ4dk_fbApQiSsosy7fZqgXJlFVWaqfK_PJzPkF4lzP2c_kbe5kK2lvMrjICmXsZAF3b_esrcJJ9Gsg"
);

router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  if (UserModule.token || hasToken) {
    if (to.path === "/login") {
      // 已经登录，跳转到首页
      next({ path: "/" });
    } else {
      // 获取用户信息
      // const hasGetUserInfo = UserModule.token && UserModule.name;
      // if (hasGetUserInfo) {
      //   next();
      // } else {
      //   try {
      //     // get user info
      //     await await UserModule.GetUserInfo();
      //     next();
      //   } catch (error) {
      //     // 清除用户信息，退出登录，跳转登录页
      //     UserModule.ResetToken();
      //     Notify({
      //       message: error || "Has Error",
      //       type: "danger"
      //     });
      //     next(`/login?redirect=${to.path}`);
      //   }
      // }
      next();
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单中，无需验证
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`);
      getOauthUrl().then(res => {
        console.log(res);
        // window.location.href = `http://192.168.1.109:9020?code=888`
        window.location.href = res.data;
      });
    }
  }
});
