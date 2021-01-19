<template>
  <div @click="onItemClick" class="token flex-fs color-333">
    <div class="logo">
      <img :src="url(token.contract, token.coin)" onerror="this.src='/static/images/eos.png'" alt />
    </div>
    <div class="info">
      <div class="name flex-fs">
        <span>{{token.coin}}</span>
        <svg-icon :color="'#333'" :icon="'icon-arrow-down'" :size="24" />
      </div>
      <div class="contract">{{token.contract}}</div>
    </div>
  </div>
</template>

<script>
import { coinUrl } from '@/utils/common'
export default {
  data() {
    return {};
  },
  props: {
    token: Object,
  },
  created(){
  },
  methods: {
    url(contract, coin) {
      return coinUrl(contract, coin);
    },
    onItemClick() {
      this.$emit('onClick', true);
    },
  },
};
</script>

<style lang="scss" scoped>
.token {
  .logo {
    width: 72px;
    height: 72px;

    img {
      width: 72px;
      height: 72px;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    margin-left: 14px;

    .name {
      height: 46px;
      line-height: 46px;
      font-size: 32px;

      .icon {
        margin-left: 8px;
      }
    }

    .contract {
      height: 24px;
      line-height: 24px;
      font-size: 24px;
      color: #999;
      vertical-align: super;
    }
  }
}
</style>
