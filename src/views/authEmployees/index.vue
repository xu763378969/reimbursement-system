<template>
  <div class="AuthEmployees"></div>
</template>

<script lang="ts">
import { getQueryVariable } from "@/utils";

import { Component, Vue } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";

@Component({
  name: "AuthEmployees"
})
export default class AuthEmployees extends Vue {
  public beforeRouteEnter(to: object, from: object, next: Function) {
    const code = getQueryVariable("code");
    console.log("code", code);

    if (code) {
      next((vm: Vue) => {
        UserModule.AUTH_LOGIN(code).then((res: any) => {
          console.log("relove", res.token);
          if (res.token !== null) {
            // UserModule.SET_TOKEN(res.token)
            console.log("SET_TOKEN: ok");
            vm.$router.replace({
              name: "Home"
            });
            return;
          }
          vm.$router.replace({
            name: "AccountAuthorization",
            query: {
              keyword: res.userName,
              userId: res.userId
            }
          });
        });
      });
      return;
    }
  }
}
</script>

<style lang="scss" scoped></style>
