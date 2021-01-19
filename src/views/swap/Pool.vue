<template>
  <div class="market-container">
    <div class="market-main">
      <!-- 支付币种 -->
      <TokenRow
        :token="pair.pay"
        :showBalance="true"
        :balance="balance0"
        :title="$t('pool.create')"
        titleStyle="title-color"
        :amount="pair.pay.amount"
        @onBlur="amt => handleInputBlur('pay', amt)"
        @onInput="amt => handlePayInput(amt)"
        @onBalanceClick="handlePayInput(balance0)"
        @onTitleClick="handleToCreate()"
        @onTokenClick="direction=0;selectedToken=pair.pay;tokenSelectorVisible=true;"
      />
      <!-- 上下换位 -->
      <div class="icon-switch flex-center">
        <svg-icon
          class="icon"
          :color="$store.state.app.themeColor"
          :icon="'icon-plus2'"
          :size="76"
        />
      </div>
      <TokenRow
        style="margin-top:12px"
        :token="pair.receive"
        :showBalance="true"
        :balance="balance1"
        :amount="pair.receive.amount"
        @onBlur="amt => handleInputBlur('receive', amt)"
        @onInput="amt => handleReceiveInput(amt)"
        @onBalanceClick="handleReceiveInput(balance1);"
        @onTokenClick="direction=1;selectedToken=pair.receive;tokenSelectorVisible=true;"
      />

      <div class="tip-box" v-if="pair.pairId >= 0">
        <!-- 蒙版 -->
        <div class="waiting flex-center" v-if="pairsLoading">
          <svg-icon class="el-icon-loading" :icon="'icon-refresh'" :size="32" :color="'#666'" />
        </div>
        <div class="tip-item">
          <!-- 24H做市年化预估 -->
          <div class="title">{{ $t('pool.liquidityAPY') }}</div>
          <div>
            <span
              class="font-b"
            >{{ $t('pool.feeRevenue') }}:{{pair.feeRevenue}}% + {{ $t('pool.miningRewards') }}:

            <span v-if="pair.miningRewards > 0">{{(pair.miningRewards)}}</span>
            <span v-else>0</span>
            %</span>
            <br>
            <!-- <span
              class="font-b" style="marginTop:4px;display:inline-block;"
            >{{ $t('swap.colaPrice') }}:
                <span v-if="pair.pay.coin+'/'+pair.receive.coin+' LP'==colaList[0].title||pair.receive.coin+'/'+pair.pay.coin+' LP'==colaList[0].title||pair.pay.coin+'/'+pair.receive.coin+' LP'==colaList[1].title||pair.receive.coin+'/'+pair.pay.coin+' LP'==colaList[1].title||pair.pay.coin+'/'+pair.receive.coin+' LP'==colaList[2].title||pair.receive.coin+'/'+pair.pay.coin+' LP'==colaList[2].title">
                  <font v-if="pair.pay.coin+'/'+pair.receive.coin+' LP'==colaList[0].title||pair.receive.coin+'/'+pair.pay.coin+' LP'==colaList[0].title">{{colaList[0].apy}}</font>
                  <font v-if="pair.pay.coin+'/'+pair.receive.coin+' LP'==colaList[1].title||pair.receive.coin+'/'+pair.pay.coin+' LP'==colaList[1].title">{{colaList[1].apy}}</font>
                  <font v-if="pair.pay.coin+'/'+pair.receive.coin+' LP'==colaList[2].title||pair.receive.coin+'/'+pair.pay.coin+' LP'==colaList[2].title">{{colaList[2].apy}}</font>
                </span>
                <span v-else>0%</span>
            </span> -->
          </div>
        </div>
        <div class="tip-item">
          <!-- 兑换价格 -->
          <div class="title flex-sb">
            <div @click="priceDirection = Math.abs(priceDirection - 1)">
              {{ $t('swap.swapPrice') }}
              <span style="display: inline-block; vertical-align: middle">
                <svg-icon :color="'#666'" :icon="'icon-switch'" :size="26" />
              </span>
            </div>
          </div>
          <div>
            <span class="font-b">
              <span
                v-if="priceDirection == 0"
              >1 {{ pair.pay.coin }} ≈ {{toFixed(swapPrice, 8)}} {{ pair.receive.coin }}</span>
              <span
                v-else
              >1 {{ pair.receive.coin }} ≈ {{toFixed(decdiv(1,swapPrice), 8)}} {{ pair.pay.coin }}</span>
            </span>
          </div>
        </div>
        <div class="tip-item">
          <!-- 流动池 -->
          <div class="title">{{ $t('swap.liquidityPool') }}</div>
          <div>
            <span class="font-b">{{pair.pay.reserve}} / {{pair.receive.reserve}}</span>
          </div>
        </div>
        <div class="tip-item" v-if="payTokenQuantity">
          <!-- 您的做市（占比 -->
          <div
            class="title"
          >{{ $t('swap.yourLiquidity') }}（{{ $t('swap.proportion') }}{{receiveTokenQuantity ? userTokenRatio : '0.00'}}%）</div>
          <div class="flex-sb">
            <span class="font-b">{{payTokenQuantity}} / {{receiveTokenQuantity}}</span>
          </div>
        </div>
        <div class="refresh" @click="handleRefreshPair" style="margin-top: 0;">
          <svg-icon
            class="iconfont balance-loading icon-refresh"
            :icon="'icon-refresh'"
            :size="28"
          />
        </div>
      </div>
      <!-- 当前市场暂时无人做市 -->
      <div class="tip-box no-market flex-center" v-if="pair.pairId == -1">
        <div>{{ $t('swap.noPool') }}</div>
        <!-- 立即做市 -->
        <div>{{ $t('swap.addLiquidity') }}</div>
      </div>
      <div class="btn-add" :class="{'disabled': !pair.pairId}" @click="handleAddLiquidity">
        <Loading v-if="loading" />
        {{ $t('swap.addLiquidity') }}
      </div>
    </div>
    <MyLiquidity :liquidityList="myLiquidityList" :pairs="pairs" ref="testR" v-on:addMarket="addMarket" />
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
        :direction="direction"
        :visible="tokenSelectorVisible"
        @token-event="listenTokenEvents"
      />
    </mt-popup>
  </div>
</template>

<script>
import EosTool from "@/utils/eostool";
import { Popup } from "mint-ui";
import TokenSelector from "./components/TokenSelector";
import { getPair, getPairHBG } from "@/utils/swap-new";
import { toFixed, decdiv, decmul } from "@/utils/decimal";
import MyLiquidity from "./components/MyLiquidity"; // 做市最新记录
import TokenRow from "./components/TokenRow";
import Loading from "@/views/components/Loading";
import { symbolToId,GetUrlKey } from "@/utils/common";
import api from "@/api";
import { mapMutations,mapState } from 'vuex'
import dayjs from 'dayjs';
import {symbol_to_id,countdown2,HbgLpValue} from '@/utils/common'

export default {
  name: "market", // 做市
  data() {
    return {
      pair: {
        // 选择后数据
        pay: {
          coin: "EOS",
          contract: "eosio.token",
          amount: null, // 兑换数量
          logo: "", // 图标
        },
        receive: {
          coin: "USDT",
          contract: "tethertether",
          amount: null, // 得到数量
          logo: "", // 图标
        },
        pairId: 0,
        feeRevenue: 0,
        miningRewards: 0,
        timer: null,
        apy:'0%',
      },
      userTokenRatio: "",
      payTokenQuantity: "",
      receiveTokenQuantity: "",
      tokenSelectorVisible: false, // 币种下拉列表 show
      direction: 0,
      selectedToken: null,
      swapPrice: 0, // 兑换价格
      priceDirection: 0, // 兑换价格方向切换
      myLiquidityList: [],
      balance0: null,
      balance1: null,
      balanceTimer: null,
      loading: false,
      timer:null,
      pools:[],
      colaName:null,
      colaList:[
        {
          title:'EOS/USDT LP',
          apy:'1'
        },
        {
          title:'HBG/EOS LP',
          apy:''
        },
        {
          title:'COLA/EOS LP',
          apy:''
        }
      ],
      testList:[],
    };
  },
  components: {
    TokenSelector,
    "mt-popup": Popup,
    MyLiquidity,
    TokenRow,
    Loading,
  },
  props: {
    pairs: Array,
    coins: Array,
    pairsLoading: Boolean,
  },
  watch: {
    pairs: function change() {
      this.handleUserLiquidity();
    },
    $route(to, from) {
      if (from.name == "pool-reduce") {
        this.$emit("refresh", "symbol");
        this.tokenSelectorVisible = false;
      }
    },
  },
  computed: {...mapState(['poolMes'])},//接入vuex > state下具体数据
  created() {

  },
  mounted() {
    if(GetUrlKey('coin',window.location.href)){
      if(GetUrlKey('coin',window.location.href) == 'HBG'){
        this.pair = {
          // 选择后数据
          pay: {
            coin: "HBG",
            contract: "hbgdefitoken",
            amount: null, // 兑换数量
            logo: "", // 图标
          },
          receive: {
            coin: "EOS",
            contract: "eosio.token",
            amount: null, // 得到数量
            logo: "", // 图标
          },
          pairId: null,
          timer: null,
        }
      }else{
        this.pair = {
          // 选择后数据
          pay: {
            coin: "APC",
            contract: "apsisnetcoin",
            amount: null, // 兑换数量
            logo: "", // 图标
          },
          receive: {
            coin: "USDT",
            contract: "tethertether",
            amount: null, // 得到数量
            logo: "", // 图标
          },
          pairId: null,
          timer: null,
        }
      }
    }else{
      let lastPair = this.$store.state.app.lastPair;
       // this.handleUserLiquidity()
       if (lastPair && lastPair.pay) {
         this.pair = lastPair;
       }
    }
    this.$emit("refresh", "symbol");
    // 添加币种
    this.tokenSelectorVisible = false;
    this.colaName=this.pair.pay.coin+'/'+this.pair.receive.coin+' LP'
    // console.log(this.pair);
    this.getPools()
  },
  beforeDestroy() {
    if (this.balanceTimer) {
      clearTimeout(this.balanceTimer);
      this.balanceTimer = null;
    }
  },
  methods: {
    // ...mapMutations(['poolMes_fn']),//接入vuex > mutations下具体方法
    // 监听回传信息
    addMarket(pair) {
      // console.log(pair)
      window.scrollTo(0, 0);
      this.pair = pair;
      console.log(pair)
      setTimeout(()=>{
        this.handleUserLiquidity();
      },6000)
    },
    // 余额获取
    async getCurrencyBalances() {
      if (this.balanceTimer) {
        clearTimeout(this.balanceTimer);
        this.balanceTimer = null;
      }
      let symbol0 = this.pair.pay.coin;
      let symbol1 = this.pair.receive.coin;
      const account = this.$store.state.app.account;
      let balance0 = "0";
      let balance1 = "0";
      if (account.name) {
        balance0 = await EosTool.getCurrencyBalance(
          this.pair.pay.contract,
          account.name,
          symbol0
        );
        balance1 = await EosTool.getCurrencyBalance(
          this.pair.receive.contract,
          account.name,
          symbol1
        );
        if (!balance0) balance0 = "0";
        if (!balance1) balance1 = "0";
      }
      this.balance0 = toFixed(parseFloat(balance0), this.pair.pay.precision);
      this.balance1 = toFixed(
        parseFloat(balance1),
        this.pair.receive.precision
      );
      this.balanceTimer = setTimeout(this.getCurrencyBalances, 6000);
    },
    // 格式化数字精度
    handleInputBlur(way, num) {
      const precision = this.pair[way].precision;
      const amount = toFixed(decmul(Number(num), 1), 8);
      if (Number(amount) !== 0) {
        this.pair[way].amount = toFixed(Number(amount), precision);
      }
      this.$forceUpdate();
    },

    handlePayInput(amount) {
      this.pair.pay.amount = amount.replace(/-/g, "");
      if (this.swapPrice == 0) {
        return;
      }
      const fAmount = parseFloat(this.pair.pay.amount);
      const tAmount = fAmount * this.swapPrice;
      this.pair.receive.amount = toFixed(
        Number(tAmount),
        this.pair.receive.precision
      );
      this.$forceUpdate();
    },

    handleReceiveInput(amount) {
      this.pair.receive.amount = amount.replace(/-/g, "");
      if (this.swapPrice == 0) {
        return;
      }
      const fAmount = parseFloat(this.pair.receive.amount);
      const tAmount = fAmount * (1 / this.swapPrice);
      this.pair.pay.amount = toFixed(Number(tAmount), this.pair.pay.precision);
      this.$forceUpdate();
    },

    //上下币种是否重复
    listenCoin(){
      const pay = JSON.stringify(this.pair.receive);
      const receive = JSON.stringify(this.pair.pay);
      this.pair.pay = JSON.parse(pay);
      this.pair.receive = JSON.parse(receive);
      this.balance0 = null;
      this.balance1 = null;

      this.getCurrencyBalances();
      this.colaName=this.pair.pay.coin+'/'+this.pair.receive.coin+' LP'
      // this.colaList.forEach(e=>{
      //   if(e.title===this.colaName){
      //     this.pair.colaGas=e.apy;
      //   }else{
      //     this.pair.colaGas='0%'
      //   }
      // })
      // 存储选择的pair
      this.$store.dispatch('setLastPair', this.pair);
      this.$emit("refresh", "symbol");
      // this.poolMes_fn(this.pair)
    },

    // 选择币种
    listenTokenEvents(type, data) {
      let _this=this;
      _this.tokenSelectorVisible = false;
      const { direction, item } = data;
      const way = direction == 0 ? 'pay' : 'receive';
      const wayReverse = direction == 0 ? 'receive' : 'pay';
      if(
        _this.pair[wayReverse].contract == item.contract &&
        _this.pair[wayReverse].coin == item.coin
      ){
        _this.listenCoin();
        return;
      }
      _this.pair[way] = item;
      if (type === "close") {
        return;
      }
      _this.handleUserLiquidity();
      // 存储选择的pair
      _this.$store.dispatch('setLastPair', _this.pair);
      this.colaName=this.pair.pay.coin+'/'+this.pair.receive.coin+' LP'
      // this.colaList.forEach(e=>{
        // switch (e.title==this.colaName) {
        //   case false:
        //     this.pair.colaGas='0%'
        //     console.log(1)
        //     break;
        //   case true:
        //     this.pair.colaGas=this.colaList.apy;
        //     // return;
        //     console.log(2)
        //     break;
        // }
      // });
      this.$emit("refresh", "symbol");
      // _this.poolMes_fn(_this.pair)
    },

    // 获取我的做市
    async getMyLiquidity() {
      // alert(1)
      const account = this.$store.state.app.account;
      const params = {
        scopeFormat: true,
        code: "burgertokens",
        scope: account.name,
        table: "accounts",
        json: true,
        limit: -1,
      };
      const result = await EosTool.getTableRows(params);
      let capitals = await api.account.getCapitals({owner: account.name});
      if (capitals.result) {
        capitals = capitals.result.data;
      } else {
        capitals = [];
      }

      // console.log(capitals);
      for (const item of result) {
        const [amount, coin] = item.balance.split(" ");
        item.pair_id = symbolToId(coin);
        item.token = parseInt(amount);
        let capital = capitals.find((c) => c.pairId == item.pair_id);
        item.capital0 = 0;
        item.capital1 = 0;
        if (capital) {
          item.capital0 = capital.capital0;
          item.capital1 = capital.capital1;
        }
      }
      // console.log(result);
      return result;
    },

    // 获取用户做市信息
    async handleUserLiquidity() {
      try {
        const pair = getPair(this.pair.pay, this.pair.receive, this.pairs);
        if (pair) {
          this.pair.pairId = pair.pairId;
          this.pair.pay = pair.token0;
          this.pair.receive = pair.token1;
          // 计算兑换手续费年化预估
          let hbg = getPairHBG(this.pairs);
          let hbgPrice =
            parseFloat(hbg.token1.reserve) / parseFloat(hbg.token0.reserve);
          let priceYear = 0.005 * pair.weight * hbgPrice * 86400 * 365 / 10;
          let poolEOS = 0;
          if (pair.token0.coin == "EOS") {
            poolEOS = parseFloat(pair.token0.reserve) * 2;
          }
          if (pair.token1.coin == "EOS") {
            poolEOS = parseFloat(pair.token1.reserve) * 2;
          }
          if (pair.token0.coin == "APC" && pair.token1.coin == "USDT") {
            // 获取EOS / USDT价格
            let avePrice = 3;
            let paramsTwo = {
              code:'oracle.defi',
              scope:'oracle.defi',
              table:'avgprices',
              json:true
            };
            const result1 = await EosTool.getTableRows(paramsTwo);
            if(result1.length > 0){
              result1.forEach((e) => {
                if(e.key == 300){
                  avePrice = (e.avg_price /10000).toFixed(4);
                }
              });
            }
            let poolUSDT = parseFloat(pair.token1.reserve) * 2
            poolEOS = poolUSDT / avePrice;
          }

          this.pair.feeRevenue = parseFloat(
            (priceYear / poolEOS) * 0.55 * 100
          ).toFixed(2);
          this.pair.feeRevenue = isNaN(this.pair.feeRevenue)
            ? 0
            : this.pair.feeRevenue;
          // console.log(this.pair.feeRevenue)
          let priceYear2 =
            hbgPrice * pair.weightProportion * 0.02 * 86400 * 365;
          this.pair.miningRewards = parseFloat(
            (priceYear2 / poolEOS) * 100 / 2
          ).toFixed(2);
          // console.log(pair.weightProportion)
          this.priceDirection = 0;
          this.swapPrice = parseFloat(this.pair.pay.reserve)
            ? parseFloat(this.pair.receive.reserve) /
              parseFloat(this.pair.pay.reserve)
            : 0;

          let pay = this.pair.pay;
          let receive = this.pair.receive;
          // my liquidity
          const result = await this.getMyLiquidity();
          if (result.length > 0) {
            const item = result.find((v) => v.pair_id === pair.pairId);
            if (item) {
              // 用户当前池token
              const uToken = item.token; // 用户当前池token
              const cToken = pair.totalLiquidity; // 当前池总共liquidity
              item.cToken = cToken;
              item.uToken = uToken;
              const radio = decdiv(uToken, cToken);
              this.userTokenRatio = toFixed(decmul(radio, 100), 2);
              this.receiveTokenQuantity = `${toFixed(
                decmul(parseFloat(receive.reserve), radio),
                receive.precision
              )} ${receive.coin}`;
              this.payTokenQuantity = `${toFixed(
                decmul(parseFloat(pay.reserve), radio),
                pay.precision
              )} ${pay.coin}`;
            }
          }
          this.myLiquidityList = result;
          // 挖矿权重获取
          const minePairs = this.$store.state.app.minePairs;
          const minePairsItem = minePairs.find((v) => v.pairId === pair.pairId);
          this.minePairWeight = null;
          if (minePairsItem) {
            this.minePairWeight = minePairsItem.weight;
          }

          this.$forceUpdate();
        } else {
          this.pair.pairId = -1;
        }
      } catch (error) {
        console.log(error); // eslint-disable-line
      }

      // get balances
      setTimeout(this.getCurrencyBalances, 200);
    },
    // 刷新池子
    handleRefreshPair() {
      this.$emit("refresh", "symbol");
    },
    // 增加做市
    async handleAddLiquidity() {
      if (!this.$store.state.app.account.name) {
        this.$toast(this.$t("public.noauth"));
        return;
      }

      const pay = this.pair.pay;
      const receive = this.pair.receive;
      // 余额不足
      if (parseFloat(this.balance0) < Number(pay.amount)) {
        this.$toast(
          this.$t("swap.balanceInsufficient", {
            code: pay.coin,
          })
        );
        return;
      }

      // 未输入支付数量
      if (parseFloat(pay.amount) <= 0 || !Number(pay.amount)) {
        this.$toast(this.$t("swap.inputAmount"));
        return;
      }
      // 没有做市商池子
      // console.log(this.pair);
      if (!this.pair.pairId) {
        this.$toast(this.$t("swap.noPool"));
        return;
      }
      if (!this.comfirmVisible && Number(this.premiumRate) >= 10) {
        this.comfirmVisible = true;
        return;
      }
      if (this.loading) return;
      this.loading = true;

      const pathIds = this.pair.pairId;
      const obj = {
        code: pay.contract,
        toAccount: "hamburgerswp",
        quantity: `${toFixed(Number(pay.amount), pay.precision)} ${pay.coin}`,
        memo: `deposit:${pathIds}`,
      };
      const obj2 = {
        code: receive.contract,
        toAccount: "hamburgerswp",
        quantity: `${toFixed(Number(receive.amount), receive.precision)} ${
          receive.coin
        }`,
        memo: `deposit:${pathIds}`,
      };
      const account = this.$store.state.app.account;
      const actions = [
        {
          account: obj.code,
          name: "transfer",
          authorization: [
            {
              actor: account.name, // 转账者
              permission: account.authority || "active",
            },
          ],
          data: {
            from: account.name,
            to: obj.toAccount,
            quantity: obj.quantity,
            memo: obj.memo,
          },
        },
        {
          account: obj2.code,
          name: "transfer",
          authorization: [
            {
              actor: account.name, // 转账者
              permission: account.authority || "active",
            },
          ],
          data: {
            from: account.name,
            to: obj2.toAccount,
            quantity: obj2.quantity,
            memo: obj2.memo,
          },
        },
        // {
        //   account: "hamburgerswp",
        //   name: "deposit",
        //   authorization: [
        //     {
        //       actor: account.name, // 转账者
        //       permission: account.authority || "active",
        //     },
        //   ],
        //   data: {
        //     owner: account.name,
        //     pair_id: pathIds,
        //   },
        // },
      ];
      const result = await EosTool.transact(actions);
      this.loading = false;
      this.comfirmVisible = false;
      if (!result.transaction_id) {
        // 错误信息
        const res = EosTool.handleScatterError(result);
        this.$toast(res.type === "lang" ? this.$t(res.text) : res.text);
        return;
      }
      // 兑换成功
      this.$toast({
        message: this.$t("pool.poolSuccess"),
        position: "center",
        duration: 2000,
      });
      this.pair.receive.amount = null;
      this.pair.pay.amount = null;
      setTimeout(() => {
        this.$emit("refresh", "symbol");
      }, 1000);
    },
    decdiv(a, b) {
      return decdiv(a, b);
    },
    toFixed(a, b) {
      return toFixed(a, b);
    },
    // 挖矿
    handleToMining() {
      // this.$router.push({name: 'mining'})
    },
    // 前往创建市场
    async handleToCreate() {
      this.$router.push({
        name: "create",
      });
    },
    async getPools() {
      const titles = [
        'EOS/USDT LP',
        'HBG/EOS LP',
        'COLA/EOS LP',
      ];
      const params = {
        code: 'coladexpools',
        scope: 'coladexpools',
        table: 'pools',
        json: true
      }
      const rows = await EosTool.getTableRows(params);
      if (rows && rows.length > 0) {
        if (this.timer) {
          clearInterval(this.timer);
        }
        const pools = [];
        for (let i = 0; i < rows.length; i++) {
          const p = rows[i];
          p.title = titles[i];
          p.coin = p.sym.split(',')[1];
          const total = p.total_reward.split(' ');
          p.total = parseFloat(total) + ' COLA';
          pools.push(p);
        }
        this.pools = pools;
        this.countdown();
        this.timer = setInterval(this.countdown, 1000);
      }
      // this.getAPYs();
    },
    countdown() {
      const pools = this.pools.concat();
      for (let p of pools) {
        const endtime = p.epoch_time + p.duration;
        const endDate = new Date(endtime * 1000);
        const startDate = new Date(p.epoch_time * 1000);
        const nowDate = new Date();
        p.endtime = dayjs(endDate).format('YYYY-MM-DD HH:mm:ss');
        p.started = nowDate > startDate;
        p.ended = nowDate > endDate;
        const cd = countdown2(p.started ? endDate : startDate, nowDate);
        p.countdown = cd.hours + ':' + cd.minutes+ ':' + cd.seconds;
      }
      this.pools = pools;
    },
    async getAPYs(){
      const colaPair = this.getPair(symbol_to_id('LPAB'));
      let swapPrice=0;
      if(colaPair.token0.coin=='EOS'){
        swapPrice=parseFloat(colaPair.token0.reserve) / parseFloat(colaPair.token1.reserve)
      }else{
        swapPrice=parseFloat(colaPair.token1.reserve) / parseFloat(colaPair.token0.reserve)
      }
      // let turnSwapPrice=isNaN(swapPrice) ? 0.0001 : swapPrice;

      // for (let p of this.pools) {
      //   await this.getAPY(p, turnSwapPrice);
      // }

    },
    async getAPY(p, colaPrice) {
      const pair = this.getPair(symbol_to_id(p.sym.split(',')[1]));
      // 产量
      const stakedValue = HbgLpValue(pair);
      const total = parseFloat(p.total_reward.split(' ')[0]);
      let issuePerSecond = total / p.duration;
      const issuePerSecondValue = issuePerSecond * colaPrice;
      const yearPct = issuePerSecondValue * 86400 * 365 / stakedValue;
      p.apy = (yearPct * 100).toFixed(2) + '%';
      this.testList.push(p);
      this.colaList[0]=this.testList[0];
      this.colaList[1]=this.testList[1];
      this.colaList[2]=this.testList[2];
    },
    getPair(code) {
      return this.pairs.find(p => p.pairId == code);
    },
  },
};
</script>
<style lang="scss" scoped>
.market-container {
  .market-main {
    position: relative;
    margin: 0 25px 25px 25px;
    padding: 120px 20px 20px 20px;
    width: 700px;
    box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
    border-radius: 30px;
  }
  .create {
    color: $color-theme;
    text-align: right;
    margin-bottom: 15px;
  }
  .icon-switch {
    position: absolute;
    z-index: 9;
    left: 50%;
    margin: -39px 0 0 -45px;
    width: 90px;
    height: 90px;
    background-color: #fff;
    border-radius: 45px;
    .icon {
      position: absolute;
      z-index: 1;
    }
  }

  .tip-box {
    position: relative;
    font-size: 26px;
    margin-top: 20px;
    padding: 10px 30px;
    border-radius: 10px;

    .weight {
      margin-top: 0;
      font-size: 26px;
      vertical-align: middle;

      &.has-weigtht {
        .weight-number {
          color: $color-theme;
        }
      }

      svg {
        margin: 5px 2px 0 0;
      }
    }

    .waiting {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba($color: #f3f3f3, $alpha: 0.9);
      z-index: 9;
      border-radius: 14px;
    }

    .tip-item {
      margin-bottom: 20px;

      .title {
        color: #999;
      }
      .balance-loading {
        color: #999;
      }

      & > div:first-child {
        margin-bottom: 6px;
      }

      div:nth-child(2) {
        color: #333;
      }
    }

    .refresh {
      color: #999;
      position: absolute;
      right: 32px;
      bottom: 32px;
    }
  }

  .no-market {
    flex-direction: column;
    font-size: 28px;
    padding: 100px 20px;
    text-align: center;

    div:nth-child(1) {
      color: #8b572a;
      font-size: 30px;
    }

    div:nth-child(2) {
      margin: 15px 0 10px 0;
    }
  }

  .btn-add {
    position: relative;
    height: 90px;
    background: $btn-bg;
    color: $btn-color;
    margin: 20px 50px 20px 50px;
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

  .rule {
    color: #999;
    font-size: 26px;
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
      margin: 35px 0 50px;
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
      text-indent: 2em;
      line-height: 47px;
      font-size: 30px;
    }
  }
  .font-b {
    font-size: 27px !important;
  }
  .word-no-indent {
    text-indent: 0 !important;
  }
}
</style>
