<template>
  <section class="widthSet">
    <div class="header-title">
      {{ $t("swap.swapRecords") }}
      <!-- <div @click="search = true" class="search">
        <svg-icon :icon="'icon-hourglass'" :size="36" :color="isSearchStarus ? '#FEB75E' : '#333'"/>
      </div> -->
    </div>
    <div>
      <div class="list">
        <mt-loadmore
          :topPullText="$t('public.loadingMoreTip1')"
          :topDropText="$t('public.loadingMoreTip2')"
          :topLoadingText="$t('public.loadingMoreTip3')"
          :bottomPullText="$t('public.loadingMoreTip1')"
          :bottomDropText="$t('public.loadingMoreTip2')"
          :bottomLoadingText="$t('public.loadingMoreTip3')"
          :bottom-method="loadBottom"
          :bottom-all-loaded="allLoaded"
          :auto-fill="false"
          ref="loadmore"
        >
          <!-- 没有数据 -->
          <div class="no-data" v-if="!data.length">
            <svg-icon
              :color="$store.state.app.themeColor"
              :icon="'icon-empty'"
              :size="90"
            />
            <div class="notip">{{ $t("public.noData") }}</div>
          </div>
          <div class="item" v-else v-for="item in data" :key="item.id">
            <div class="title">
              <div class="topHead">
                <div class="topHead top">
                  <img :src="url(item.contract0, item.symbol0)"  onerror="this.src='/static/images/eos.png'" alt>
                  {{ item.symbol0 }}
                  <div class="rotateIcon">
                    <svg-icon :icon="'icon-forward'" :size="32" />
                  </div>
                  <img :src="url(item.contract1, item.symbol1)"  onerror="this.src='/static/images/eos.png'" alt>
                  {{ item.symbol1 }}
                </div>
                <div class="topHead bottom">
                  <span class="time">{{
                    toLocalTime(item.blockTime, 16)
                  }}</span>
                </div>
              </div>

              <!-- // c1 进行中 -->
              <div class="c1">
                <span>{{ $t("public.completed") }}</span>
              </div>
            </div>
            <div class="content">
              <div>
                <!-- 支付数量 -->
                <p class="m-title">
                  {{ $t("swap.paymentAmount") }}
                  <span class="eos-chain">({{ item.symbol0 }})</span>
                </p>
                <p>{{ item.quantity0.split(" ")[0] }}</p>
              </div>
              <div>
                <!-- 获得数量 -->
                <p class="m-title">
                  {{ $t("swap.receivedAmount") }}
                  <span class="eos-chain">({{ item.symbol1 }})</span>
                </p>
                <p class="elli">{{ item.quantity1.split(" ")[0] }}</p>
              </div>
            </div>
            <div class="content">
              <div>
                <!-- 手续费 -->
                <p class="m-title">
                  {{ $t("swap.fees") }}
                  <span class="eos-chain">({{ item.symbol0 }})</span>
                </p>
                <p>{{ item.fee.split(" ")[0] }}</p>
              </div>
              <div>
                <!-- 兑换价格 -->
                <p class="m-title">
                  {{ $t("swap.swapPrice") }}
                  <span class="eos-chain"
                    >({{ item.symbol1 }}/{{ item.symbol0 }})</span
                  >
                </p>
                <p class="elli">{{ handleToFixed(item.price, 6) }}</p>
              </div>
            </div>
            <div class="content">
              <div>
                <p class="m-title">TxID:</p>
                <p class="elli elliCls">
                  <a
                    v-if="item.trxId"
                    class="color-theme"
                    @click="handleJump(`https://bloks.io/tx/${item.trxId}`)"
                    >{{ item.trxId }}</a
                  >
                  <span v-else class="color-666">-</span>
                </p>
              </div>
            </div>
          </div>

          <!-- 没有更多记录 -->
          <div class="no-data" v-if="allLoaded && data.length">
            <div class="notip color-999">{{ $t("public.noMore") }}</div>
          </div>
        </mt-loadmore>
      </div>
    </div>
    <!-- 筛选 -->
    <mt-popup v-model="search" position="right" popup-transition="popup-fade">
      <search
        v-if="search"
        :searchData="isSearchStarus"
        @listenSure="handleSearch"
        :type="0"
      />
    </mt-popup>
  </section>
</template>
<script>
import { Popup, Loadmore } from "mint-ui";
import { toLocalTime, coinUrl } from "@/utils/common";
import { toFixed } from "@/utils/decimal";
import Search from "./components/Search"; // 筛选
import api from "@/api";

export default {
  data() {
    return {
      data: [],
      allLoaded: false,
      loading: false,
      page: 1,
      pageSize: 20,
      totalPage: 1,
      direction: 2,
      coin: "BTC",
      search: false, // 筛选
      searchData: null, // 筛选的数据
      isSearchStarus: null, // 是否处于筛选状态
    };
  },
  components: {
    Search,
    "mt-popup": Popup,
    "mt-loadmore": Loadmore,
  },
  props: {},
  created() {},
  mounted() {
    // this.direction = JSON.parse(sessionStorage.getItem('direction')) || 2;
    // this.coin = JSON.parse(sessionStorage.getItem('coin')) || 'BTC';
    this.handleAccLog();
  },
  methods: {
    url(contract, coin) {
      return coinUrl(contract, coin);
    },
    toLocalTime(t, l) {
      return toLocalTime(t, l);
    },
    // 获取账户订单信息
    async handleAccLog(page) {
      const params = {
        symbolIn: "",
        symbolOut: "",
        currPage: page || 1,
        pageSize: 20,
        months: 0,
      };
      if (this.searchData) {
        params.symbolIn = this.searchData.symbolIn;
        params.symbolOut = this.searchData.symbolOut;
        params.months = Number(this.searchData.months);
      }
      let result = await api.swap.swapLog(params);
      if (result.data) {
        result = result.data;
      } else {
        result = [];
      }
      if (page > 1) {
        this.data = [...this.data, ...result];
        this.$forceUpdate();
        if (result.length < params.pageSize) {
          this.allLoaded = true;
        }
        this.$refs.loadmore.onBottomLoaded();
      } else {
        this.data = result || [];
      }
    },
    handleToFixed(val, l) {
      return toFixed(val, l || 8);
    },
    loadBottom() {
      if (this.allLoaded) return;
      this.page += 1;
      this.handleAccLog(this.page);
    },
    // 搜索
    handleSearch(data) {
      this.search = false;
      // 筛选条件为空时 - 退出筛选状态
      if (data.symbolIn === "" && data.symbolOut === "" && data.months === "") {
        this.searchData = null; // 清空查询条件
        this.isSearchStarus = null; // 取消查询状态
        this.handleAccLog(1);
        return;
      }
      this.isSearchStarus = JSON.stringify(data);
      this.searchData = data;
      this.handleAccLog(1);
    },

    handleJump(href) {
      window.location.href = href;
    },
    // 返回上一页
    handleBack() {
      history.back();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/color.scss";
@import "../../assets/css/public.scss";
.widthSet {
  padding: 20px;
  max-width: 750px;
  min-width: 750px;
}

.c0 {
  color: #4a90e2;
  font-size: 25px;
}
.c1 {
  color: #999;
  font-size: 28px;
}
.c2 {
  color: $color-red;
  font-size: 28px;
}
.c3 {
  color: $color-red;
  font-size: 28px;
}
.mr {
  margin-right: 20px !important;
}
.header-title {
  position: relative;
  height: 44px;
  font-size: 32px;
  font-family: PingFang SC;
  font-weight: 600;
  line-height: 60px;
  color: #333333;
  padding-left: 24px;
  margin-bottom: .4rem;
}
.loading {
  display: block;
  width: 30px;
  margin: auto;
  padding: 50px 0px;
}
.no-data {
  text-align: center;
  padding: 30px 0px;

  .notip {
    font-size: 25px;
    color: $color-666;
  }
  .img {
    height: 180px;
    padding-top: 30px;
    padding-bottom: 10px;
  }
}

.list {
  height: calc(100vh - 105px);
  overflow: auto;
  font-size: 30px;
  padding-top: 10px;
}
.item {
  width: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  // height: 336px;
  background: #f5f5f5;
  opacity: 1;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 12px;
  .title {
    // height: 1px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #353442;
    font-size: 28px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.10196078431372549);
    div {
      display: flex;
      align-items: flex-start;
    }
    .time {
      font-size: 21px;
      color: #9b9b9b;
    }
  }
  .topHead {
    display: flex;
    flex-direction: column;
    .top {
      display: flex;
      align-items: center;
      flex-direction: row;
    }
    .bottom {
      padding: 12px 0px;
    }

    img {
      width: 50px;
      margin-right: 8px;
    }

    .rotateIcon {
      margin: 0px 12px;
    }

    .addIcon {
      color: #999;
      margin: 0 10px 5px;
    }

    span {
      font-size: 29px;
    }
  }
  .img {
    width: 42px;
    height: 33px;
    // margin-top: -0.05px;
    margin-right: 10px;
  }
  .iconChain {
    font-size: 25px;
    color: #4a90e2;
    margin: 0 10px;
    transform: rotate(-90deg);
  }
  .eos-chain {
    font-size: 21px;
    color: #9b9b9b;
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 12px 0px;
    div {
      box-sizing: border-box;
      font-size: 30px;
      color: #3a3949;
      overflow: hidden;
      .m-title {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 34px;
        color: #666666;
      }
      a {
        color: $color-theme;
      }
    }
  }
  .elli {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: end;
    &.elliCls {
      color: $color-theme;
    }
  }
}
</style>
