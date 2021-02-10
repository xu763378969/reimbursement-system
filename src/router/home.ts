export default [
  {
    path: "/applyList",
    name: "ApplyList",
    component: () =>
      import(
        /* webpackChunkName: "ApplyList" */ "views/home/applyList/index.vue"
      ),
    meta: {
      auth: true,
      title: "申请表单",
      keepAlive: false
    }
  },
  {
    path: "/travel",
    name: "Travel",
    component: () =>
      import(/* webpackChunkName: "Travel" */ "views/home/apply/Travel.vue"),
    meta: {
      auth: true,
      title: "差旅申请",
      keepAlive: true
    }
  },
  {
    path: "/entertain",
    name: "Entertain",
    component: () =>
      import(
        /* webpackChunkName: "Entertain" */ "views/home/apply/Entertain/index.vue"
      ),
    meta: {
      auth: true,
      title: "招待申请",
      keepAlive: false
    }
  },
  {
    path: "/expense",
    name: "Expense",
    component: () =>
      import(
        /* webpackChunkName: "Expense" */ "views/home/apply/Expense/index.vue"
      ),
    meta: {
      auth: true,
      title: "报销申请",
      keepAlive: false
    }
  },
  {
    path: "/approval",
    name: "Approval",
    component: () =>
      import(
        /* webpackChunkName: "Approval" */ "views/home/apply/Approval/index.vue"
      ),
    meta: {
      auth: true,
      title: "事前审批单",
      keepAlive: false
    }
  },
  {
    path: "/travelPlan",
    name: "TravelPlan",
    component: () =>
      import(
        /* webpackChunkName: "TravelPlan" */ "views/home/apply/TravelPlan/index.vue"
      ),
    meta: {
      auth: true,
      title: "",
      keepAlive: false
    }
  },
  {
    path: "/expenseDetail",
    name: "ExpenseDetail",
    component: () =>
      import(
        /* webpackChunkName: "ExpenseDetail" */ "views/home/apply/Expense/detail.vue"
      ),
    meta: {
      auth: true,
      title: "报销详情",
      keepAlive: false
    }
  },
  {
    path: "/consumptionRecords",
    name: "ConsumptionRecords",
    component: () =>
      import(
        /* webpackChunkName: "consumptionRecords" */ "views/home/consumptionRecords/index.vue"
      ),
    meta: {
      auth: true,
      title: "消费记录",
      keepAlive: false
    }
  },
  {
    path: "/invoiceDetails",
    name: "InvoiceDetails",
    component: () =>
      import(
        /* webpackChunkName: "consumptionRecords" */ "views/home/consumptionRecords/InvoiceDetails.vue"
      ),
    meta: {
      auth: true,
      title: "发票详情",
      keepAlive: false
    }
  }
];
