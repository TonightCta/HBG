<template>
  <div class="container">
    <Header />
    <div class="main">
      <div class="title">{{ $t('swap.fundraising') }}</div>
      <div class="content">
        <div class="cell-title">{{ $t('swap.selectIcoType') }}</div>
        <div class="cell-part">
          <mt-radio
            v-model="type"
            :options="options"
            @change="onOptionsChange"
            >
          </mt-radio>
        </div>
        <div class="cell-title">{{ $t('swap.buyAmount') }}</div>
        <div class="cell-part">
          <mt-field type="number" placeholder="0" v-model="amount" @input="onInput">
            <div class="subfix">HBG</div>
          </mt-field>
        </div>
        <div class="cell-part pay">
          {{ $t('swap.needPay') }} {{ payEOS }} EOS <span style="color:#666;"> ({{ $t('swap.yourBalance')}}: {{ balanceEOS }})</span>
        </div>
         <div class="cell-part pay">
          {{ $t('swap.unlockLeft') }}: 0.000000 HBG
          <br>
          {{ $t('swap.lockLeft') }}: 0.000000 HBG
        </div>
        <div class="btn-swap" @click="onSwapClick">
          <Loading v-if="loading" />
          {{ $t('swap.swap') }}
        </div>

        <div class="remark">
          <div class="tip">{{ $t('public.tip') }}:</div>
          <div class="des" v-html="$t('swap.icoRemark')"><ul></ul></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/views/components/Header";
import Loading from "@/views/components/Loading";
import EosTool from '@/utils/eostool';

export default {
  name: "Hamburger", // defi兑换
  data() {
    return {
      amount: '',
      payEOS: '-',
      options: [],
      type: '2',
      prices: [
        0.1623, 0.1461
      ],
      loading: false,
      unlockLeft: 0,
      lockLeft: 0,
      balanceTimer: null,
      balanceEOS: ' - '
    };
  },
  components: {
    Header,
    Loading,
  },
  props: {},
  watch: {},
  computed: {
  },
  async created() {
    this.getCurrencyBalances();
  },
  mounted() {
    this.options = [
      { label: this.$t('swap.icoType1'), value: '1'},
      { label: this.$t('swap.icoType2'), value: '2'},
    ];
  },
  beforeDestroy() {
    if (this.balanceTimer) {
      clearTimeout(this.balanceTimer);
      this.balanceTimer = null;
    }
  },
  methods: {
    // 余额获取
    async getCurrencyBalances() {
      if (this.balanceTimer) {
        clearTimeout(this.balanceTimer);
        this.balanceTimer = null;
      }
      let accountName = this.$store.state.app.account.name;
      if (accountName) {
        this.balanceEOS = await EosTool.getCurrencyBalance('eosio.token', accountName, 'EOS');
      }
      let params = {
        code: 'hamburgerico',
        scope: 'hamburgerico',
        table: 'stats',
        json: true
      }
      let result = await EosTool.getTableRows(params);
      if (result.length > 0) {
        this.unlockLeft = '0.000000 HBG';
        this.lockLeft = result[1].left;
      }
      this.balanceTimer = setTimeout(this.getCurrencyBalances, 6000);
    },
    async onSwapClick() {
      if (!this.$store.state.app.account.name) {
        this.$toast(this.$t('public.noauth'));
        return;
      }
      const eosQuantity = parseInt(this.payEOS);
      if (isNaN(eosQuantity)) {
        // eslint-disable-next-line
        alert('请输入HBG数量\nPlease input HBG amount');
        return;
      }
      if (eosQuantity < 100) {
        // eslint-disable-next-line
        alert('至少支付100 EOS\nPay at least 100EOS');
        return;
      }
      const account = this.$store.state.app.account;
      const actions = [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: account.name, // 转账者
          permission: account.authority || 'active',
        }],
        data: {
          from: account.name,
          to: 'hamburgerico',
          quantity: this.payEOS + ' EOS',
          memo: this.type == '1' ? '' : 'locked',
        },
      }];
      if (this.loading) return;
      this.loading = true;
      const result = await EosTool.transact(actions);
      this.loading = false;
      if (!result.transaction_id) { // 错误信息
        const res = EosTool.handleScatterError(result);
        this.$toast(res.type === 'lang' ? this.$t(res.text) : res.text);
        return;
      }
      // 兑换成功
      this.$toast({
        message: this.$t('swap.swapSuccess'),
        position: 'center',
        duration: 2000,
      });
    },
    onOptionsChange() {
      this.updatePrice();
    },
    onInput() {
      this.updatePrice();
    },
    updatePrice() {
      const quantity = parseInt(this.amount);
      if (isNaN(quantity)) {
        this.payEOS = '-';
        return;
      }
      const type = parseInt(this.type) - 1;
      this.payEOS = (quantity * this.prices[type]).toFixed(4);
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  background: #fff;
  .main {
    margin: 0 25px 25px 25px;
    padding: 30px;
    box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    background: #ffffff;
    overflow: hidden;
    .title {
      font-size: 32px;
    }
    .content {
      margin: 50px auto 0 auto;
      width: 600px;
      .cell-title {
        color: #666;
        font-size: 22px;
        margin: 35px 0 15px 0;
        display: block;
        line-height: 1;
      }
      .cell-part {
        margin-bottom: 15px;
        .subfix {
          width: 120px;
          height: 46px;
          line-height: 45px;
          background-color: #f3f3f3;
          text-align: center;
        }
        &.pay {
          margin-top: 30px;
          font-size: 22px;
        }
      }
    }
  }
  .btn-swap {
    height: 70px;
    background: $btn-bg;
    color: $btn-color;
    margin: 45px 50px 20px 50px;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 35px;

    &.disabled {
      opacity: 0.6;
      color: #ddd;
    }
  }
  .remark {
    padding: 20px 0;
    font-size: 22px;
    .tip {
      color: #444;
    }
    .des {
      color: #666;
      margin-top: 10px;
      line-height: 33px;
    }
  }
}

/deep/  .mint-radiolist-title {
  margin: 0;
}

/deep/  .mint-radiolist-label {
  font-size: 22px;
}

/deep/ .mint-cell-wrapper {
  padding: 0;
}

</style>
<style lang="scss">
.des-ul {
  list-style: disc outside !important;
  padding-left: 25px;
  margin-left: 0;
  margin: 0;
  li {
    font-size: 20px;
    line-height: 30px;
    margin: 8px 0 0 0;
  }
}
</style>
