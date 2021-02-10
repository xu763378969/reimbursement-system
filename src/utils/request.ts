import axios from "axios";
import { Toast } from "vant";
import { UserModule } from "@/store/modules/user";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
});

const DEFAULT_TOKEN =
  "eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6Ijc5YWY3OGYwLTUzNGQtNGYyMy1iOGNiLTA5MjU5OWRkOGJjYyJ9.fSULUVYYS5vvogR-zzU657E8i-o8g1e-ZSRbs6_q507LG9tvDWdzeJDceTEpt02SFlu7eCrZwFYu7fd70vZ1eQ";

// request interceptor
service.interceptors.request.use(
  config => {
    if (UserModule.token) {
      config.headers["Authorization"] = "Bearer " + UserModule.token; //getToken()
    } else {
      config.headers["Authorization"] = "admin-token";
    }
    config.headers["Authorization"] = "Bearer " + DEFAULT_TOKEN; //getToken()

    return config;
  },
  error => {
    // do something with request error
    console.log(error, "err"); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        // Toast.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        //   confirmButtonText: 'Re-Login',
        //   cancelButtonText: 'Cancel',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('user/resetToken').then(() => {
        //     location.reload()
        //   })
        // })
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  error => {
    console.log("err" + error); // for debug
    Toast.fail({
      message: error.message,
      duration: 1.5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
