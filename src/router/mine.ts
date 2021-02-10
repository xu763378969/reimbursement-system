export default [
  {
    path: "/bankCard",
    name: "BankCard",
    component: () =>
      import(/* webpackChunkName: "bankCard" */ "views/mine/BankCard.vue"),
    meta: {
      title: "银行卡"
    }
  },
  {
    path: "/addBankCard",
    name: "AddBankCard",
    component: () =>
      import(
        /* webpackChunkName: "addBankCard" */ "views/mine/AddBankCard.vue"
      ),
    meta: {
      title: "添加银行卡"
    }
  },
  {
    path: "/bindAddress",
    name: "BindAddress",
    component: () =>
      import(
        /* webpackChunkName: "bindAddress" */ "views/mine/BindAddress.vue"
      ),
    meta: {
      title: "绑定地址"
    }
  }
];
