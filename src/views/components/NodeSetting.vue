<template>
  <div class="tip-popup">
    <div class="close close1" @click="onCloseClick">
      <svg-icon :icon="'icon-close-gray'" :size="24" :color="'#999'" />
    </div>
    <div class="title">{{ $t('swap.nodeSetting') }}</div>
    <div class="content">
      <div class="node" v-for="(node, index) in nodes" :key="node.value">
        <input type="radio" :id="'node' + index" :value="node.value" v-model="valueNode">
        <label :for="'node' + index">{{ node.label }}</label>
      </div>
    </div>
    <!-- 确定 -->
    <div class="flex-center">
      <button class="btn1" @click="handleSaveNode">{{ $t('public.sure') }}</button>
    </div>
  </div>
</template>

<script>
import EosTool from "@/utils/eostool";

export default {
  data() {
    return {
      valueNode: EosTool.config.rpcUrl,
      // radio的选项
      nodes: [
        {
          label: "https://eos.blockeden.cn",
          value: "https://eos.blockeden.cn",
          check: true
        },
        {
          label: "https://eospush.tokenpocket.pro",
          value: "https://eospush.tokenpocket.pro",
        },
        {
          label: "https://mainnet.meet.one",
          value: "https://mainnet.meet.one",
        },
        {
          label: "https://eos.greymass.com",
          value: "https://eos.greymass.com",
        },
        {
          label: "https://nodes.get-scatter.com",
          value: "https://nodes.get-scatter.com",
        },
      ],
    };
  },
  computed: {
    state() {
      return this.$store.state.app;
    },
  },

  mounted() {},
  methods: {
    onCloseClick() {
      this.$emit("listenClose", true);
    },
    handleSaveNode() {
      EosTool.config.rpcUrl = this.valueNode;
      EosTool.update();
      this.$store.dispatch('setRpcUrl', this.valueNode);
      this.$emit("listenClose", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.tip-popup {
  width: 621px;
  border-radius: 15px;
  background: #fff;
  box-sizing: border-box;
  padding: 15px 30px 25px;
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
    font-size: 32px;
    color: #333;
    text-align: center;
    margin-bottom: 40px;
  }

  .content {
    margin: 20px 0;

    .node {
      margin: 15px 0 0 0;
      input {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }
    }
  }

}

.btn1 {
  position: relative;
  width: 90%;
  height: 90px;
  background: $btn-bg;
  color: $btn-color;
  margin-bottom: 30px;
  font-size: 28px;
  border-radius: 45px;
  margin: 30px 0 10px 0;

}


</style>