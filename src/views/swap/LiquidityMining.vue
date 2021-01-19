<template>
  <div>
    <div class="container">
      <div class="header">
        <div class="left">
          <span>{{ $t("mining.pendingReward") }}: {{ pendingReward }}</span>
        </div>
        <div class="right" @click="handleClaimAll">
          {{ $t("mining.claimAll") }} >
        </div>
      </div>
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
        <div class="item-title flex-sb">
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
            <div>{{ $t("swap.liquidityMiningWeight") }}:{{ (item.displayWeight / 100).toFixed(1) }}</div>
          </div>
        </div>

        <div class="item-body">
          <div class="flex-sb time">
            <span>{{ $t("swap.pools") }}</span>
            <span>{{ item.token0.reserve }} / {{ item.token1.reserve }}</span>
          </div>
          <p class="" style="marginTop:.2rem;fontSize:.38rem;">
            {{ $t('pool.feeRevenue') }}:{{item.feeRevenue}}% + {{ $t('pool.miningRewards') }}:

            <span v-if="item.miningRewards > 0">{{(item.miningRewards)}}</span>
            <span v-else>0</span>
            %
          </p>
          <p v-if="item.apy" style="marginTop:.2rem;fontSize:.38rem;">
            Apsis:&nbsp;{{item.apy}}
          </p>
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
        <div class="word2" v-html="$t('mining.rules2')"></div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import EosTool from "@/utils/eostool";
import { coinUrl } from "@/utils/common";
import { getPairHBG } from "@/utils/swap-new";

export default {
  name: "liquidityMining", // defi兑换
  data() {
    return {
      pendingReward: " - ",
      pools: [],
      pairs: [],
      rulesVisible: false,
      userDebts: [],
      userUnclaimed: 0,
      timer: null,
      totalWeight: 0,
      apcPairs:null,
    }
  },
  components: {},
  props: {},
  watch: {},
  computed: {},
  created() {
    this.getPairs();
  },
  mounted() {
    // get new data
    this.getReward();

    this.timer = setInterval(this.updateTicker, 200);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    url(contract, coin) {
      return coinUrl(contract, coin);
    },
    // 获取币种 & 格式化 & 扁平化
    async getPairs() {
      let params = {
        code: "hbgtokenpool",
        scope: "hbgtokenpool",
        table: "pools",
        limit: 300,
        json: true,
      };
      const pools = await EosTool.getTableRows(params);
      this.pools = pools;
      this.totalWeight = 0;
      for (const pool of pools) {
        this.totalWeight += pool.weight;
      }
      let pairs = JSON.parse(window.localStorage.getItem('pairs'));
      let paramsTwo = {
        code:'oracle.defi',
        scope:'oracle.defi',
        table:'avgprices',
        json:true
      };
      const result1 = await EosTool.getTableRows(paramsTwo);
      const result2 = await EosTool.getTableRows(paramsTwo);
      const APCBal = await EosTool.getCurrencyBalance(
        'apsisnetcoin','apsisrewards','APC'
      );
      const HBGBal = await EosTool.getCurrencyBalance(
        'apsisnetcoin','apsishbgpool','APC'
      );
      let fiveEOS;//EOS五分钟均价
      if(result2.length > 0){
        result2.forEach((e) => {
          if(e.key == 300){
            fiveEOS = (e.avg_price /10000).toFixed(4);
          }
        });
      }
      let hbg = getPairHBG(pairs);
      let hbgPrice =
        parseFloat(hbg.token1.reserve) / parseFloat(hbg.token0.reserve);
      pairs.forEach((x,i) => {
        let priceYear = 0.005 * x.weight * hbgPrice * 86400 * 365 / 10;
        let poolEOS = 0;
        if (x.token0.coin == "EOS") {
          poolEOS = parseFloat(x.token0.reserve) * 2;
        }
        if (x.token1.coin == "EOS") {
          poolEOS = parseFloat(x.token1.reserve) * 2;
        }
        if (x.token0.coin == "APC" && x.token1.coin == "USDT") {
          // 获取EOS / USDT价格
          let avePrice = 3;
          if(result1.length > 0){
            result1.forEach((e) => {
              if(e.key == 300){
                avePrice = (e.avg_price /10000).toFixed(4);
              }
            });
          }
          let poolUSDT = parseFloat(x.token1.reserve) * 2
          poolEOS = poolUSDT / avePrice;
        }

        let feeRevenue = parseFloat(
          (priceYear / poolEOS) * 0.55 * 100
        ).toFixed(2);
        feeRevenue = isNaN(feeRevenue)
          ? 0
          : feeRevenue;
        // console.log(this.pair.feeRevenue)
        let priceYear2 =
          hbgPrice * x.weightProportion * 0.02 * 86400 * 365;
        let miningRewards = parseFloat(
          (priceYear2 / poolEOS) * 100 / 2
        ).toFixed(2);
        this.$set(x,'feeRevenue',feeRevenue)
        this.$set(x,'miningRewards',miningRewards)
        this.$set(x,'allAPY',parseFloat(feeRevenue) + parseFloat(miningRewards))
        // console.log(fiveEOS);
        if(x.token0.coin == 'APC' && x.token1.coin == 'USDT' && APCBal != ''){
          this.$set(x,'apy',(((parseFloat(APCBal)  * 365 / 14) / parseFloat(x.token0.reserve)) * 100).toFixed(2) + '%')
          this.$set(x,'allAPY',parseFloat(feeRevenue) + parseFloat(miningRewards) + parseFloat(x.apy))
        }
        if(x.token0.coin == 'APC' && x.token1.coin == 'USDT'){
          this.apcPairs = x;
        }
        setTimeout(()=>{
          if(x.token0.coin == 'HBG' && x.token1.coin == 'EOS' && HBGBal != ''){
            let APCPrice = (parseFloat(this.apcPairs.token1.reserve) / parseFloat(this.apcPairs.token0.reserve)).toFixed(4);
            let APCToEOS =  APCPrice/fiveEOS;
            let HBGToEOS = (parseFloat(x.token1.reserve) / parseFloat(x.token0.reserve)).toFixed(4)
            let HBGToAPC = ( HBGToEOS / APCToEOS).toFixed(4);//HBG - APC价格
            this.$set(x,'apy',(((parseFloat(HBGBal) * 365 / 14) / (HBGToAPC * parseFloat(x.token0.reserve))) * 100).toFixed(2) + '%')
            this.$set(x,'allAPY',parseFloat(feeRevenue) + parseFloat(miningRewards) + parseFloat(x.apy))
          }
        },100)
      });
      pairs.forEach((item) => {
        if(item.displayWeight != 0){
          this.pairs.push(item)
        }
      });
      this.pairs = this.pairs.sort((x,y) => y.allAPY - x.allAPY);
      await this.getUserInfos();

      await this.getHBGInfo();
    },
    async getUserInfos() {
      const account = this.$store.state.app.account;
      if (!account.name) {
        return;
      }
      // get balances
      let params = {
        code: "burgertokens",
        scope: account.name,
        table: "accounts",
        json: true,
      };
      let result = await EosTool.getTableRows(params);
      if (result.length == 0) {
        return;
      }
      this.userDebts = [];
      for (let b of result) {
        const amount = parseInt(b.balance.split(' ')[0]);
        const code = b.balance.split(' ')[1];
        const pool = this.pools.find(p => p.code == code);
        if (pool) {
          // userDebts
          const debt = await this.getUserDebt(code);
          const lpSupply = await this.getLPSupply(code);
          this.userDebts.push({
            code,
            amount,
            acc_reward_per_lp: parseInt(pool.acc_reward_per_lp),
            weight: pool.weight,
            last_reward_time: pool.last_reward_time,
            lp_supply: lpSupply,
            debt
          });
        }
      }
      this.updateReward();
    },
    async getLPSupply(code) {
      let params = {
        code: "burgertokens",
        scope: code,
        table: "stat",
        json: true,
      };
      let result = await EosTool.getTableRows(params);
      if (result.length > 0) {
        return parseInt(result[0].supply.split(' ')[0]);
      } else {
        return 0;
      }
    },
    async getUserDebt(code) {
      const account = this.$store.state.app.account;
      let params = {
        lower_bound: account.name,
        upper_bound: account.name,
        code: "hbgtokenpool",
        scope: code,
        table: "users",
        json: true,
      };
      let result = await EosTool.getTableRows(params);
      if (result.length > 0) {
        return result[0].debt;
      } else {
        return 0;
      }
    },
    async getHBGInfo() {
      const account = this.$store.state.app.account;
      let params = {
        lower_bound: account.name,
        upper_bound: account.name,
        code: "hbgtokenpool",
        scope: "hbgtokenpool",
        table: "users",
        json: true,
      };
      let result = await EosTool.getTableRows(params);
      if (result.length > 0) {
        return result[0].debt;
      } else {
        return 0;
      }
    },
    async handleClaimAll() {
      const account = this.$store.state.app.account;
      const actions = [{
          account: "hbgtokenpool",
          name: "updateall",
          authorization: [{
              actor: account.name,
              permission: account.authority || "active",
            },
          ],
          data: {
            owner: account.name,
          },
        }, {
          account: "hbgtokenpool",
          name: "claim",
          authorization: [ {
              actor: account.name,
              permission: account.authority || "active",
            },
          ],
          data: {
            owner: account.name,
          },
        },
      ];
      const result = await EosTool.transact(actions);
      if (!result.transaction_id) {
        // 错误信息
        const res = EosTool.handleScatterError(result);
        this.$toast(res.type === "lang" ? this.$t(res.text) : res.text);
        return;
      }
      this.pendingReward = "0.000000 HBG";
      this.$toast({
        message: this.$t("mining.claimSuccess"),
        position: "center",
        duration: 2000,
      });
    },

    async handleUpdateall() {
      const account = this.$store.state.app.account;
      const actions = [{
          account: "hbgtokenpool",
          name: "updateall",
          authorization: [ {
              actor: account.name,
              permission: account.authority || "active",
            },
          ],
          data: {
            owner: account.name,
          },
        },
      ];
      const result = await EosTool.transact(actions);
      if (!result.transaction_id) {
        // 错误信息
        const res = EosTool.handleScatterError(result);
        this.$toast(res.type === "lang" ? this.$t(res.text) : res.text);
        return;
      }
      await this.getReward();
      this.$toast({
        message: this.$t("mining.updateSuccess"),
        position: "center",
        duration: 2000,
      });
    },

    async getReward() {
      // 查询现在可领取数量
      const account = this.$store.state.app.account;
      let params = {
        lower_bound: account.name,
        upper_bound: account.name,
        code: "hbgtokenpool",
        scope: "hbgtokenpool",
        table: "rewards",
        json: true,
      };
      const result1 = await EosTool.getTableRows(params);
      if (result1.length > 0) {
        this.userUnclaimed = result1[0].unclaimed;
      }
      this.updateReward();
    },

    updateReward() {
      let totalReward = this.userUnclaimed;
      for (const ud of this.userDebts) {
        totalReward += ud.acc_reward_per_lp * ud.amount / 100000000 - ud.debt;
      }
      this.pendingReward = (totalReward / 1000000.0).toFixed(6) + " HBG";
    },

    updateTicker() {
      if (this.userDebts.length == 0) {
        return;
      }
      let nowtime = Date.now() / 1000.0;
      for (const ud of this.userDebts) {
        const hbg_reward = (nowtime - ud.last_reward_time) * 10000 * ud.weight / this.totalWeight;
        ud.last_reward_time = nowtime;
        ud.acc_reward_per_lp += hbg_reward / ud.lp_supply * 100000000;
      }
      this.updateReward();
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  background: #fff;
  padding: 0px 24px 24px 24px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 20px;
    padding: 25px 20px;
    .left {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      .refresh {
        color: #ffa300;
      }
    }
    .right {
      color: #ffa300;
    }
  }
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
    margin-top: 20px;
    .rule {
      font-weight: 400;
      font-size: 24px;
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
