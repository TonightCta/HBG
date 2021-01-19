<template>
  <div>
    <div class="container">
      <div class="title flex-sb">
        <span class="list">{{ $t("mining.list") }}</span>
        <span class="rule flex-center">
          {{ $t("mining.rules") }}
          <span @click="rulesVisible = true">
            <svg-icon
              :icon="'icon-info'"
              :size="29"
              :color="'#999'"
              style="margin-left:2px;margin-top:5px;"
            />
          </span>
        </span>
      </div>
      <!-- 矿池列表 -->
      <div class="item" v-for="(item, index) in pairs" :key="index">
        <div class="item-title flex-sb" v-if="item.endTime>item.nowTime">
          <div class="logo flex">
            <img :src="url(item.token0.contract, item.token0.coin)" onerror="this.src='/static/images/eos.png'" alt />
            <span>{{ item.token0.coin }}</span>
            <span class="add-icon">+</span>
            <img :src="url(item.token1.contract, item.token1.coin)" onerror="this.src='/static/images/eos.png'" alt />
            <span>{{ item.token1.coin }}</span>
          </div>
          <div class="flex-sb">
            <!-- 增加 -->
            <!-- <div @click="handleAddMarket(item)">{{ $t('pool.add') }}</div> -->
            <div>{{ $t("swap.tradeMiningWeight") }}:{{ item.weight }}</div>
          </div>
        </div>

        <div class="item-body" v-if="item.endTime>item.nowTime">
          <div class="flex-sb time">
            <span>{{ $t("swap.pools") }}</span>
            <span>{{ item.token0.reserve }} / {{ item.token1.reserve }}</span>
          </div>
        </div>
      </div>
    </div>
    <mt-popup
      v-model="rulesVisible"
      class="popup"
      popup-transition="popup-fade"
    >
      <div class="popup header">
        <div class>{{ $t("mining.rules") }}</div>
        <div class @click="rulesVisible = false">
          <svg-icon :icon="'icon-close-gray'" :size="20" :color="'#000'" />
        </div>
      </div>
      <div class="content">
        <div class="word2" v-html="$t('mining.rules1')"></div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import EosTool from "@/utils/eostool";
import { coinUrl } from "@/utils/common";

export default {
  name: "tradeMining", // defi兑换
  data() {
    return {
      timer: null, // 兑换24小时成交量和订单数计时器
      pairs: [],
      rulesVisible: false,
    };
  },
  components: {},
  props: {},
  watch: {},
  computed: {},
  created() {
    this.getPairs();
  },
  mounted() {
  },
  methods: {
    url(contract, coin) {
      return coinUrl(contract, coin);
    },
    // 获取币种 & 格式化 & 扁平化
    async getPairs() {
      const paramsTrademine = {
        code: "hbgtrademine",
        scope: "hbgtrademine",
        table: "pools",
        limit: 300,
        json: true,
      };
      const itemsTrademine = await EosTool.getTableRows(paramsTrademine);
      const params = {
        code: "hamburgerswp",
        scope: "hamburgerswp",
        table: "pairs",
        limit: 1000,
        json: true,
      };

      const items = await EosTool.getTableRows(params);

      const paramsTokenpool = {
        code: "hbgtrademine",
        scope: "hbgtrademine",
        table: "pools",
        limit: 300,
        json: true,
      };
      const itemsTokenpool = await EosTool.getTableRows(paramsTokenpool);

      const list = [];
      for (const rowTrademine of itemsTrademine) {
        for (const v of items) {
          if (rowTrademine.pair_id != v.id) {
            continue;
          }
          const p = {};
          p.weight = parseFloat(rowTrademine.weight).toFixed(1);
          p.pairId = v.id;
          p.totalLiquidity = v.total_liquidity;
          p.endTime=0;
          p.nowTime=0;
          let locaDate=(new Date().getTime()/1000).toFixed(0)
          for (const rowTokenpool of itemsTokenpool) {
            p.nowTime=Number(locaDate);
            if (rowTokenpool.pair_id == v.id) {
              p.endTime=rowTokenpool.end_time;
              break;
            }
          }
          const currency0 = v.token0.sym.split(",")[1];
          const currency0_lower = currency0.toLowerCase();
          const precision0 = parseInt(v.token0.sym.split(",")[0]);
          const currency1 = v.token1.sym.split(",")[1];
          const currency1_lower = currency1.toLowerCase();
          const precision1 = parseInt(v.token1.sym.split(",")[0]);
          p.token0 = {
            coin: currency0,
            precision: precision0,
            contract: v.token0.contract,
            reserve: v.reserve0,
            tokenId: `${v.token0.contract}-${currency0}`,
            eosAmount: currency0 === "EOS" ? parseFloat(v.reserve0) : 0,
          };
          p.token1 = {
            coin: currency1,
            precision: precision1,
            contract: v.token1.contract,
            reserve: v.reserve1,
            tokenId: `${v.token1.contract}-${currency1}`,
            eosAmount: currency1 === "EOS" ? parseFloat(v.reserve0) : 0,
          };
          // console.log(p)
          list.push(p);
        }
      }
      this.pairs = list;
      // this.filterCoins(list);
    },

    // 数据fromat comment
    filterCoins(list) {
      if (list.length > 0) {
        const coins1 = list.map((v) => v.token0);
        const coins2 = list.map((v) => v.token1);
        coins1.push(...coins2);
        const coins = [];
        coins1.forEach((item) => {
          const idx = coins.findIndex((v) => v.tokenId === item.tokenId);
          if (idx === -1) {
            coins.push(item);
          }
        });
        coins.sort((a, b) => parseFloat(b.eosAmount) - parseFloat(a.eosAmount)); // 遍历eos数量最高的放前面
        this.coins = coins;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  background: #fff;
  padding: 0px 24px 24px 24px;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: 600;
    color: #333333;
    padding: 24px 0px;
    .rule {
      font-weight: 400;
      font-size: 24px;
    }
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 20px;
    .left {
      display: flex;
      align-items: flex-start;
    }
    .right {
      color: #ffa300;
    }
  }

  .item {
    box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
    border-radius: 24px;
    background: #ffffff;
    margin: 30px 0px;
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
      }
    }
    .item-body {
      padding: 30px;
      background-color: #fafafa;
    }
  }
}
.popup {
  width: 680px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
  }
  .content {
    padding: 24px;
  }
}
</style>
