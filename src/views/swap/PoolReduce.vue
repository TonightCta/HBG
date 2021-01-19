<template>
  <div class="main">
    <header class="header">
      <!-- 创建市场 -->
      <span class="title">{{ $t('pool.subPool') }}</span>
    </header>
    <section class="section">
      <div class="itemTop">
        <div class="item">
          <div class="flex-sb">
            <span>{{ $t('pool.certificate') }}</span>
            <span @click="userTokenClick">{{ $t('pool.availableCertificate')+': '+ item.userToken }}</span>
          </div>
          <input
            type="number"
            :placeholder="$t('swap.enterContractAddress')"
            @input="handlePayInput()"
            v-model="reduceCount"
          />

          <mt-range
            v-model="reduceCount"
            :min="0"
            :max="item.userToken"
            :step="4"
            :bar-height="3"
            @change="changeEvent()"
          >
            <!-- <div slot="start">0</div>
            <div slot="end">{{ item.userToken }}</div> -->
          </mt-range>
          <div class='rangeList'>
            <span @click="rangeRowClick(0)"> 0% </span>
            <span @click="rangeRowClick(50)"> 50% </span>
            <span @click="rangeRowClick(100)"> 100% </span>
          </div>
        </div>
        <div class="item">
          <span class="title">{{ $t('pool.withdrawAssets') }}</span>
          <div class="flex-sb">
            <span class="flex-left">
              <img :src="url(item.token0.contract, item.token0.coin)" onerror="this.src='/static/images/eos.png'" alt />
              <span>{{ item.token0.coin }}</span>
            </span>
            <span>{{ getCoin1 }}</span>
          </div>

          <div class="flex-sb">
            <span class="flex-left">
              <img :src="url(item.token1.contract, item.token1.coin)" onerror="this.src='/static/images/eos.png'" alt />
              <span>{{ item.token1.coin }}</span>
            </span>
            <span>{{ getCoin2 }}</span>
          </div>
        </div>
      </div>

      <button class="btn" @click="handlerSure">
        <loading v-if="loading"></loading>
        {{ $t('public.sure') }}
      </button>
    </section>
  </div>
</template>

<script>
import EosTool from "@/utils/eostool";
import { idToSymbol, coinUrl } from "@/utils/common";
import Loading from "@/views/components/Loading";
import {mapState} from 'vuex'
export default {
  // name: "pool-reduce",
  data() {
    return {
      loading: false,
      item: this.$route.params.item,
      reduceCount: 0,
      getCoin1: 0,
      getCoin2: 0,
    };
  },
  components: {
    Loading,
  },
  // computed:{...mapState(['item'])},
  methods: {
    url(contract, coin) {
      return coinUrl(contract, coin);
    },
    async handlerSure() {
      const account = this.$store.state.app.account;
      const actions = [
        // {
        //   account: "hamburgerswp",
        //   name: "withdraw",
        //   authorization: [
        //     {
        //       actor: account.name, // 转账者
        //       permission: account.authority || "active",
        //     },
        //   ],
        //   data: {
        //     owner: account.name,
        //     pair_id: this.item.pairId,
        //     amount: this.reduceCount,
        //   },
        // },

        {
          account: "burgertokens",
          name: "transfer",
          authorization: [
            {
              actor: account.name, // 转账者
              permission: account.authority || "active",
            },
          ],
          data: {
            from: account.name,
            to: "hamburgerswp",
            quantity:
              this.reduceCount + " " + idToSymbol(parseInt(this.item.pairId)),
            memo: "withdraw",
          },
        },
      ];
      this.loading = true;
      const result = await EosTool.transact(actions);
      this.comfirmVisible = false;
      if (!result.transaction_id) {
        // 错误信息
        const res = EosTool.handleScatterError(result);
        this.$toast(res.type === "lang" ? this.$t(res.text) : res.text);
        this.loading = false;
        return;
      }
      // 兑换成功
      this.$toast({
        message: this.$t("pool.poolReduceSuccess"),
        position: "center",
        duration: 2000,
      });
      this.loading = false;
      // 返回上一页
      setTimeout(() => {
        this.$router.push({
          name: "pool",
        });
      }, 2000);
    },

    changeEvent() {
      // 更新取回资产
      let persent = this.reduceCount / this.item.userToken;
      this.getCoin1 = parseFloat(
        persent * parseFloat(this.item.token0.tokenQuantity)
      ).toFixed(this.item.token0.precision);
      this.getCoin2 = parseFloat(
        persent * parseFloat(this.item.token1.tokenQuantity)
      ).toFixed(this.item.token1.precision);
    },

    rangeRowClick(percentage) {
      this.reduceCount = parseInt( this.item.userToken * percentage/100);
      if (this.reduceCount <= 0) {
        this.reduceCount = 0;
        return;
      }
      if (this.reduceCount > this.item.userToken) {
        this.reduceCount = this.item.userToken;
      }
      // 更新取回资产
      let persent = this.reduceCount / this.item.userToken;
      this.getCoin1 = parseFloat(
        persent * parseFloat(this.item.token0.tokenQuantity)
      ).toFixed(this.item.token0.precision);
      this.getCoin2 = parseFloat(
        persent * parseFloat(this.item.token1.tokenQuantity)
      ).toFixed(this.item.token1.precision);
    },

    userTokenClick() {
      this.reduceCount = this.item.userToken;
      this.getCoin1 = parseFloat(
        parseFloat(this.item.token0.tokenQuantity)
      ).toFixed(this.item.token0.precision);
      this.getCoin2 = parseFloat(
        parseFloat(this.item.token1.tokenQuantity)
      ).toFixed(this.item.token1.precision);
    },

    handlePayInput() {
      this.reduceCount = parseFloat(this.reduceCount);
      if (this.reduceCount <= 0) {
        this.reduceCount = 0;
        return;
      }
      if (this.reduceCount > this.item.userToken) {
        this.reduceCount = this.item.userToken;
      }
      // 更新取回资产
      let persent = this.reduceCount / this.item.userToken;
      // console.log(this.item.token0.tokenQuantity);
      this.getCoin1 = parseFloat(
        persent * parseFloat(this.item.token0.tokenQuantity)
      ).toFixed(this.item.token0.precision);
      this.getCoin2 = parseFloat(
        persent * parseFloat(this.item.token1.tokenQuantity)
      ).toFixed(this.item.token1.precision);
    },
  },
};
</script>
<style lang="scss" scoped>
$-color: #8b572a;
.main {
  padding: 0 35px;
  .header {
    position: relative;
    height: 90px;

    line-height: 90px;
    font-size: 32px;

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
      margin-bottom: 15px;
    }

    .item {
      margin-top: 35px;
      .title {
        font-size: 32px;
      }
      .flex-sb {
        margin-top: 35px;
        height: 48px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 60px;
        color: #333333;
        img {
          width: 50px;
          height: 50px;
          margin-right: 8px;
        }
        .flex-left {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      /deep/ .mt-range-progress {
        background-color: #feb75e;
      }
      .rangeList {
        margin-top: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .itemTop {
      padding: 30px 30px 5px 30px;
    }
    .itemBottom {
      padding: 0px 30px 5px 30px;
    }
  }

  .btn {
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
