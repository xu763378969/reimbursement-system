<template>
  <div class="content">
    <van-cell-group class="margin">
      <van-cell title="报销人员" value="内容" />
      <van-cell title="承担部门" value="visitorTime" />
      <van-cell is-link title="收款账户" value="visitorTime" />
    </van-cell-group>
    <van-cell-group class="margin">
      <van-cell title="伙食补助费" value="232" />
      <van-cell title="市内交通费" value="122" />
      <div class="plan">
        <van-collapse v-model="activeNames">
          <van-collapse-item title="交通费" value="￥1,600" name="1">
            <div class="box">
              <div class="item" v-for="(item, index) in data" :key="index">
                <span>{{ item.title }}</span>
                <van-icon class="icon" name="delete-o" @click="handleRemoveItem(index)" />
              </div>
            </div>
          </van-collapse-item>
          <van-collapse-item title="差旅住宿费" value="￥1,600" name="2">内容</van-collapse-item>
        </van-collapse>
      </div>
    </van-cell-group>
    <div class=" margin">
      <van-cell title="备注" />
      <van-field name="remark" v-model="remark" autosize type="textarea" placeholder="请添加报销说明" />
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

@Component({
  name: "ExpenseDetail"
})
export default class ExpenseDetail extends Vue {
  private activeNames: string[] = ["1"]
  private data: object[] = [
    {
      title: " 2020/12/13 济南出差申请"
    }
  ]
  private remark: string = ""

  handleRemoveItem(index: any) {
    console.log(index)
  }
}
</script>

<style lang="scss" scoped>
.content {
  background-color: #f1f1f1;
}
.margin {
  margin-top: 6px;
}
.box {
  background: #ffffff;
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
</style>
