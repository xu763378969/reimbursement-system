<template>
  <div class="container">
    <van-tabs
      v-model="active"
      swipeable
      animated
      @click="handleTabClick"
      title-active-color="#fff"
      title-inactive-color="#fff"
      background="#4E6EF2"
    >
      <van-pull-refresh
        v-model="isLoading"
        success-text="刷新成功"
        style="min-height: 100vh;width:100vw"
        @refresh="onRefresh"
      >
        <van-tab title="事前申请" name="trip">
          <div class="header">
            <div class="title">申请表单</div>
            <div class="content">
              <div class="item" v-for="item in dataResult" :key="item.id" @click="goDetial(item)">
                <div class="item-t">
                  <div class="label-info">
                    <i class="img" :class="item.icon"></i>
                    <div class="info-box">
                      <div class="tltle">
                        {{ item.title }}
                      </div>
                      <div class="date">
                        {{ item.createTime | unixToDate('yyyy-MM-dd') }}
                      </div>
                    </div>
                  </div>
                  <div class="note">备注：{{ item.remark }}</div>
                </div>
                <!-- <div class="item-b">
                <span>撤回</span>
              </div> -->
                <div class="flag" :style="{ color: item.color }">
                  {{ item.statusName }}
                </div>
                <div class="price">
                  CNY <span class="active">{{ item.costMoney | NumFormat() }}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="报销申请" name="reimbursement"> </van-tab>
      </van-pull-refresh>
    </van-tabs>
  </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Tab, Tabs,PullRefresh } from "vant";
import dayjs from "dayjs";

import {getApplyList} from"@/api/home"

interface tabState {
  id: number;
  name: string;
  title: string;
}

@Component({
  name: "ApplyList",
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [PullRefresh.name]: PullRefresh,
  }
})
export default class ApplyList extends Vue {

  public titleArr: tabState[] = [
    {
      id: 1,
      name: "trip",
      title: "事前申请"
    },
    {
      id: 2,
      name: "reimbursement",
      title: "报销申请"
    }
  ];
  public active: string = "";
  public isLoading: boolean = false;
  public dataResult: object[] = [];

  public handleTabClick(name: string, title: string): void {
    console.log(name, title);
  }
  mounted() {
    this.getApplyList()
  }
    // go item detial
    goDetial(item:any) {
      console.log(item)
      const query:any = {
        id: item.id,
        isDel: item.isDel,
        type: item.applyType
      }
      if (item.status !== '0') {
        query.isSearch = true
      }
      this.$router.push({
        name: 'Approval',
        query
      })
      // this.$router.push({
      //   name: 'TravelApproval',
      //   query: {
      //     type: 'search',
      //     id,
      //     isDel
      //   }
      // })
    }
  getApplyList() {
    const params = { isDel: 0 }

    getApplyList(params).then(res => {
      console.log(JSON.stringify(res.data))
      res.data.map((item:any) => {
        item.icon = item.applyType === '0' ? 'icon_travel' : 'icon_entertain'
        item.color = item.status === '0' ? '#F9771D' : item.status === '1' ? '#4E6EF2' : '#25B84C'
      })
      this.dataResult = res.data
    })
  }
  onRefresh() {
    setTimeout(() => {
      console.log('refresh')
      this.getApplyList()
      this.isLoading = false
    }, 1000)
  }

}
</script>

<style lang="scss">
.container {
  border: none !important;
  width: 100%;
  height: 100%;
  background-color: #f1f1f1;
  .header {
    .title {
      line-height: 40px;
      background-color: #fff;
      margin: 5px 0;
      box-sizing: border-box;
      padding: 0 12px;
    }
    .content {
      .item {
        box-sizing: border-box;
        padding: 0 12px;
        height: 100px;
        background-color: #fff;
        position: relative;
        margin: 6px 0;
        .item-t {
          .label-info {
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
            .tltle {
              font-size: 12px;
              color: #333333;
            }
            .img {
              width: 18px;
              height: 19px;
              background-size: 18px 19px;
              background-repeat: no-repeat;
            }
            .icon_travel {
              @include bg-image('~@/assets/images/home/icon_travel');
            }
            .icon_entertain {
              @include bg-image('~@/assets/images/home/icon_entertain');
            }
            .icon_expense {
              @include bg-image('~@/assets/images/home/icon_expense');
            }
            .icon_consumption {
              @include bg-image('~@/assets/images/home/icon_consumption');
            }
            .info-box {
              margin-left: 5px;
            }
            .date {
              font-size: 11px;
              color: #595959;
            }
          }
          .note {
            color: #a6a6a6;
            font-size: 11px;
            @include textoverflow();
          }
        }
        .item-b {
        }
        .flag {
          position: absolute;
          top: 10px;
          right: 10px;
        }
        .price {
          position: absolute;
          bottom: 5px;
          right: 10px;
          color: #4e6ef2;
          font-weight: 800;
          .active {
            font-size: 18px;
          }
        }
      }
    }
  }

  ::v-deep {
    .van-tabs__line {
      background-color: #ffffff;
    }
    .van-pull-refresh {
      overflow-y: auto;
    }
    .van-tabs__content--animated {
      overflow-y: auto;
    }
    .van-hairline--top-bottom::after,
    .van-hairline-unset--top-bottom::after {
      border: none;
    }
  }
}
</style>
