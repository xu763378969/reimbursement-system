<template>
  <div id="expense">
    <van-cell-group class="margin">
      <van-field
        v-model="value"
        label="标题"
        input-align="right"
        placeholder="请输入标题"
      />
      <van-cell is-link title="提交人" value="内容" />
      <van-cell
        is-link
        title="招待时间"
        :value="visitorTime"
        @click="showStartCalendar = true"
      />
      <van-calendar
        v-model="showStartCalendar"
        color="#1989fa"
        @confirm="onCalendarStartConfirm"
      />
      <van-cell title="报销费用">
        <template #default>
          <span class="price">￥3233</span>
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group class="margin">
      <van-cell is-link :border="false" title="关联事前申请单" />
      <div class="box">
        <div class="item" v-for="(item, index) in data" :key="index">
          <span>{{ item.title }}</span>
          <van-icon
            class="icon"
            name="delete-o"
            @click="handleRemoveItem(index)"
          />
        </div>
      </div>
    </van-cell-group>
    <div class=" margin">
      <van-cell title="备注" />
      <van-field
        name="remark"
        v-model="remark"
        autosize
        type="textarea"
        placeholder="请添加报销说明"
      />
    </div>
    <div class="bottom margin">
      <van-tabs
        v-model="active"
        animated
        swipeable
        title-active-color="#4E6EF2"
      >
        <van-tab title="费用分摊">
          <div class="btn">
            <van-button
              icon="add-o"
              size="small"
              block
              plain
              type="info"
              @click="addPlan"
              >添加票据关联</van-button
            >
          </div>
          <div class="plan">
            <van-collapse v-model="activeNames">
              <van-collapse-item
                title="青港物流>技术部>技术一部"
                value="￥1,600"
                name="1"
              >
                <div class="item" @click="goDetail">
                  <div class="left">
                    <div class="img">
                      <!-- <SvgIcon icon-class="Shape" /> -->
                      <svg-icon icon-class="Shape" /
                    </div>
                    <div class="info">
                      <div class="name">张三（132565488）</div>
                      <div>2</div>
                    </div>
                  </div>
                  <div class="right">
                    <span
                      >￥
                      <span class="price">23223</span>
                    </span>
                  </div>
                </div>
              </van-collapse-item>
              <van-collapse-item
                title="青港物流>财务部"
                value="￥1,600"
                name="2"
                >内容</van-collapse-item
              >
            </van-collapse>
          </div>
        </van-tab>
        <van-tab title="工作流">内容 2</van-tab>
        <!-- <van-tab disabled></van-tab>
        <van-tab disabled></van-tab> -->
      </van-tabs>
      <div class="footer">
        <van-button type="default" class="save">保存</van-button>
        <van-button type="info" class="sub">提交</van-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { parseTime } from "@/utils";
import {
  Cell,
  CellGroup,
  Field,
  Button,
  Icon,
  Tab,
  Tabs,
  Collapse,
  CollapseItem,
  Calendar
} from "vant";

import { Component, Vue } from "vue-property-decorator";
@Component({
  name: "Expense",
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Calendar.name]: Calendar,
    [Icon.name]: Icon,
    [Button.name]: Button
    // [SvgIcon.name]: SvgIcon
  }
})
export default class Expense extends Vue {
  private active: number = 0;
  private activeNames: Array<string> = ["1"];
  private value: string = "";
  private visitorTime: string = "";
  private remark: string = "";
  private showStartCalendar: boolean = false;
  private data: Array<object> = [
    {
      title: " 2020/12/13 济南出差申请"
    }
  ];

  // 时间确认
  onCalendarStartConfirm(date: any) {
    this.showStartCalendar = false;
    this.visitorTime = `${parseTime(date, "{y}-{m}-{d}")}`;
  }
  handleRemoveItem(index: any) {
    console.log("handleRemoveItem");
  }
  addPlan() {
    console.log("addPlan");
  }
  goDetail() {
    this.$router.push({
      name: "ExpenseDetail"
    });
  }
}
</script>

<style lang="scss">
#expense {
  height: 100%;
  background-color: #f1f1f1;
  box-sizing: border-box;
  padding-bottom: 40px;
}
::v-deep {
  .van-tabs__line {
    background-color: #4e6ef2;
  }
}
.margin {
  margin-top: 6px;
}
.box {
  background: #ffffff;
  margin: 0 16px;
  .item {
    display: flex;
    justify-content: space-between;
    line-height: 38px;
    align-items: center;
    span {
      font-size: 13px;
      color: #4e6ef2;
      font-weight: 400;
    }
    .icon {
      font-size: 14px;
      color: #4e6ef2;
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 5px;
      text-align: center;
      background-color: #d8dbfc;
    }
  }

  .remark {
    margin: 6px 0;
  }
}
.bottom {
  ::v-deep {
    .van-cell__title {
      color: #4e6ef2;
    }
    .van-cell__value {
      flex: 0.5;
      color: #4e6ef2;
    }
  }
  .item {
    display: flex;
    align-items: center;
    .left {
      flex: 1;
      color: #333333;
      display: flex;
      align-items: center;
      .img {
        background-color: #4e6ef2;

        .svg-icon {
          background: #fff;
        }
      }
      .info {
        margin-left: 12px;
      }
    }
    .right {
      text-align: right;
      width: 80px;
      color: #f9771d;
      font-size: 10px;
      .price {
        font-size: 16px;
      }
    }
  }
}
.btn {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px 20px;
  background-color: #fff;
  border-bottom: 1px solid #ebedf0;
}
.footer {
  position: fixed;
  z-index: 99999;
  bottom: 0;
  box-shadow: 0px -4px 8px rgba(66, 66, 66, 0.1);
  // box-sizing: border-box;
  // padding: 10px 10px 20px;
  background-color: #fff;
  display: flex;
  width: 100%;
  .save {
    width: 33%;
  }
  .sub {
    flex: 1;
  }
}
</style>
