<template>
  <div class="searchDiv" @click="handleBlur">
    <!-- 筛选条件 -->
    <div class="content" :class="{'iosVh': isIOS}">
      <!-- 支付币种 -->
      <div class="orderStatus" v-if="type === 0">
        <div class="label">{{ $t('swap.s3') }}</div>
        <div class="symbol">
          <span class="fl">
            <input class="input symbolInput"
              @click.stop="selectPay = true"
              type="text"
              v-model="dataMarket.symbolIn"
              :placeholder="$t('swap.s46')"
              @focus="selectPay = true">
          </span>
          <!-- 币种浮动窗口 start -->
          <div class="selectMenu" style="left:40px;" v-if="selectPay && coinCodeJsonPay.list.length !== 0">
            <div class="scroll">
              <div class="select color-333">
                <div class="item" v-for="(item, $index) in coinCodeJsonPay.list" :key="$index" @click.stop="handleSelectItem(item, 'fromCoin')">
                  <span>{{ item.symbol1 }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 币种浮动窗口 end -->
        </div>
      </div>
      <!-- 得到币种 -->
      <div class="orderStatus" v-if="type === 0">
        <div class="label">{{$t('swap.s5')}}</div>
        <div class="symbol">
          <span class="fl">
            <input class="input symbolInput"
              @click.stop="selectGet = true"
              type="text"
              v-model="dataMarket.symbolOut"
              :placeholder="$t('swap.s47')"
              @focus="selectGet = true">
          </span>
          <!-- 币种浮动窗口 start -->
          <div class="selectMenu" style="left:40px;" v-if="selectGet && coinCodeJsonGet.list.length !== 0">
            <div class="scroll">
              <div class="select color-333">
                <div class="item" v-for="(item, $index) in coinCodeJsonGet.list" :key="$index" @click.stop="handleSelectItem(item, 'toCoin')">
                  <span>{{ item.symbol1 }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 币种浮动窗口 end -->
        </div>
      </div>
      <!-- 交易对 -->
      <div class="orderStatus" v-if="type === 1 && false">
        <div class="label">{{ $t('public.symbol') }}</div>
        <div class="symbol">
          <span class="fl">
            <input class="input symbolInput"
              @click.stop="select = true"
              type="text"
              v-model="dataMarket.coinCode"
              :placeholder="$t('order.inputSymbol')"
              @focus="select = true">
          </span>
          <!-- 币种浮动窗口 start -->
          <div class="selectMenu" v-if="select && coinCodeJson.list.length !== 0">
            <div class="scroll">
              <div class="select color-333">
                <div class="item" v-for="(item, $index) in coinCodeJson.list" :key="$index" @click.stop="handleSelectItem(item)">
                  <span>{{ `${item.symbol1}/${item.symbol2}` }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 币种浮动窗口 end -->
        </div>
      </div>
      <!-- 存取 -->
      <div class="orderStatus orderDoirection" v-if="type === 1">
        <div class="label">{{ $t('swap.s38') }}</div>
        <div class="chooses">
          <div class="item" :class="{'active': dataMarket.direction === 1}" @click="handleType(1)">{{ $t('swap.s39') }}</div>
          <div class="item" :class="{'active': dataMarket.direction === 2}" @click="handleType(2)">{{ $t('swap.s23') }}</div>
        </div>
      </div>
      <!-- 兑换日期 -->
      <div class="orderStatus orderDoirection">
        <div class="label">{{ $t('swap.s28') }}</div>
        <div class="chooses">
          <div class="item" :class="{'active': dataMarket.months === 1}" @click="handleQueryMonths(1)">{{ $t('oldLang.db88') }}</div>
          <div class="item" :class="{'active': dataMarket.months === 3}" @click="handleQueryMonths(3)">{{ $t('oldLang.db89') }}</div>
        </div>
      </div>
    </div>
    <!-- btn按钮 -->
    <div class="btn iphonex flex-sb" :class="{'historyisIOSBtn': isIOS}">
      <button class="btn-no-border" @click="handleReset">{{ $t('public.reset') }}</button>
      <button class="btn-back" @click="handleSure">{{ $t('public.sure') }}</button>
    </div>
  </div>
</template>

<script>
import { isIOS } from '@/utils/common';

export default {
  name: 'searchDiv', // 筛选
  data() {
    return {
      dataList: [], // 币种列表
      coinCodeJson: { // 币种筛选列表
        key: '',
        keyId: null,
        list: []
      },
      coinCodeJsonPay: { // 币种筛选列表
        key: '',
        keyId: null,
        list: []
      },
      coinCodeJsonGet: { // 币种筛选列表
        key: '',
        keyId: null,
        list: []
      },
      select: false, // 交易对列表
      way: 0, // 0-兑换 1-做市商
      isIOS: false,
      dataMarket: {
        coinCode: '', // 模糊查询
        pairId: '', // 交易对ID
        symbolIn: '', // 模糊查询
        symbolOut: '', // 交易对ID
        months: '', // 支付币种
        direction: '', // 类型：1-存币；2-取币
      },
      selectPay: false, // 支付币种下拉列表
      selectGet: false, // 得到币种下拉列表
    }
  },
  components: {},
  props: [
    'searchData',
    'type', // 0-兑换列表 1-做市商列表
  ],
  watch: {
    'dataMarket.coinCode': function listen(newVal) {
      if (!newVal) {
        this.dataMarket.pairId = '';
        this.coinCodeJson.list = [];
        return;
      }
      this.coinCodeJson.list = this.handleSearchData(newVal)
    },
    'dataMarket.fromCoin': function listen(newVal) {
      if (!newVal) {
        this.dataMarket.fromCoin = '';
        this.coinCodeJsonPay.list = [];
        return;
      }
      this.coinCodeJsonPay.list = this.handleSearchData(newVal, 'noCode')
    },
    'dataMarket.toCoin': function listen(newVal) {
      if (!newVal) {
        this.dataMarket.toCoin = '';
        this.coinCodeJsonGet.list = [];
        return;
      }
      this.coinCodeJsonGet.list = this.handleSearchData(newVal, 'noCode')
    },
  },
  computed: {},
  created() {
    this.isIOS = isIOS();
  },
  mounted() {
    this.dataMarket = this.searchData ? JSON.parse(this.searchData) : this.dataMarket;
    // this.handleGetListData();
  },
  beforeDestroy() {},
  methods: {
    handleReset() {
      this.dataMarket = {
        coinCode: '', // 模糊查询
        pairId: '', // 交易对ID
        symbolIn: '', // 交易币种
        symbolOut: '', // 获得币种
        months: '', // 月份
        direction: '', // 类型：1-存币；2-取币
      }
    },
    handleSure() {
      this.$emit('listenSure', this.dataMarket);
    },
    // 存取
    handleType(i) {
      if (i === this.dataMarket.direction) {
        this.dataMarket.direction = '';
        return;
      }
      this.dataMarket.direction = i;
    },
    // 兑换日期
    handleQueryMonths(i) {
      if (i === this.dataMarket.months) {
        this.dataMarket.months = '';
        return;
      }
      this.dataMarket.months = i;
    },
    handleGetListData() {
      this.$http.post('/aiswap/getSwapPairList').then((res) => {
        // 授权过期处理
        if (res.code === 401) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.dataList = res.swapPairList;
      });
    },
    // 筛选选中
    handleSelectItem(item, type) {
      if (type === 'fromCoin') {
        this.coinCodeJsonPay.key = `${item.symbol1}`;
        this.coinCodeJsonPay.keyId = item.id;
        this.dataMarket.fromCoin = this.coinCodeJsonPay.key;
      } else if (type === 'toCoin') {
        this.coinCodeJsonGet.key = `${item.symbol1}`;
        this.coinCodeJsonGet.keyId = item.id;
        this.dataMarket.toCoin = this.coinCodeJsonGet.key;
      } else {
        this.coinCodeJson.key = `${item.symbol1}/${item.symbol2}`;
        this.coinCodeJson.keyId = item.id;
        this.dataMarket.coinCode = this.coinCodeJson.key;
        this.dataMarket.pairId = item.id;
      }
      this.handleBlur()
    },
    // 失去焦点事件
    handleBlur() {
      this.select = false;
      this.selectPay = false;
      this.selectGet = false;
      // if (this.coinCodeJson.key !== this.dataMarket.coinCode) {
      //   this.dataMarket.coinCode = '';
      //   this.dataMarket.pairId = '';
      //   this.coinCodeJson.list = []
      // }
    },
    // 搜索功能
    handleSearchData(inSearchData, noCode) {
      // 处理数据
      // 浅拷贝 - 数据处理
      const sourcepairs = JSON.stringify(this.dataList);
      const wsList = JSON.parse(sourcepairs);
      // console.log(sourcepairs)
      if (!wsList) {
        return false;
      }
      wsList.forEach((item) => {
        const symbol1 = item.pair.split('-')[1];
        const symbol2 = item.pair.split('-')[2];
        this.$set(item, 'symbol1', symbol1.toUpperCase());
        this.$set(item, 'symbol2', symbol2.toUpperCase());
      });
      // 搜索符合symbol1的交易对
      const searchData = inSearchData.toUpperCase().split('/');
      let filterArr = wsList.filter((item) => {
        const index = item.symbol1.indexOf(searchData[0]);
        if (index !== -1) {
          this.$set(item, 'index', index);
          return true;
        }
        return false;
      })
      if (searchData.length === 2) {
        filterArr = filterArr.filter((item) => {
          const index = item.symbol2.indexOf(searchData[1]);
          if (index !== -1) {
            this.$set(item, 'index', index);
            return true;
          }
          return false;
        })
      }
      // 按字母排序 - [a ～ z]
      filterArr.sort((obj1, obj2) => {
        if (obj1.symbol1 >= obj2.symbol1) {
          return 1;
        }
        return -1;
      })
      // 按查询左优先排序
      filterArr.sort((obj1, obj2) => {
        if (obj1.index >= obj2.index) {
          return 1;
        }
        return -1;
      })
      if (noCode) {
        filterArr = this.handleUnique(filterArr);
      }
      return filterArr;
    },
    handleUnique(arr) {
      var obj = {};
      let arrays = arr;
      arrays = arrays.reduce((item, next) => {
        obj[next.baseCoinCode] ? '' : obj[next.baseCoinCode] = true && item.push(next);
        return item;
      }, []);
      return arrays;
    }
  },
}
</script>
<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .searchDiv{

    .iphonex{
      bottom: .5px !important;
    }
  }
}

.symbolInput::-webkit-input-placeholder{
  color: $color-999;
  font-size: 25px;
}

.searchDiv {
  width: 560px;
  height: 100vh;
  box-sizing: border-box;
  overflow: auto;
  padding-bottom: 100px;
  .content{
    padding: 36px;
    .orderStatus{
      margin-bottom: 40px;

      .symbol{
        height: 62px;
        line-height: 62px;
        text-align: center;
        padding-right: 12px;
        margin-top: 20px;
        position: relative;

        &>span{
          font-size: 30px;
        }

        .input{
          border: 1px solid $color-e3e3e3;
          font-size: 30px;
          height: 60px;
          text-align: center;
          width: 230px;
          border-radius: 12px;
          display: inline-block;

          &:disabled{
            background: #FFF;
          }
        }

        &>span:last-child .input{
          background: #FFF;
          color: $color-333;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .areacoinsOutDiv{
          position: relative;
        }

        .areacoins{
          position: absolute;
          width: 100%;
          border: 1px solid $color-e3e3e3;
          background: #FFF;
          margin-top: 15px;
          border-radius: 13px;
          box-shadow: 0 0 7px #f0f0f0;

          &::before{
            content: '';
            position: absolute;
            border: 1px solid $color-e3e3e3;
            width: 15px;
            height: 15px;
            background: #FFF;
            transform: translate(-50%, -50%) rotate(45deg);
            box-shadow: 0 0 7px #f0f0f0;
          }

          &>div{
            position: relative;
            z-index: 10;
            background: #FFF;
            border-radius: 13px;
            border-bottom: 1px solid $color-e3e3e3;
            height: 100px;
            line-height: 100px;
          }
        }

        // 筛选框
        .selectMenu{
          background: white;
          box-shadow: 0px 0px 7px rgba(74, 144, 226, .31);
          // width: 2px;
          position: absolute;
          left: 0px;
          top: 80px;
          border-radius: 13px;
          text-align: center;
          box-sizing: border-box;
          z-index: 1000;

          &::after{
            content: '';
            border: 10px solid white;
            position: absolute;
            top: -10px;
            box-shadow: 0px 0px 7px rgba(74, 144, 226, .31);
            transform: rotate(45deg);
          }

          .scroll{
            z-index: 1000;
            position: relative;
            max-height: 460px;
            overflow: auto;
            padding: 0px 33px;
            background: white;
            border-radius: 13px;
          }

          .select{
            position: relative;
            z-index: 10;;
            background: #FFF;
            font-size: 25px;

            &>div{
              font-size: 27px;
              position: relative;
              height: 90px;
              border-bottom: 1px solid $color-e3e3e3;
              display: flex;
              align-items: center;
              box-sizing: border-box;

              &:last-child{
                border-bottom: 0px solid $color-e3e3e3;
              }
            }
          }
        }
      }

      .label{
        font-size: 30px;
      }

      .chooses{
        font-size: 25px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;

        &.chooseDate{
          margin-top: 20px;
          flex-wrap: nowrap;
          color: $color-999;
        }

        .item{
          text-align: center;
          min-width: 230px;
          max-width: 230px;
          flex: 4;
          height: 60px;
          line-height: 60px;
          // background: $active-white;
          border-radius: 12px;
          border: 1px solid transparent;
          border-color: $color-999;
          color: $color-999;
          margin-top: 20px;
        }

        .active{
          border: 1px solid $btn-bg;
          color: $btn-bg;
        }

        .item:nth-child(2n-1){
          margin-right: 12px;
        }
      }
    }
  }
  .btn{
    position: absolute;
    bottom: 0px;
    width: 100%;
    display: flex;
    align-items: center;/*垂直居中*/
    border-top: 1px solid $color-e3e3e3;
    padding: 35px 30px;
    box-sizing: border-box;
    height: 133px;

    &.isIOSBtn{
      bottom: 1px !important;
    }

    &.historyisIOSBtn{
      bottom: 0px !important;
    }

    &>button{
      background: #FFF;
      font-size: 32px;
      height: 100px;
      width: 45%;
      line-height: 80px;
      height: 80px;
    }

    &>button:active{
      background: $active-white;
    }

    .sureBtn{
      background: $color-theme;
      color: #FFF;
    }
  }
}
</style>
