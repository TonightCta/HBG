<template>
  <div class="token-row">
    <div class="first-row flex-sb">
      <!-- 余额 -->
      <div class="balance" v-if="showBalance">
        {{ $t('swap.balance') }}:
        <span
          @click="() => this.$emit('onBalanceClick', token)"
          v-if="balance !== null"
        >{{balance}}</span>
        <svg-icon :icon="'icon-refresh'" class="iconfont icon-refresh el-icon-loading" v-else />
        {{token.coin}}
      </div>
      <div v-else></div>
      <div>
        <span v-if="title !== null"
           @click="() => this.$emit('onTitleClick')"
           class="title"
           :class="titleStyle"
        >{{ title }}</span>
      </div>
    </div>
    <div class="second-row flex-sb">
      <TokenItem :token="token" @onClick="() => this.$emit('onTokenClick', token)" />
      <!-- 数量 -->
      <div class="input-amount">
        <input
          @blur="() => this.$emit('onBlur', number)"
          @input="() => this.$emit('onInput', number)"
          placeholder="0.0"
          type="number"
          v-model="number"
        />
      </div>
    </div>
  </div>
</template>
<script>
import TokenItem from "./TokenItem";
export default {
  components: {
    TokenItem,
  },
  data() {
    return {
      number: "",
    };
  },
  props: {
    token: Object,
    balance: null,
    showBalance: Boolean,
    title: String,
    titleStyle: String,
    amount: String,
  },
  watch: {
    amount: {
      immediate: true,
      handler(val) {
        this.number = val + "";
      },
    },
  },
  methods: {
    onItemClick() {
      this.$emit("onClick", true);
    },
    createPool() {
      this.$router.push({
        name: "create",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.token-row {
  padding: 25px 20px;
  font-size: 26px;
  color: #333;
  background-color: #f5f5f5;
  border-radius: 14px;

  .title {
    display: block;
  }

  .title-color {
    color: #ffa300;
  }

  .second-row {
    position: relative;
    height: 110px;
    padding-top: 20px;

    .input-amount {
      text-align: right;
      color: #999;
      font-size: 30px;
      width: 40%;
      height: 60px;
      border-bottom: 1px solid #e5e5e5;

      input::-webkit-input-placeholder {
        color: #bbb !important;
        font-size: 28px !important;
        font-weight: 400;
      }

      input {
        text-align: right;
        width: 100%;
        height: 55px;
        line-height: 55px;
        font-size: 32px;
        outline-style: none;
        background: transparent;
        color: #333;
        font-weight: 500;
      }
    }

    .icon-tip {
      position: absolute;
      left: 50%;
      bottom: -32px;
      width: 64px;
      height: 64px;
      transform: translateX(-50%);
      background: rgba(255, 239, 220, 100);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
  }
}
</style>
