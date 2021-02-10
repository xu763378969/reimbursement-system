export default [
  {
    path: "/authEmployees",
    name: "AuthEmployees",
    component: () =>
      import(
        /* webpackChunkName: "AuthEmployees" */ "views/authEmployees/index.vue"
      ),
    meta: {
      auth: true,
      title: "",
      keepAlive: false
    }
  }
];
