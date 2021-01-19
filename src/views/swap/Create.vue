<template>
  <div class="createMarket">
    <header class="header">
      <!-- 创建市场 -->
      <span class="title">{{ $t('swap.createMarket') }}</span>
    </header>
    <section class="section">
      <div class="itemTop">
        <!-- 币种名称 -->
        <div class="item">
          <div class="flex-sb">
            <span>{{ $t('swap.tokenName') }}</span>
            <span
              class="changeCoinCls"
              @click="tokenSelectorVisible=true;tokenSelectorDirection=0;"
            >{{ $t('swap.selectToken') }} ></span>
          </div>
          <input type="text" :placeholder="$t('swap.enterTokenName')" v-model="pair.pay.coin" />
        </div>
        <!-- 合约地址 -->
        <div class="item">
          <div class="flex-sb">
            <span>{{ $t('swap.contractAddress') }}</span>
          </div>
          <input
            type="text"
            :placeholder="$t('swap.enterContractAddress')"
            v-model="pair.pay.contract"
          />
        </div>
      </div>
      <div class="addCoin flex-center">
        <svg-icon
          class="icon"
          :color="$store.state.app.themeColor"
          :icon="'icon-plus2'"
          :size="90"
        />
      </div>
      <div class="itemTop itemBottom">
        <!-- 币种名称 -->
        <div class="item">
          <div class="flex-sb">
            <span>{{ $t('swap.tokenName') }}</span>
            <span
              class="changeCoinCls"
              @click="tokenSelectorVisible=true;tokenSelectorDirection=1;"
            >{{ $t('swap.selectToken') }} ></span>
          </div>
          <input type="text" :placeholder="$t('swap.enterTokenName')" v-model="pair.get.coin" />
        </div>
        <!-- 合约地址 -->
        <div class="item">
          <div class="flex-sb">
            <span>{{ $t('swap.contractAddress') }}</span>
          </div>
          <input
            type="text"
            :placeholder="$t('swap.enterContractAddress')"
            v-model="pair.get.contract"
          />
        </div>
      </div>

      <!-- 确定 -->
      <button class="exchangeBtn" @click="handlerSure">
        <loading v-if="loading"></loading>
        {{ $t('swap.createMarket') }}
      </button>
      <div class="tip">* {{ $t('swap.noCostCreate') }}</div>
    </section>
    <!-- 币种列表 -->
    <mt-popup
      v-model="tokenSelectorVisible"
      position="bottom"
      style="width: 100%; border-radius: 10px 10px 0 0;"
    >
      <TokenSelector
        v-if="tokenSelectorVisible"
        :coins="coins"
        :selected="selectedToken"
        :direction="tokenSelectorDirection"
        :visible="tokenSelectorVisible"
        @token-event="listenTokenEvents"
      />
    </mt-popup>
  </div>
</template>

<script>
import EosTool from "@/utils/eostool";
import api from "@/api";
import { getPairId } from "@/utils/swap-new";
import Loading from "@/views/components/Loading";
import TokenSelector from "./components/TokenSelector";

export default {
  name: "create", // 创建市场
  data() {
    return {
      coins: [],
      pair: {
        // 选择后数据
        pay: {
          coin: "EOS",
          contract: "eosio.token",
        },
        get: {
          coin: "",
          contract: "",
        },
        receive: {},
        pairId: null,
        timer: null,
      },
      tokenSelectorVisible: false, // 选择币种弹窗
      tokenSelectorDirection: 0,
      selectedToken: null,
      loading: false,
    };
  },
  components: {
    Loading,
    TokenSelector,
  },
  props: {},
  watch: {},
  computed: {},
  created() {},
  mounted() {
    // load cache
    let list = this.$store.state.app.pairs || [];
    if (list && list.length > 0) {
      this.pairs = list;
      // this.filterCoins(list);
      this.handlerDataComment(list);
    }
  },
  beforeDestroy() {},
  methods: {
    async handlerSure() {
      const pay = this.pair.pay;
      const get = this.pair.get;
      if (!pay.coin || !pay.contract || !get.coin || !get.contract) {
        // 币种信息不能为空
        this.$toast(this.$t("toastTip.tokenInfoEmpty"));
        return;
      }
      pay.coin = pay.coin.toUpperCase();
      get.coin = get.coin.toUpperCase();
      if (pay.coin === get.coin && pay.contract === get.contract) {
        // 请输入两个不同的做市币种
        this.$toast(this.$t("toastTip.twoDifferent"));
        return;
      }
      if (this.loading) return;
      this.loading = true;
      // 验证币种是否在链
      const resultPay = await this.handlerCheckCoin(pay);
      if (!resultPay) {
        // 此币种不存在
        this.$toast(`${pay.coin} ${this.$t("swap.tokenNotExist")}`);
        this.loading = false;
        return;
      }
      const resultGet = await this.handlerCheckCoin(get);
      if (!resultGet) {
        // 此币种不存在
        this.$toast(`${get.coin} ${this.$t("swap.tokenNotExist")}`);
        this.loading = false;
        return;
      }
      sessionStorage.setItem("marketNewCoin", JSON.stringify(this.pair));
      // 验证是否已经存在该池子
      const pairId = await getPairId(
        this.pair.pay,
        this.pair.get,
        this.$store.state.app.pairs
      );
      if (pairId) {
        // 已存在
        // 进入做市
        this.pair.pairId = pairId;
        this.$router.push({
          name: "pool",
          params: {
            pairId: pairId,
          },
        });
        return;
      }
      // 无池子 创建市场
      this.handleMarketCreat();
    },
    async handleMarketCreat() {
      const account = this.$store.state.app.account;
      const pair = this.pair;
      const actions = [
        {
          account: "hamburgerswp",
          name: "createpair",
          authorization: [
            {
              actor: account.name, // 转账者
              permission: account.authority || "active",
            },
          ],
          data: {
            creator: account.name,
            token0: `${pair.pay.precision},${pair.pay.coin}@${pair.pay.contract}`,
            token1: `${pair.get.precision},${pair.get.coin}@${pair.get.contract}`,
          },
        },
      ];
      const result = await EosTool.transact(actions);
      this.loading = false;
      if (!result.transaction_id) {
        // 错误信息
        const res = EosTool.handleScatterError(result);
        this.$toast(res.type === "lang" ? this.$t(res.text) : res.text);
        return;
      }
      this.$toast({
        message: this.$t("pool.poolCreateSuccess"),
        position: "center",
        duration: 2000,
      });
      this.successApi();
    },
    successApi() {
      setTimeout(() => {
        this.$router.push({
          name: "pool",
          params: {
            pairId: 0,
          },
        });
      }, 2000);
    },
    // 验证币种
    async handlerCheckCoin(item) {
      const symbol = item.coin.toUpperCase();
      const code = item.contract.toLowerCase();
      const result = await EosTool.getCurrencyStats(code, symbol);
      // 此币种不存在
      if (!result[symbol]) {
        return null;
      }
      const supply = result[symbol].supply || result[symbol].max_supply;
      // 获取币种精度
      item.precision =
        supply.split(" ")[0].indexOf(".") === -1
          ? 0
          : supply.split(" ")[0].split(".")[1].length;
      // console.log(item);
      return "success";
    },
    // 数据fromat comment coins
    handlerDataComment(list) {
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
 
    // 选择币种
    listenTokenEvents(type, data) {
      this.tokenSelectorVisible = false;
      const { direction, item } = data;
      if (type === "close") {
        return;
      }
      // if (flag) {
      //   this.handleChangeCoin();
      //   return;
      // }
      this.pair[direction == 0 ? "pay" : "get"] = item;
    },
    // 跟换支付/得到 方向
    handleChangeCoin() {
      const get = JSON.stringify(this.pair.get);
      const pay = JSON.stringify(this.pair.pay);
      this.pair.pay = JSON.parse(get);
      this.pair.get = JSON.parse(pay);
    },
    // 获取币种 & 格式化 & 扁平化
    async handlerDataFromat() {},
  },
};
</script>
<style lang="scss" scoped>
.createMarket {
  .header {
    position: relative;
    height: 90px;
    padding: 0 35px;
    line-height: 90px;
    // text-align: center;
    font-size: 32px;
    // border-bottom: 1px solid #F6F6F6;
    .back-span {
      position: absolute;
      left: 25px;
      height: 40px;
      width: 40px;
      top: 50%;
      transform: translateY(-50%);
    }

    .title {
      width: 128px;
      height: 44px;
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 60px;
      color: #333333;
      padding: 30px 30px 5px 30px;
    }
    .wxTip {
      position: absolute;
      right: 15px;
      top: 0;

      span {
        font-size: 24px;
        color: #feb75e;
        margin-left: 5px;
      }
    }
  }
  .changeCoinCls {
    height: 48px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 60px;
    color: #ffa300;
  }
  .addCoin {
    font-size: 36px;
    margin: 15px 0;
  }
  .tip {
    height: 36px;
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 24px;
    color: #ffa300;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
  }
  .section {
    padding: 0 35px;

    input {
      width: 100%;
      // height: 55px;
      line-height: 55px;
      font-size: 30px;
      outline-style: none;
      background: transparent;
      color: #333;
      border-bottom: 1px solid #e7e7e7;
      padding: 10px 0;
      border-radius: 0;
    }

    .item {
      margin-top: 15px;
      .flex-sb {
        height: 48px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 60px;
        color: #333333;
      }
    }

    .itemTop {
      padding: 15px 30px 5px 30px;
      width: 690px;
      height: 340px;
      background: #f5f5f5;
      border-radius: 20px;
    }
    .itemBottom {
      padding: 15px 30px 5px 30px;
      width: 690px;
      height: 340px;
      background: #f5f5f5;
      border-radius: 20px;
    }
  }
  .exchangeBtn {
    width: 100%;
    height: 90px;
    background: $btn-bg;
    color: $btn-color;
    margin-top: 55px;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 45px;

    &.disabled {
      opacity: 0.6;
      color: #ddd;
    }
  }
}
</style>
