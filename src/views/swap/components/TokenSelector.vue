<template>
  <div class="changeList">
    <!-- 选择币种 -->
    <div class="head flex-sb">
      <span>{{ $t('swap.selectToken') }}</span>
      <div class="flex-sb">
        <div @click="handleClose()" style="margin-top: -5px">
          <svg-icon :icon="'icon-close'" :size="20" :color="'#3A3949'"/>
        </div>
      </div>
    </div>
    <!-- 取消 -->
    <div class="search">
      <input v-model.trim="searchValue" type="text" :placeholder="$t('public.search')" @input="handleInput"  />
    </div>
    <div class="list">
      <div v-if="list && list.length > 0">
        <template v-for="(item, index) in list">
          <div class="item flex" :key="index"
            @click="handleSelectItem(item)">
            <div class="item-img">
              <img :src="url(item.contract, item.coin)" onerror="this.src='/static/images/eos.png'" alt />
            </div>
            <div class="word">
              <div>{{item.coin}}</div>
              <div>{{item.contract}}</div>
            </div>
            <div class="price" v-if="item.amount">
              <div v-if="item.amount.length > 15">
                <!-- 余额  {{item.coin}}-->
                <div>{{ $t('swap.bal') }}：</div>
                <div class="numCls">{{item.amount}}</div>
              </div>
              <div v-else>
                <!-- 余额  {{item.coin}}-->
                <div class="flex balanceCls">
                  <span>
                    {{ $t('swap.bal') }}:
                  </span>
                  <span class="numCls">{{item.amount}}</span>
                </div>
              </div>
            </div>
            <div class="checkedLogo" v-if="isSelected(item)">
              <svg-icon :icon="'icon-mark'" :size="30" :color="'#00BE66'"/>
            </div>
          </div>
        </template>
        <div class="listWord" v-if="hasMore">{{ $t('swap.searchMorTokens') }}</div>
      </div>
      <div v-else class="notData">
        <div class="flex-center">
          <!-- 未找到您想要的币种？ -->
          <span>{{ $t('swap.tokenNotFound') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { coinUrl } from '@/utils/common'
export default {
  name: 'TokenSelector', // 选择列表
  data() {
    return {
      way: 'receive',
      searchValue: '', // 搜索值
      list: [],
      allList: [],
      hasMore: true,
    }
  },
  components: {},
  props: {
    visible: Boolean,
    coins: Array,
    selected: Object,
    direction: Number,
  },
  watch: {
    searchValue: function change(val) {
      if (!val) {
        this.list = this.allList;
        this.hasMore = true;
        return;
      }
      this.hasMore = false;
      this.list = this.allList.filter(v => v.coin.toUpperCase().indexOf(val.toUpperCase()) !== -1)
    },
    visible: function change(val) {
      if (val) {
        this.handleMounted();
      }
    },
    coins: function change(val) {
      if (val) {
        this.handleMounted();
      }
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.handleMounted();
  },
  beforeDestroy() {},
  methods: {
    url(contract, coin) {
      return coinUrl(contract, coin);
    },
    handleMounted() {
      this.searchValue = '';
      this.allList = this.coins.concat();
      this.list = this.allList;
      // console.log(this.list)
      // 获取余额
      //this.$forceUpdate(); // 强制更新
    },
    handleInput() {
      if (this.searchValue == '') {
        this.list = this.allList;
      } else {
        this.list = this.allList.filter(item => item.coin.indexOf(this.searchValue) >= 0);
      }
    },

    // close
    handleClose() {
      this.$emit('token-event', 'close');

    },
    // 选中
    handleSelectItem(item) {
      if (this.isSelected(item)) {
        return;
      }
      this.$emit('token-event', 'select', { direction: this.direction, item });
      // console.log(item)
    },
    // 判断当前已选的币种
    isSelected(item) {
      return this.selected && item.contract === this.selected.contract && item.coin === this.selected.coin;
    },
  },
}
</script>
<style lang="scss" scoped>
.changeList {
  height: 770px;
  padding: 40px 30px;
  border-radius: 30px 30px 0 0;
  &.AndroidBug {
    height: 700px;
  }

  .head {
    margin-bottom: 30px;

    span {
      font-size: 30px;
    }

    .addCoinCls {
      color: #8B572A;
      font-size: 25px;
      margin-right: 25px;
    }

    .line {
      margin-right: 30px;
      color: #E7E7E7;
    }
  }

  .search {
    input {
      width: 100%;
      padding: 0 20px;
      height: 70px;
      border: #ccc 1px solid;
      border-radius: 8px;
      font-size: 26px;
    }
  }

  .list {
    max-height: 85%;
    overflow: auto;
    margin-top: 20px;

    &.AndroidBug {
      height: 500px;
    }

    .item {
      padding: 35px 0px;
      border-bottom: 1px solid #E7E7E7;
      position: relative;

      .item-img {
        img {
          position: relative;
          width: 68px;
          height: 68px;
          margin-right: 12px;
          display: inline-block;
          vertical-align: middle;
          &::before {
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            display: block;
            width: 68px;
            height: 68px;
            background: url('/static/images/eos.png') no-repeat;
            background-size: 100% 100%;
          }
        }
      }

      .word {
        flex: 4;

        div:nth-child(1) {
          font-size: 32px;
        }

        div:nth-child(2) {
          font-size: 26px;
          color: #999;
        }
      }

      .price {
        flex: 5;
        color: #353442;
        margin-bottom: 35px;

        div {
          font-size: 26px;
        }

        .numCls {
          font-size: 29px !important;
        }

        .balanceCls {
          line-height: 36px;
          .numCls {
            margin-left: 5px;
            vertical-align: middle;
          }
        }
      }

      .checkedLogo {
        position: absolute;
        right: 8px;
        top: 35px;
        img {
          display: inline-block;
          width: 36px;
        }
      }
    }

    .item:first-child {
      // padding-top: 0;
    }

    .item:last-child {
      border-bottom: 0;
    }

    .listWord {
      text-align: center;
      color: #999;
      padding: 35px 0 10px;
    }
  }

  .noFind {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 100px;
    width: 100%;
    font-size: 25px;
    color: #333333;
    z-index: 10;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.11);
    background: #fff;
  }

  .notData {
    padding-top: 300px;
  }
}
</style>
