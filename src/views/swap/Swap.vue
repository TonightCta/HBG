<template>
  <div class="swap-container">
    <div class="swap-main">
      <!-- 支付币种 -->
      <TokenRow
        :token="pair.pay"
        :showBalance="true"
        :balance="balance0"
        :title="$t('swap.from')"
        :amount="pair.pay.amount"
        @onBlur="(amt) => handleInputBlur('pay', amt)"
        @onInput="(amt) => handlePayInput(amt)"
        @onBalanceClick="handlePayInput(balance0)"
        @onTokenClick="
          (direction = 0), (selectedToken = pair.pay);
          tokenSelectorVisible = true;
        "
      />
      <!-- 上下换位 -->
      <div @click="handleChangeCoin" class="icon-switch flex-center">
        <svg-icon
          class="icon"
          :color="$store.state.app.themeColor"
          :icon="'icon-switch2'"
          :size="76"
        />
      </div>
      <TokenRow
        style="margin-top: 12px"
        :token="pair.receive"
        :showBalance="true"
        :balance="balance1"
        :title="$t('swap.to')"
        :amount="pair.receive.amount"
        @onBlur="(amt) => handleInputBlur('receive', amt)"
        @onInput="(amt) => handleReceiveInput(amt)"
        @onBalanceClick="handleReceiveInput(balance1)"
        @onTokenClick="
          (direction = 1), (selectedToken = pair.receive);
          tokenSelectorVisible = true;
        "
      />
      <!-- <p style="height:20px;background:#ccc;">{{pair.pay.amount}}</p> -->
      <div class="tip-box" v-if="bestPairPath.length > 0">
        <!-- 蒙版 -->
        <div class="waiting flex-center" v-if="pairsLoading">
          <svg-icon
            :color="'#666'"
            :icon="'icon-refresh'"
            :size="32"
            class="el-icon-loading"
          />
        </div>

        <div class="tip-item">
          <div class="title flex-sb">
            <div>
              {{ $t("swap.swapPrice") }}
              <span style="display: inline-block; vertical-align: middle">
                <svg-icon :color="'#666'" :icon="'icon-switch'" :size="26"  @click.native="priceDirection = Math.abs(priceDirection - 1)"/>
                <svg-icon :color="'#666'" :icon="'icon-banshou'" :size="26" style="marginLeft:.2rem;" @click.native="openDep"/>
              </span>
            </div>
            <span class="charge" v-if="bestPairPath.length <= 1"
              >{{ $t("swap.fees") }}: {{ totalFee * 100 }}%</span
            >
            <span class="charge" v-else
              >{{ $t("swap.fees") }}:
              <span v-if="bestTokenPath.length > 2 && pair.pay.amount != 0 && pair.pay.amount != null">{{ toFixed(totalFee * 100 * bestPairPath.length, 1) }}%</span>
              <span v-else>{{ toFixed(totalFee * 100, 1) }}%</span>
            </span>
            <!-- <span style="color:#ffa300;">{{ $t("swap.swapRecords") }} ></span> -->
          </div>
          <div>
            <!-- 兑换价格 -->
            <span class="font-b">
              <span v-if="priceDirection == 0"
                >1 {{ pair.pay.coin }} ≈ {{ toFixed(swapPrice, 8) }}
                {{ pair.receive.coin }}</span
              >
              <span v-else
                >1 {{ pair.receive.coin }} ≈
                {{ toFixed(decdiv(1, swapPrice), 8) }} {{ pair.pay.coin }}</span
              >
            </span>
            <!-- 滑点 -->
            <span @click="slidePointFirstVisible = true" class="slippage">
              <span v-if="Number(pair.pay.amount) && Number(premiumRate) !== 0">
                <span class="embed1" v-if="Number(premiumRate) <= 1">
                  <span style="margin-right: 2px">
                    <span class="less-icon" v-if="Number(premiumRate) < 0.01"
                      >&lt;</span
                    >
                    <span>{{ premiumRate }}%</span>
                  </span>
                  <svg-icon :icon="'icon-info'" :size="24" />
                </span>
                <span
                  class="embed2"
                  v-else-if="
                    Number(premiumRate) >= 1 && Number(premiumRate) <= 5
                  "
                >
                  <span style="margin-right: 2px">{{ premiumRate }}%</span>
                  <svg-icon :icon="'icon-info'" :size="24" />
                </span>
                <span class="embed3" v-else>
                  <span style="margin-right: 2px">{{ premiumRate }}%</span>
                  <svg-icon :icon="'icon-info'" :size="24" />
                </span>
              </span>
            </span>
          </div>
        </div>

        <div class="tip-item" v-if="bestPairPath.length <= 1">
          <div class="title">
            <!-- 流动池 -->
            <span class="mr">{{ $t("swap.liquidityPool") }}</span>
          </div>
          <div class="flex-sb">
            <div class="font-b">
              {{ pair.pay.reserve }} / {{ pair.receive.reserve }}
            </div>
            <div class="btn-refresh" @click="handlerReshPair">
              <svg-icon
                :icon="'icon-refresh'"
                :size="28"
                color="#999"
                class="iconfont balance-loading icon-refresh"
              />
            </div>
          </div>
        </div>

        <div class="tip-item" v-if="bestPairPath.length == 1">
          <div class="title">
            <span> {{ $t("swap.miningWeight") }}</span>

          </div>
          <div @click="handleToMining">
            <div
              class="weight flex-fs has-weigtht"
              v-if="parseFloat(weightNumber) !== 0"
            >
              <!-- 挖矿权重 -->
              <span>{{ $t("swap.tradeMiningWeight") }}:</span>
              <svg-icon
                :color="$store.state.app.themeColor"
                :icon="'icon-mine'"
                :size="28"
              />
              <span class="weight-number" v-if="parseFloat(weightNumber)">{{
                weightNumber
              }}</span>
              <svg-icon
                :icon="'icon-refresh'"
                :size="28"
                class="iconfont icon-refresh el-icon-loading"
                v-else
              />
            </div>
            <div class="weight flex-fs" v-else>
              <!-- 挖矿权重 -->
              <span>{{ $t("swap.tradeMiningWeight") }}:</span>
              <svg-icon :color="'#333'" :icon="'icon-mine'" :size="28" />
              <span>0</span>
            </div>
          </div>
        </div>
        <div class="tip-item" v-if="bestTokenPath.length > 2 && pair.pay.amount != 0 && pair.pay.amount != null">
          <!-- 多路径兑换 -->
          <div class="title" @click="slippageDescVisible = true">
            <span style="margin-right: 3px">{{ $t("swap.multiPath") }}</span>
            <svg-icon :icon="'icon-info'" :size="24" />
          </div>
          <div class="multi-path flex-center">
            <div
              :key="index"
              class="flex"
              v-for="(item, index) in bestTokenPath"
            >
              <span class="tag" v-if="index">></span>
              <div class="route flex" v-if="item.contract">
                <img :src="url(item.contract, item.coin)" onerror="this.src='/static/images/eos.png'" alt />
                <span>{{ item.coin }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无流动池 -->
      <div
        class="tip-box no-market flex-center"
        v-if="bestPairPath.length == 0"
      >
        <div>{{ $t("swap.noPool") }}</div>
        <!-- 立即做市 -->
        <div @click="handlerToMakerTab">{{ $t("swap.addLiquidity") }} ></div>
      </div>

      <div @click="handleToRecord" class="resetExLog">
        {{ $t("swap.swapRecords") }} >
      </div>
      <!-- 兑换 disabled-->
      <div
        :class="{ disabled: bestPairPath.length == 0 }"
        @click="handleSubmit(false)"
        class="btn-swap"
      >
        <Loading v-if="loading" />
        {{ $t("swap.swap") }}
      </div>


      <!-- 闪兑规则 -->
      <div class="flex-sb" v-if="false">
        <span></span>
        <span class="rule">{{ $t("swap.swapRules") }} ></span>
      </div>
    </div>

    <!-- 币种列表 -->
    <mt-popup
      position="bottom"
      style="width: 100%; border-radius: 10px 10px 0 0"
      v-model="tokenSelectorVisible"
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

    <!-- 多路径说明 -->
    <mt-popup
      class="popup"
      popup-transition="popup-fade"
      v-model="slippageDescVisible"
    >
      <div class="tip-popup">
        <div @click="handleClose" class="close">
          <svg-icon :color="'#000'" :icon="'icon-close-gray'" :size="20" />
        </div>
        <div class="title">{{ $t("swap.multiPath") }}</div>
        <div class="word" style="color: #333">
          {{ $t("swap.multiPathDescription") }}
        </div>
      </div>
    </mt-popup>
    <!-- 滑点说明 -->
    <mt-popup
      class="popup"
      popup-transition="popup-fade"
      v-model="slidePointFirstVisible"
    >
      <div class="tip-popup">
        <div @click="handleClose" class="close">
          <svg-icon :color="'#000'" :icon="'icon-close-gray'" :size="20" />
        </div>
        <div class="title">{{ $t("swap.priceSlippage") }}</div>
        <!-- 实际兑换价格已上浮{ -->
        <div class="word priceUp" style="color: #333">
          {{ $t("swap.priceUp") }}:
          <span class="value">
            <span class="embed1" v-if="Number(premiumRate) <= 1">
              <span style="margin-right: 2px">{{ premiumRate }}%</span>
            </span>
            <span
              class="embed2"
              v-else-if="Number(premiumRate) >= 1 && Number(premiumRate) <= 5"
            >
              <span style="margin-right: 2px">{{ premiumRate }}%</span>
            </span>
            <span class="embed3" v-else>
              <span style="margin-right: 2px">{{ premiumRate }}%</span>
            </span>
          </span>
        </div>
        <div class="set-value">{{ $t("swap.slippageDescription") }}</div>
        <!-- 设置滑点保护值： -->
        <div
          @click="
            setSlippageClick();
            handleClose();
          "
          class="set-values"
        >
          {{ $t("swap.slippageProtection") }}: {{ slippageTolerance }}% >
        </div>
      </div>
    </mt-popup>
    <!-- 交易确认 -->
    <mt-popup
      class="popup"
      position="bottom"
      style="width: 100%"
      v-model="comfirmVisible"
    >
      <div class="tip-popup">
        <div @click="handleClose" class="close">
          <svg-icon :color="'#000'" :icon="'icon-close-gray'" :size="20" />
        </div>
        <!-- 交易确认 -->
        <div class="title">{{ $t("swap.transactionConfirmation") }}</div>
        <p class="word2" style="color: red">
          <span v-if="userSetting">{{ $t("swap.slippageConfirmation") }}</span>
          <span v-else>{{ $t("swap.slippageConfirmationUser") }}{{userSelfSetPoint}},{{$t("swap.slippageConfirmationUserSEC")}}</span>
        </p>
        <div class="comfirm-content content">
          <div class="item flex-sb flex-ai-fs">
            <div class="item-left flex">
              <img :src="url(pair.pay.contract, pair.pay.coin)" onerror="this.src='/static/images/eos.png'" alt />
              <div class="left-content">
                <div>{{ pair.pay.coin }}</div>
                <div>{{ pair.pay.contract }}</div>
              </div>
            </div>
            <div class="item-right">{{ pair.pay.amount }}</div>
          </div>
          <div class="item flex-sb flex-ai-fs">
            <div class="item-left flex">
              <img :src="url(pair.receive.contract, pair.receive.coin)" onerror="this.src='/static/images/eos.png'" alt />
              <div class="left-content">
                <div>{{ pair.receive.coin }}</div>
                <div>{{ pair.receive.contract }}</div>
              </div>
            </div>
            <div class="item-right">{{ pair.receive.amount }}</div>
          </div>
          <div class="forward-icon">
            <svg-icon
              :color="$store.state.app.themeColor"
              :icon="'icon-forward'"
              :size="30"
            />
          </div>
        </div>
        <div class="word2">
          <span>{{ $t("swap.priceSlippage") }}:</span>
          <span>{{ premiumRate }}%</span>
        </div>
        <!-- 确定 -->
        <div class="flex-sb">
          <button @click="handleComfirm" class="btn1">
            <Loading v-if="loading" />
            {{ $t("public.confirm") }}
          </button>
          <div style="width: 40px"></div>
          <button @click="comfirmVisible = false" class="btn1 btn2">
            {{ $t("public.cancel") }}
          </button>
        </div>
      </div>
    </mt-popup>
    <!-- 兑换设置 -->
    <PopupSe :width="85" :title ="this.$t('swap.swapsetting')" ref="openRe" v-if="isSet">
      <p class="isMultipath">
        多路径兑换
        <mt-switch v-model="isMultipath"></mt-switch>
      </p>
    </PopupSe>
  </div>
</template>

<script>
import EosTool from "@/utils/eostool";
import { Popup,Switch } from "mint-ui";
import { getPath, getPair } from "@/utils/swap-new";
import { toFixed, decsub, decmul, decdiv } from "@/utils/decimal";
import Loading from "@/views/components/Loading";
import TokenRow from "./components/TokenRow";
import TokenSelector from "./components/TokenSelector";
import {mapState,mapMutations} from 'vuex'
import PopupSe from './components/popup'
import {GetUrlKey,coinUrl} from '@/utils/common'

export default {
  name: "exchange", // 兑换
  data() {
    return {
      loading: false,
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
        pairId: null,
        timer: null,
      },
      premiumRate: 0, // 溢价率 =（当前价格-预估成交价）/当前价格
      totalFee: 0.003, // 手续费
      balance0: null, // 余额
      balance1: null, // 余额1
      tokenSelectorVisible: false, // 币种下拉列表 show
      direction: 0,
      selectedToken: null,
      bestPairPath: [{ pariId: 0 }], // 路线数据
      bestTokenPath: [],
      bestAmount: null, // 预计可得数量
      swapPrice: 0, // 兑换价格
      priceDirection: 0, // 兑换价格方向切换
      balanceTimer: null,
      payInputTimer: null,
      getInputTimer: null,
      selectCoinTimer: null,
      weightsList: [], // 挖矿权重列表数据
      // weightNumber: null, // 挖矿权重
      weightNumber: 0,
      comfirmVisible: false, // 交易确认
      slippageDescVisible: false,
      slidePointFirstVisible: false,
      userSetting:true, //用户预设滑点保护判断
      userSelfSetPoint:null, //用户预设滑点保护值
      isSet:false,//兑换设置
      isMultipath:true,
    };
  },
  components: {
    "mt-popup": Popup,
    Loading,
    TokenSelector,
    TokenRow,
    PopupSe,
    'mt-switch':Switch
  },
  props: {
    pairs: Array,
    coins: Array,
    pairsLoading: Boolean,
  },
  computed: {
    ...mapState(['pageSwapMes']),
    slippageTolerance() {
      return toFixed(this.$store.state.app.slippageTolerance / 10000, 2);
    },
  },
  watch: {
    pairs: function change() {
      // 触发更新
      const newTimer = new Date().getTime();
      if (newTimer - this.pair.timer > 50) {
        this.pair.timer = new Date().getTime();
      }
    },
    coins: function change() {
      // 替换当前的数据
      let tokenId = this.pair.pay.contract + "-" + this.pair.pay.coin;
      let coin = this.coins.find((c) => c.tokenId == tokenId);
      if (coin) {
        this.pair.pay = coin;
      }
      tokenId = this.pair.receive.contract + "-" + this.pair.receive.coin;
      coin = this.coins.find((c) => c.tokenId == tokenId);
      if (coin) {
        this.pair.receive = coin;
        // alert(coin.reserve);
      }
    },
    "pair.timer": async function change() {
      this.pair.pairId = null;
      const pair = await getPair(this.pair.pay, this.pair.receive, this.pairs);
      if (pair) {
        let isPayToken0 =
          pair.token0.contract == this.pair.pay.contract &&
          pair.token0.coin == this.pair.pay.coin;
        if (isPayToken0) {
          this.pair.pay = pair.token0;
          this.pair.receive = pair.token1;
        } else {
          this.pair.pay = pair.token1;
          this.pair.receive = pair.token0;
        }
        this.pair.pairId = pair.pairId;
        this.handleGetWeights();
      }
      this.getCurrencyBalances();
      setTimeout(this.handleGetPrice, 500);
    },
    "$store.state.app.config": {
      handler(val) {
        this.totalFee = parseFloat(val.totalFee);
      },
      depth: true,
    },
    isMultipath(val,oldVal){//多路径切换
      this.handleInputPrice()
    }
  },
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
      if (lastPair && lastPair.pay) {
        this.pair = lastPair;
      }
    }
    this.$emit("refresh", "symbol");
  },
  beforeDestroy() {
    if (this.balanceTimer) {
      clearTimeout(this.balanceTimer);
      this.balanceTimer = null;
    }
  },
  methods: {
    ...mapMutations(['pageSwapMes_fn']),
    url(contract, coin) {
      return coinUrl(contract, coin);
    },
    // 兑换
    async handleSubmit(turn) {
      if (!this.$store.state.app.account.name) {
        this.$toast(this.$t("public.noauth"));
        return;
      }
      if (this.bestPairPath.length == 0) return;
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
      if (this.bestPairPath.length == 0) {
        this.$toast(this.$t("swap.noPool"));
        return;
      }
      if (!this.comfirmVisible && Number(this.premiumRate) >= 10) {
        this.userSetting=true;
        this.comfirmVisible = true;
        return;
      }
      if(!turn){
        if(this.$store.state.app.slippageTolerance!=0){
          if(Number(this.premiumRate) >= Number(this.$store.state.app.slippageTolerance)){
            this.userSetting=false;
            this.userSelfSetPoint=this.$store.state.app.slippageTolerance+'%'
            this.comfirmVisible = true;
            return;
          }
        }
      }
      if (this.loading) return;
      this.loading = true;

      // 滑点保护值 计算
      let percentPoint = localStorage.getItem("slippageTolerance") || 3;
      percentPoint = parseFloat(percentPoint);
      percentPoint = decsub(1, decdiv(percentPoint, 100)) || 1;
      let getNumber = parseFloat(receive.amount);
      const decimalPow = Math.pow(10, receive.precision);
      getNumber = decmul(getNumber, decimalPow);
      percentPoint = parseInt(decmul(percentPoint, getNumber));
      const pathIds = this.bestPairPath.map((x) => x.pairId).join("-");
      // `swap:${pathIds},min:${percentPoint}`
      const obj = {
        code: pay.contract,
        toAccount: "hamburgerswp",
        quantity: `${toFixed(Number(pay.amount), pay.precision)} ${pay.coin}`,
        memo: `swap:${pathIds},min:${percentPoint}`,
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
        message: this.$t("swap.swapSuccess"),
        position: "center",
        duration: 2000,
      });
      this.pair.receive.amount = null;
      this.pair.pay.amount = null;
      setTimeout(() => {
        this.$emit("refresh", "symbol");
      }, 1000);
    },

    // 获取当前价格
    async handleGetPrice() {
      const payTokenId = `${this.pair.pay.contract}-${this.pair.pay.coin}`;
      const receiveTokenId = `${this.pair.receive.contract}-${this.pair.receive.coin}`;
      const result = getPath(payTokenId, receiveTokenId, 0, 0, this.pairs,1,this.isMultipath);
      this.bestAmount = result.bestAmount;
      this.bestPairPath = result.bestPairPath;
      this.bestTokenPath = result.bestTokenPath;
      this.swapPrice = this.bestAmount;
      this.premiumRate = 0;
      // console.log(this.bestTokenPath )
    },

    /*
     * 获取预估成交价
     * @num 支付币种数量
     * */
    async handleInputPrice(amount, way) {
      if (!parseFloat(amount)) {
        this.handleGetPrice();
        const waykey = way === 2 ? "pay" : "receive"; // 刚好相反
        this.pair[waykey].amount = null;
        return;
      }
      const waykey = way === 1 ? "pay" : "receive"; // 刚好相反
      const waykeyInverse = way === 1 ? "receive" : "pay"; // 刚好相反
      const payCoin = this.pair[waykey];
      const receiveCoin = this.pair[waykeyInverse];
      const fees = way === 1 ? this.totalFee : -1 * this.totalFee;
      const payTokenId = `${payCoin.contract}-${payCoin.coin}`;
      const receiveTokenId = `${receiveCoin.contract}-${receiveCoin.coin}`;
      // console.log(payTokenId, receiveTokenId, amount, waykey);
      const result0 = getPath(
        payTokenId,
        receiveTokenId,
        0,
        0,
        this.pairs,
        way,
        this.isMultipath
      );
      const result1 = getPath(
        payTokenId,
        receiveTokenId,
        amount,
        fees,
        this.pairs,
        way,
        this.isMultipath
      );
      this.bestAmount = result1.bestAmount;
      this.bestPairPath = result1.bestPairPath;
      this.bestTokenPath = result1.bestTokenPath;
      // console.log(this.bestTokenPath)

      this.pair[waykeyInverse].amount = this.bestAmount + "";

      // price
      let orginPrice = result0.bestAmount;
      if (way === 1) {
        this.swapPrice = decdiv(this.bestAmount, amount);
      } else {
        orginPrice = 1 / orginPrice;
        this.swapPrice = 1 / decdiv(this.bestAmount, amount);
      }

      // 溢价率 =(初始价格-兑换价格) / 初始价格
      const premiumRate = Math.abs(
        decdiv(decsub(orginPrice, this.swapPrice), orginPrice) * 1
      );
      this.premiumRate = toFixed(decmul(premiumRate, 100), 2);
      // 负值、格式化
      this.handleInputBlur(waykeyInverse, this.bestAmount);
    },

    // 支付额度输入 balance 点击余额带入值
    handlePayInput(amount) {
      this.pair.pay.amount = amount.replace(/-/g, "");
      const fAmount = parseFloat(this.pair.pay.amount);
      if (fAmount === 0) {
        this.pair.receive.amount = "0";
        return;
      }
      this.payInputTimer && clearTimeout(this.payInputTimer);
      this.payInputTimer = setTimeout(() => {
        this.handleInputPrice(fAmount, 1);
      }, 300);
    },
    // 得到额度输入
    handleReceiveInput(amount) {
      this.pair.receive.amount = amount.replace(/-/g, "");
      const fAmount = parseFloat(this.pair.receive.amount);
      if (fAmount === 0) {
        this.pair.pay.amount = "0";
        return;
      }

      this.getInputTimer && clearTimeout(this.getInputTimer);
      this.getInputTimer = setTimeout(() => {
        this.handleInputPrice(fAmount, 2);
      }, 300);
    },

    // 跟换支付/得到 方向
    handleChangeCoin() {
      const pay = JSON.stringify(this.pair.receive);
      const receive = JSON.stringify(this.pair.pay);
      this.pair.pay = JSON.parse(pay);
      this.pair.receive = JSON.parse(receive);
      if (parseFloat(this.pair.pay.amount)) {
        this.handleInputPrice(this.pair.pay.amount, 1);
      } else {
        this.handleGetPrice();
      }
      this.balance0 = null;
      this.balance1 = null;

      this.getCurrencyBalances();
      // 存储选择的pair
      this.$store.dispatch('setLastPair', this.pair);
      this.pageSwapMes_fn(this.pair);
      this.$emit("refresh", "symbol");
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
    // 选择币种
    listenTokenEvents(type, data) {
      this.tokenSelectorVisible = false;
      if (type === "close") {
        return;
      }
      this.pair.pay.amount = null;
      this.pair.receive.amount = null;
      const { direction, item } = data;
      const way = direction == 0 ? "pay" : "receive";
      const wayReverse = direction == 0 ? "receive" : "pay";
      if (
        this.pair[wayReverse].contract == item.contract &&
        this.pair[wayReverse].coin == item.coin
      ) {
        this.handleChangeCoin();
        return;
      }
      this.pair[way] = item;
      // 存储选择的pair
      this.$store.dispatch('setLastPair', this.pair);
      this.pageSwapMes_fn(this.pair);
      this.$emit("refresh", "symbol");
      this.selectCoinTimer && clearTimeout(this.selectCoinTimer);
      this.selectCoinTimer = setTimeout(() => {
        this.pair.timer = new Date().getTime();
      }, 500);
    },
    // 刷新池子
    handlerReshPair() {
      this.$emit("refresh", "symbol");
    },
    // 跳转到兑换记录
    handleToRecord() {
      this.$router.push({
        name: "swap-record",
      });
    },
    // 立即做市 - tab 页面
    handlerToMakerTab() {
      sessionStorage.setItem("marketNewCoin", JSON.stringify(this.pair));
      this.$router.push({
        name: "pool",
      });
    },
    // 立即做市
    async handlerGoMarket() {
      this.$router.push({
        name: "pool",
        params: {
          pairId: this.pair.pairId,
        },
      });
    },
    // 关闭弹窗
    handleClose() {
      this.comfirmVisible = false; // 再次确认弹窗
      this.slippageDescVisible = false;
      this.slidePointFirstVisible = false;
    },
    // 跳转公告
    handleJump() {
      // 跳转关于衰减机制
      //const lang = this.$store.state.app.language.toLowerCase();
    },
    // 滑点大于10再次确认
    handleComfirm() {
      this.handleSubmit(true);
    },
    // 跳转派盾
    handlePeckshield() {},
    // 获取交易挖矿权重
    async handleGetWeights() {
      const params = {
        code: "hbgtrademine",
        scope: "hbgtrademine",
        table: "pools",
        limit: -1,
        json: true,
      };
      this.weightNumber = null;
      if (this.weightsList > 0) {
        const item = this.weightsList.find(
          (v) => v.pairId === this.pair.pairId
        );
        if (item) {
          this.weightNumber = toFixed(parseFloat(item.weight), 1);
        } else {
          this.weightNumber = 0;
        }
        return;
      }
      const result = await EosTool.getTableRows(params);
      if (result && result.length > 0) {
        this.weightsList = result;

        const item = result.find((v) => v.pair_id === this.pair.pairId);
        if (item) {
          this.weightNumber = toFixed(parseFloat(item.weight), 1);
        } else {
          this.weightNumber = 0;
        }
      }
    },
    // 挖矿
    handleToMining() {
      // this.$router.push({
      //   name: 'mining',
      //   query: {
      //     action: 1,
      //   },
      // });
    },
    decdiv(a, b) {
      return decdiv(a, b);
    },
    toFixed(a, b) {
      return toFixed(a, b);
    },
    setSlippageClick() {
      this.slippageDescVisible = false;
      this.$eventbus.$emit("setting", "slippage");
    },
    openDep(){//兑换设置
      this.isSet = true;
      setTimeout(() => {
        this.$refs.openRe.openRe(true)
      },10);
    },
  },
};
</script>

<style lang="scss" scoped>
.swap-container {
  .swap-main {
    position: relative;
    margin: 0 25px 25px 25px;
    padding: 120px 20px 20px 20px;
    width: 700px;
    box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
    border-radius: 30px;
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

    .tip-item {
      margin-bottom: 20px;

      .title {
        color: #999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .swaprecord {
          font-family: PingFang SC;
          color: #ffa300;
        }
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

      .slippage {
        margin-left: 15px;
        color: #00be66;
      }

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

      .embed1 {
        color: #00be66;

        .less-icon {
          vertical-align: middle;
          display: inline-block;
          margin-top: -8px;
          margin-right: 5px;
        }
      }

      .embed2 {
        color: #feb75e;
      }

      .embed3 {
        color: red;
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
  }

  .multi-path {
    margin-top: 10px;
    padding: 20px;
    flex-wrap: wrap;
    border: 1px solid #e7e7e7;
    .tag {
      display: inline-block;
      margin: 0 15px;
    }
    img {
      height: 38px;
      width: 38px;
      margin-right: 10px;
    }
    .route {
      span {
        font-size: 30px;
      }
    }
  }

  .no-market {
    flex-direction: column;
    padding: 80px 20px;
    text-align: center;

    div:nth-child(1) {
      color: #666;
      font-size: 24px;
    }
    div:nth-child(2) {
      margin-top: 40px;
      color: $color-theme;
      font-size: 26px;
    }
  }
  .resetExLog{
    width: 100%;
    text-align: right;
    color:#ffa300;
  }
  .btn-swap {
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
    font-size: 24px;
  }

  /deep/ .mint-checklist-title {
    display: none;
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

    .close1 {
      top: 30px;
    }

    .title {
      font-size: 33px;
      color: #333;
      text-align: center;
      margin-bottom: 40px;
    }

    .content {
      margin: 35px 0 50px;
      font-size: 30px;
      color: $color-999;
    }

    .tag {
      margin: 0 18px 20px;
      color: #999;
      font-size: 25px;
    }

    .word {
      font-size: 25px;
      color: #999;
      margin-bottom: 10;
    }

    .word2 {
      color: #333;
      line-height: 40px;
      font-size: 30px;
      margin-bottom: 20px;

      span:nth-child(2) {
        color: red;
      }
    }

    .comfirm-content {
      position: relative;
      border: 1px solid #e7e7e7;
      border-radius: 20px;
      padding: 30px 50px;
      margin-bottom: 30px;
      margin-top: 30px;

      .item-left {
        img {
          width: 68px;
          margin-right: 12px;
        }

        .left-content {
          div:nth-child(1) {
            font-size: 32px;
            color: #000;
          }

          div:nth-child(2) {
            font-size: 26px;
          }
        }
      }

      .item-right {
        color: #000;
      }

      .item:first-child {
        margin-bottom: 80px;
      }

      .forward-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(90deg);
      }
    }
  }

  .mint-popup-bottom .tip-popup {
    width: 95%;
    margin: 0 auto;
  }

  .set-value {
    font-size: 30px;
    color: #333;
    margin-top: 30px;
  }

  .value {
    color: $btn-color;
    font-size: 30px;
  }

  .set-values {
    // text-align: right;
    color: $color-theme;
    font-size: 30px;
    margin: 30px 0 20px;
    padding-right: 10px;
  }

  .btn1 {
    position: relative;
    width: 100%;
    height: 90px;
    background: $btn-bg;
    color: $btn-color;
    margin-bottom: 30px;
    font-size: 28px;
    border-radius: 45px;
    margin: 20px 0 10px 0;

    &.btn2 {
      background: #fff;
      color: #333;
      border: 1px solid $btn-bg;
    }
  }
}

.font-b {
  font-size: 27px !important;
}

.close-icon {
  top: 55px !important;
  right: 40px !important;

  svg {
    color: #333 !important;
  }
}
.isMultipath{
  width: 90%;
  margin:0 auto;
  margin-bottom: .4rem;
  display: flex;
  justify-content: space-between;
  font-size: .4rem;
}
</style>
