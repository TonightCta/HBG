<template>
  <div class="my-liquidity">
    <div class="title flex-sb">
      <!-- 您的做市 -->
      <div>{{ $t('swap.yourLiquidity') }}</div>
      <!-- 做市记录 -->
      <div @click="handleToRecord" class="marketrecord">{{ $t('swap.liquidityRecords') }} ></div>
    </div>
    <!-- 列表记录 -->
    <div class="main">
      <div v-if="historyList.length > 0">
        <div class="liquidity-item" v-for="(item, index) in historyList" :key="index">
          <div class="item-title flex-sb">
            <div class="logo flex">
              <img :src="url(item.token0.contract, item.token0.coin)" onerror="this.src='/static/images/eos.png'" alt />
              <span>{{item.token0.coin}}</span>
              <span class="add-icon">+</span>
              <img :src="url(item.token1.contract, item.token1.coin)" onerror="this.src='/static/images/eos.png'" alt />
              <span>{{item.token1.coin}}</span>
            </div>
            <div class="btn flex-sb">
              <!-- 管理 -->
              <!-- <div @click="handleManageMarket(item)">{{ $t('public.administration') }}</div> -->
              <!-- 增加 -->
              <div @click="handleAddMarket(item)">{{ $t('pool.add') }}</div>
              <!-- 减少 -->
              <div @click="handleReduceMarket(item)">{{ $t('pool.sub') }}</div>
            </div>
          </div>
          <!-- 做市占比 -->
          <div class="item-body">
            <div class="flex-sb time">
              <span>{{ $t('pool.liquidityRatio') }}</span>
              <span v-if="Number(item.bili) < 0.01">&lt;&nbsp;0.01%</span>
              <span v-else>{{item.bili}}%</span>
            </div>
            <!-- 当前做市 -->
            <div class="flex-sb time">
              <span>{{ $t('pool.currentLiquidity') }}</span>
              <span>{{item.token0.tokenQuantity}} / {{item.token1.tokenQuantity}}</span>
            </div>
            <!-- 做市本金 -->
            <div class="flex-sb time" v-if="testShow">
              <span class="flex-sb" @click="capitalVisible = true;">
                <span>{{ $t('pool.liquidityCapital') }}</span>
                <svg-icon :icon="'icon-info'" :size="29" :color="'#999'" style="margin-left: 2px;" />
              </span>
              <span>{{item.token0.benjin}} / {{item.token1.benjin}}</span>
            </div>
            <!-- 当前盈利 -->
            <div class="flex-sb time">
              <span class="flex-sb" @click="feeVisible = true;">
                <span>{{ $t('pool.currentProfit') }}</span>
                <svg-icon :icon="'icon-info'" :size="29" :color="'#999'" style="margin-left: 2px;" />
              </span>
              <div @click="handlerProfitClick(item)">
                <svg-icon :icon="'icon-switch'" :size="26" :color="'#999'" />
                <span
                  style="margin-left: 1px;"
                  v-if="$store.state.app.language === 'zh-CN' ||
                  $store.state.app.language === 'zh-TW'"
                >{{item.profit}} ( {{ $t('pool.include') }}{{item.profitCoin}} )</span>
                <span
                  style="margin-left: 1px;"
                  v-else
                >{{item.profit}} ( {{ $t('pool.include') }} {{item.profitCoin}} )</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 没有数据 -->
      <div v-if="!historyList.length && !loading" class="no-data">
        <!-- <img src="@/assets/images/common/nodata.png" class="img" alt /> -->
        <svg-icon :color="$store.state.app.themeColor" :icon="'icon-empty'" :size="90" />
        <div class="notip">{{ $t('public.noData') }}</div>
      </div>
      <div style="padding: 50px 0" v-if="loading">
        <Loading />
      </div>
    </div>
    <!-- 温馨提示 -->
    <mt-popup v-model="feeVisible" class="popup" popup-transition="popup-fade">
      <div class="popup-cancel tip-popup flex-center">
        <div class="ipopup-close close" @click="feeVisible = false;">
          <svg-icon :icon="'icon-close-gray'" :size="20" :color="'#000'" />
        </div>
        <div class="content">
          <p class="word1">{{ $t('pool.currentProfit') }}</p>
          <p class="word2 wordNoIndent">{{ $t('pool.currentProfitDetail') }}</p>
          <!-- 了解无常损失 > -->
          <a @click="handleJump" class="link setValueClss">{{$t('pool.impermanentLoss')}}</a>
        </div>
      </div>
    </mt-popup>
    <!-- 做市本金 -->
    <mt-popup v-model="capitalVisible" class="popup" popup-transition="popup-fade">
      <div class="popup-cancel tip-popup flex-center">
        <div class="ipopup-close close" @click="capitalVisible = false;">
          <svg-icon :icon="'icon-close-gray'" :size="20" :color="'#000'" />
        </div>
        <div class="content">
          <p class="word1">{{ $t('pool.liquidityCapital') }}</p>
          <p class="word2 wordNoIndent">{{ $t('pool.liquidityCapitalDetail') }}</p>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { toFixed, decadd, decsub, decdiv, decmul } from "@/utils/decimal";
import Loading from "@/views/components/Loading";
import {mapMutations,mapState} from 'vuex'
import { coinUrl } from "@/utils/common";
import '@/api'
// import { symbol_to_id } from '@/utils/common'
export default {
  name: "MyLiquidity", // 您的做市
  data() {
    return {
      loading: true,
      feeVisible: false,
      capitalVisible: false, // 做市本金
      historyList: [],
      testShow:true,
    };
  },
  components: {
    Loading,
  },
  props: {
    pairs: Array,
    liquidityList: Array,
  },
  watch: {
    liquidityList: function change() {
      this.loading = false;
      setTimeout(this.handleMyLiquidity, 200);
    },
  },
  computed: {...mapState(['liquMes'])},
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    ...mapMutations(['liquMes_fn']),
    // testDom(){
    //   this.testShow=false;
    //   setTimeout(()=>{
    //     this.testShow=true;
    //   },1000)
    // },
    url(contract, coin) {
      return coinUrl(contract, coin);
    },
    // 获取我的做市
    async handleMyLiquidity() {
      let _this=this;
      const hisList = [];
      if (this.liquidityList.length > 0) {
        // console.log(this.pairs)
        this.liquidityList.forEach((v) => {
          const item = this.pairs.find((j) => j.pairId === v.pair_id);
          if (item) {
            // console.log(1)
            // console.log(item);
            // 做市本金
            item.token0.benjin = v.capital0.toFixed(item.token0.precision) + " " + item.token0.coin;
            item.token1.benjin = v.capital1.toFixed(item.token1.precision) + " " + item.token1.coin;
            // 用户当前池token
            const uToken = v.token;
            item.userToken = uToken;
            // 当前池token liquidityToken
            const cToken = item.totalLiquidity;
            // 做市占比
            const bili = decdiv(uToken, cToken);
            item.bili = toFixed(decmul(bili, 100), 2);
            item.token0.tokenQuantity = `${toFixed(
              decmul(parseFloat(item.token0.reserve), bili),
              item.token0.precision
            )} ${item.token0.coin}`;
            item.token1.tokenQuantity = `${toFixed(
              decmul(parseFloat(item.token1.reserve), bili),
              item.token1.precision
            )} ${item.token1.coin}`;
            item.wayProfit = true;
            item.profitCoin = item.token1.coin;
            item.profit = this.handlerProfit(item);
            hisList.push(item);
          }
          this.historyList = hisList;
        });
      }
      this.loading = false;
    },
    // 盈利计算 decadd、decsub、decmul、decdiv
    handlerProfit(item) {
      let profit = 0;
      const way = item.wayProfit;
      const a = way
        ? parseFloat(item.token0.reserve)
        : parseFloat(item.token1.reserve);
      const b = way
        ? parseFloat(item.token1.reserve)
        : parseFloat(item.token0.reserve);
      // 获取池子价格 1 token1 = ? token0
      const price = decdiv(a, b);

      // 当前做市
      const azs = way
        ? parseFloat(item.token0.tokenQuantity)
        : parseFloat(item.token1.tokenQuantity);
      const bzs = way
        ? parseFloat(item.token1.tokenQuantity)
        : parseFloat(item.token0.tokenQuantity);

      // 本金
      const abj = way
        ? parseFloat(item.token0.benjin)
        : parseFloat(item.token1.benjin);
      const bbj = way
        ? parseFloat(item.token1.benjin)
        : parseFloat(item.token0.benjin);

      // 当前盈利 = (价格*当前做市token1 + 当前做市token0) - (价格*做市本金token1 + 做市本金token0);
      const left = decadd(decmul(price, bzs), azs);
      const right = decadd(decmul(price, bbj), abj);

      const decimal = way ? item.token0.precision : item.token1.precision;
      const coin = way ? item.token0.coin : item.token1.coin;
      profit = `${toFixed(decsub(left, right), decimal)} ${coin}`;
      return profit;
    },
    // 盈利切换
    handlerProfitClick(obj) {
      const item = obj;
      item.wayProfit = !obj.wayProfit;
      const profit = this.handlerProfit(item);
      const gitem = this.historyList.find((v) => v.pairId === item.pairId);
      if (gitem) {
        // gitem.wayProfit = !obj.wayProfit;
        gitem.profit = profit;
        gitem.profitCoin = item.wayProfit ? item.token1.coin : item.token0.coin;
        this.$forceUpdate(); // 强制更新
      }
    },
    handleToRecord() {
      this.$router.push({
        name: "liquidity-record",
      });
    },
    // 跳转到handleManageMarket
    async handleManageMarket(item) {
      this.$router.push({
        name: "pool-manage",
        params: {
          pairId: item.pairId,
        },
      });
    },
    // 增加做市数量
    async handleAddMarket(item) {
      this.$emit("addMarket", {
        pay: {
          coin: item.token0.coin,
          contract: item.token0.contract,
          amount: "", // 兑换数量
        },
        receive: {
          coin: item.token1.coin,
          contract: item.token1.contract,
          amount: "", // 得到数量
        },
        pairId: item.pairId,
        timer: null,
      });
    },
    // 减少做市数量
    async handleReduceMarket(item) {
      // console.log(item);
      this.$router.push({
        name:'pool-reduce',
        params:{
          item:item
        }
      });
      this.liquMes_fn(item)
      // console.log(this.liquMes)
    },
    // 跳转公告
    handleJump() {
      const lang = this.$store.state.app.language.toLowerCase();
      let href = "";
      if (lang === "en") {
        href =
          "https://www.chainnews.com/articles/562597767613.htm";
      } else if (lang === "zh-cn") {
        href =
          "https://www.chainnews.com/articles/562597767613.htm";
      } else if (lang === "zh-tw") {
        href =
          "https://www.chainnews.com/articles/562597767613.htm";
      } else {
        href =
          "https://www.chainnews.com/articles/562597767613.htm";
      }
      window.location.href = href;
    },
    decdiv(a, b) {
      return decdiv(a, b);
    },
    decmul(a, b) {
      return decmul(a, b);
    },
    toFixed(a, b) {
      return toFixed(a, b);
    },
  },
};
</script>
<style lang="scss" scoped>
$-color: #8b572a;

.rotate90 {
  // transform: rotate(-90deg) !important;
  color: $-color !important;
  margin: 0 5px;
}

.marketrecord {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 60px;
  color: #ffa300;
}

.my-liquidity {
  font-size: 28px;
  margin-top: 36px;

  .title {
    height: 44px;
    line-height: 60px;
    padding: 0 30px;
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: 600;
    line-height: 60px;
    color: #333333;

    div:nth-child(2) {
      font-size: 28px;
      color: $color-theme;
    }
  }

  .main {
    margin-top: 20px;
    position: relative;
    // padding: 0 35px 50px;

    .liquidity-item {
      // position: relative;
      margin: 0 25px 25px 25px;
      box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
      border-radius: 30px;
      background: #ffffff;
      overflow: hidden;
      .time {
        color: #999;
        margin-bottom: 10px;
        font-size: 26px;

        span:nth-child(2) {
          color: #333;
          font-size: 26px;
        }
      }

      .word {
        font-size: 24px;

        .title {
          color: $-color;
        }
      }

      .item-title {
        padding: 30px;
        img {
          width: 50px;
          height: 50px;
          margin-right: 8px;
        }

        .add-icon {
          margin: 0 15px 5px;
          color: #999;
        }

        span {
          font-size: 29px;
        }

        .btn {
          div {
            padding: 8px 25px;
            border-radius: 8px;
            color: #8b572a;
            margin-left: 18px;
            font-size: 24px;
            border: 1px solid #feb75e;
          }

          // div:nth-child(1) {
          //   background: #FEB75E;
          // }

          // div:nth-child(1) {
          //   border: 1px solid #feb75e;
          // }
        }
      }
      .item-body {
        padding: 30px;
        background-color: #fafafa;
      }
    }
  }
  .no-data {
    padding-bottom: 260px;
  }

  .tip-popup {
    width: 621px;
    border-radius: 15px;
    background: #fff;
    box-sizing: border-box;
    padding: 45px 35px;
    position: relative;
    color: $color-333;
    .close {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 10px;
      color: #000;
    }
    .title {
      font-size: 33px;
      color: #333;
      text-align: center;
      margin-bottom: 40px;
    }
    .content {
      margin: 35px 0 35px;
      font-size: 27px;
      color: $color-999;
    }

    .word1 {
      text-align: center;
      margin-bottom: 40px;
      font-size: 33px;
      color: #333;
    }

    .word2 {
      color: #333;
      line-height: 47px;
      font-size: 30px;
    }

    .link {
      display: inline-block;
      margin-top: 25px;
      font-size: 30px;
    }
    .setValueClss {
      color: #8b572a;
    }
  }
}
</style>
