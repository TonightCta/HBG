<template>
  <div class="container">
    <!-- <Header @turnLang="changeRoadLang"/> -->
    <!-- <Banner/> -->
    <div class="main">
      <div class="tab flex" v-if="tabVisible">
        <div
          class="btn flex-center"
          :class="{ active: menuActive === item.value }"
          v-for="(item, index) in menu"
          :key="index"
          @click="onMenuClick(index)"
        >
          <div>{{ $t(`swap.${item.label}`) }}</div>
        </div>
      </div>
      <router-view
        :pairs="pairs"
        :coins="coins"
        :coins1swap="coins1swap"
        :pairsLoading="pairsLoading"
        @refresh="onRefresh"
      ></router-view>
      <!-- <mt-popup class="popup" v-model="noticeVisible">
        <div class="tip-popup">
          <div @click="noticeVisible=false;" class="close">
            <svg-icon :color="'#000'" :icon="'icon-close-gray'" :size="20" />
          </div>
          <div class="title">{{ $t('public.announcement') }}</div>
          <p class="content" @click="onClickAnnouncement">
            {{ $t('public.announcementContent') }}
          </p>
        </div>
      </mt-popup>-->
    </div>
  </div>
</template>

<script>
import EosTool from "@/utils/eostool";
// import Header from "@/views/components/Header";
// import Banner from '@/views/swap/components/banner'

export default {
  name: "Hamburger", // defi兑换
  data() {
    return {
      pairs: [],
      menu: [
        // 总菜单
        {
          value: 0,
          label: "swap",
        },
        {
          value: 1,
          label: "pools",
        },
      ],
      menuActive: 1, // 0-兑换 1-做市 2-一步
      dataList: [], // 订单列表交易对信息
      statusObj: {}, // 服务暂停状态
      getOneSymbolTimer: null,
      timer: null, // 兑换24小时成交量和订单数计时器
      coins: [],
      coins1swap: [],
      noticeVisible: true,
      pairsLoading: false, // 刷新池子数据
      pairsLoadingTimer: null, // 刷新池子数据定时器
      tabVisible: true,
    };
  },
  components: {
    // Header,
    // Banner
  },
  props: {},
  watch: {
    "$route.name": {
      handler(name) {
        this.menuActive = name === "swap" ? 0 : 1;
        if (name != "swap1step") {
          this.tabVisible = true;
        } else {
          this.tabVisible = false;
        }
      },
      depth: true,
    },
  },
  computed: {},
  created() {},
  mounted() {
    this.menuActive = this.$route.name === "swap" ? 0 : 1;
    if (this.$route.name == "swap1step") {
      this.tabVisible = false;
    } else {
      this.tabVisible = true;
    }
    // load cache
    let list = this.$store.state.app.pairs || [];
    if (list && list.length > 0) {
      this.pairs = list;
      this.filterCoins(list);
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    // 总 菜单切换（兑换、做市商）
    onMenuClick(val) {
      const routerName = val === 0 ? "swap" : "pool";
      if (this.$route.name === routerName) return;
      this.$router.push({ name: routerName }).then(() => {
        this.menuActive = this.$route.name === "swap" ? 0 : 1;
      });
    },

    // 获取币种 & 格式化 & 扁平化
    async getPairs() {
      // refresh
      this.pairsLoading = true;
      const params = {
        code: "hamburgerswp",
        scope: "hamburgerswp",
        table: "pairs",
        limit: 1000,
        json: true,
      };

      const paramsTrademine = {
        code: "hbgtrademine",
        scope: "hbgtrademine",
        table: "pools",
        limit: 300,
        json: true,
      };
      const itemsTrademine = await EosTool.getTableRows(paramsTrademine);

      const paramsTokenpool = {
        code: "hbgtokenpool",
        scope: "hbgtokenpool",
        table: "pools",
        limit: 300,
        json: true,
      };
      const itemsTokenpool = await EosTool.getTableRows(paramsTokenpool);
      let totalWeight = 0;
      for (const row of itemsTokenpool) {
        totalWeight += row.weight;
      }

      const items = await EosTool.getTableRows(params);
      const list = [];
      items.forEach((v) => {
        const p = {};
        p.weight = 0; //挖矿权重
        p.displayWeight = 0; //做市权重
        p.weightProportion = 0; //做市权重占比
        p.endTime=0;
        for (const rowTrademine of itemsTrademine) {
          if (rowTrademine.pair_id == v.id) {
            p.weight = parseFloat(parseFloat(rowTrademine.weight).toFixed(2));
            break;
          }
        }
        for (const rowTokenpool of itemsTokenpool) {
          p.endTime=rowTokenpool.end_time;
          if (rowTokenpool.pair_id == v.id) {
            p.displayWeight = parseFloat(
              parseFloat(rowTokenpool.display_weight).toFixed(2)
            );
            p.weightProportion = rowTokenpool.weight / totalWeight;
            break;
          }
        }
        p.pairId = v.id;
        p.totalLiquidity = v.total_liquidity;
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
        // 获取swapBoxId  swapDfsId
        let idsData = [
          {
            name: "eosio.token-EOS:tethertether-USDT",
            hbgPairId: 1,
            swapBoxId: 12,
            swapDfsId: 17,
          },
          {
            name: "hbgdefitoken-HBG:eosio.token-EOS",
            hbgPairId: 2,
            swapBoxId: 598,
            swapDfsId: 399,
          },
          {
            name: "token.defi-BOX:eosio.token-EOS",
            hbgPairId: 9,
            swapBoxId: 194,
            swapDfsId: 303,
          },
          {
            name: "eosio.token-EOS:minedfstoken-DFS",
            hbgPairId: 8,
            swapBoxId: 22,
            swapDfsId: 39,
          },
          {
            name: "eosio.token-EOS:organixtoken-OGX",
            hbgPairId: 3,
            swapBoxId: 340,
            swapDfsId: 309,
          },
          {
            name: "eosio.token-EOS:mkstaketoken-KEY",
            hbgPairId: 18,
            swapBoxId: 6,
            swapDfsId: 5,
          },
          {
            name: "eosio.token-EOS:newdexissuer-NDX",
            hbgPairId: 5,
            swapBoxId: 1,
            swapDfsId: 2,
          },
          {
            name: "eosio.token-EOS:eosiotptoken-TPT",
            hbgPairId: 19,
            swapBoxId: 4,
            swapDfsId: 3,
          },
          {
            name: "eosio.token-EOS:bgbgbgbgbgbg-BG",
            hbgPairId: 23,
            swapBoxId: 3,
            swapDfsId: 4,
          },
          {
            name: "eosdmdtokens-DMD:eosio.token-EOS",
            hbgPairId: 7,
            swapBoxId: 472,
            swapDfsId: 326,
          },
          {
            name: "eosio.token-EOS:everipediaiq-IQ",
            hbgPairId: 24,
            swapBoxId: 93,
            swapDfsId: 6,
          },
        ];
        for (const ids of idsData) {
          if (p.pairId == ids.hbgPairId) {
            p.swapBoxId = ids.swapBoxId;
            p.swapDfsId = ids.swapDfsId;
            break;
          }
        }

        list.push(p);
      });
      this.$store.dispatch("setPairs", list);
      this.pairs = list;
      this.filterCoins(list);
    },

    // 数据fromat comment
    filterCoins(list) {
      if (list.length > 0) {
        const coins1 = list.map((v) => v.token0);
        const coins2 = list.map((v) => v.token1);
        coins1.push(...coins2);
        const coins = [];
        const coins1swap = [];
        coins1.forEach((item) => {
          const idx = coins.findIndex((v) => v.tokenId === item.tokenId);
          if (idx === -1) {
            coins.push(item);
          }
        });
        coins.sort((a, b) => parseFloat(b.eosAmount) - parseFloat(a.eosAmount)); // 遍历eos数量最高的放前面
        this.coins = coins;
        let coinsFilter = {
          EOS: "eosio.token",
          USDT: "tethertether",
          HBG: "hbgdefitoken",
          BOX: "token.defi",
          DFS: "minedfstoken",
          OGX: "organixtoken",
          KEY: "mkstaketoken",
          NDX: "newdexissuer",
          TPT: "eosiotptoken",
          BG: "bgbgbgbgbgbg",
          DMD: "eosdmdtokens",
          IQ: "everipediaiq",
        };
        for (const coin of this.coins) {
          if (coinsFilter[coin.coin] == coin.contract) {
            coins1swap.push(coin);
          }
        }
        this.coins1swap = coins1swap;
        this.pairsLoading = false;
      }
    },

    // 监听回传信息
    onRefresh(key, val) {
      if (key === "symbol") {
        val;
        this.pairsLoading = true;
        this.pairsLoadingTimer && clearTimeout(this.pairsLoadingTimer);
        this.pairsLoadingTimer = setTimeout(this.getPairs, 300);
      }
    },

    onClickAnnouncement() {
      this.noticeVisible = false;
      this.$router.push({ path: "/start" });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  background: #fff;
  .main {
    position: relative;
    margin: 0;
    padding: 0;
    .tab {
      position: absolute;
      top: 0;
      left: 60px;
      right: 60px;
      height: 120px;
      z-index: 2;
      box-sizing: border-box;
      padding: 0 20px 0 20px;
      font-size: 32px;
      color: #333;
      text-align: center;
      margin: 0 auto;
      .btn {
        flex: 1;
        padding: 0 30px;
        text-align: center;
        & > div {
          width: 136px;
          height: 60px;
          line-height: 60px;
          border-bottom: 4px solid #e8e8e8;
          cursor: pointer;
        }
      }
      .active > div {
        color: $btn-bg;
        border-color: $btn-bg;
      }
    }
  }
}
.tip-popup {
  width: 621px;
  border-radius: 15px;
  background: #fff;
  box-sizing: border-box;
  padding: 45px 30px;
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
    margin: 50px 0 80px 0;
    font-size: 30px;
    color: $color-999;
    text-align: center;
  }
}
</style>
