<template>
  <div class="container">
    <!-- <Header /> -->
    <div class="main">
      <div class="tab flex">
        <div
          class="btn flex-center"
          :class="{ active: menuActive === item.value }"
          v-for="(item, index) in menu"
          :key="index"
          @click="onMenuClick(index)"
        >
          <div>{{ $t(`mining.${item.label}`) }}</div>
        </div>
      </div>
      <router-view></router-view>
    </div>
    <!-- <Footer /> -->
  </div>
</template>

<script>
// import Header from "@/views/components/Header";
// import Footer from "@/views/components/Footer";

export default {
  name: "Hamburger", // defi兑换
  data() {
    return {
      menu: [
        // 总菜单
        {
          value: 0,
          label: "liquidityMining",
        },
        {
          value: 1,
          label: "tradeMining",
        }
      ],
      menuActive: 0, // 0-兑换 1-做市商
      dataList: [], // 订单列表交易对信息
    };
  },
  components: {
    // Header,
    // Footer,
  },
  props: {},
  watch: {
    "$route.name": {
      handler(name) {
        this.menuActive = name === "liquidityMining" ? 0 : 1;
      },
      depth: true,
    },
  },
  computed: {},
  created() {},
  mounted() {
    this.menuActive = this.$route.name === "liquidityMining" ? 0 : 1;
  },
  beforeDestroy() {},
  methods: {
    // 总 菜单切换（兑换、做市商）
    onMenuClick(val) {
      const routerName = val === 0 ? "liquidityMining" : "tradeMining";
      if (this.$route.name === routerName) return;
      this.$router.push({ name: routerName }).then(() => {
        this.menuActive = this.$route.name === "liquidityMining" ? 0 : 1;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  background: #fff;
  .main {
    margin: 0;
    padding: 0;
    .tab {
      margin: 0 auto 15px auto;
      padding: 0;
      width: 480px;
      height: 120px;
      box-sizing: border-box;
      font-size: 32px;
      color: #333;
      text-align: center;
      .btn {
        width: 240px;
        text-align: center;
        & > div {
          height: 60px;
          line-height: 60px;
          border-bottom: 4px solid #e8e8e8;
          cursor: pointer;
        }
      }
      .active > div {
        color: $btn-bg;
        border-color: $btn-bg;
      }
    }
  }
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
    margin: 50px 0 80px 0;
    font-size: 30px;
    color: $color-999;
    text-align: center;
  }
}
</style>
