<template>
  <div id="app" :class="{'with-tabar':$route.meta.isNav}">
    <Header v-if="$route.meta.isNav" @turnLang="changeLang"/>
    <keep-alive>
      <router-view class="router-view" v-if="$route.meta.isKeep"></router-view>
    </keep-alive>
    <router-view class="router-view" v-if="!$route.meta.isKeep"></router-view>
    <!-- <div class="" v-if="$route.meta.isRoad">
      <Road ref="road"/>
    </div> -->
    <Footer/>
    <FooterNav v-if="$route.meta.isNav"/>
    <!-- 服务维护，停止交易 -->
    <mt-popup
      v-model="maintenanceVisible"
      class="popup"
      :closeOnClickModal="false"
      popup-transition="popup-fade">
      <Maintenance v-if="maintenanceVisible" @listenClose="onPopupClose" />
    </mt-popup>
    <!-- <transition name="van-fade" mode="out-in">
      <router-view class="router-view"></router-view>
    </transition> -->
  </div>
</template>
<script>
import EosTool from '@/utils/eostool';
import { getQuerys, fixIosInputBlur } from '@/utils/common'
import Maintenance from '@/views/components/Maintenance'
import { decdiv, decadd } from '@/utils/decimal';
import api from "@/api";
import Header from '@/views/components/Header'
import FooterNav from '@/views/components/FooterNav'
// import Road from '@/views/swap/components/roadMap'
import Footer from "@/views/components/Footer";
export default {
  data() {
    return {
      language: 'en',
      maintenanceVisible: false,
      configTimer: null
    };
  },
  computed: {
    state() {
      return this.$store.state.app;
    },
  },
  components: {
    Maintenance,
    FooterNav,
    // Road,
    Header,
    Footer,
  },
  watch: {
    '$store.state.app.config': {
      handler(config) {
        this.maintenanceVisible = config.contract_status != 1;
      },
      depth: true
    }
  },
  mounted() {
     // 获取rpcurl
    this.getRpcUrl();
    fixIosInputBlur();

    this.querys = getQuerys(window.location.href) || {};

    // 获取系统语言
    this.getLocaLanguage();
    // 获取渠道信息
    this.getReference();
    // 获取账号
    this.login();
    // 获取配置
    this.getConfig();
    // get stat info
    this.getSwapVolume();
  },
  beforeDestroy() {
  },
  methods: {

    getReference() {
      let ref = this.querys.ref;
      if (ref) {
        this.$store.dispatch('setRef', ref);
      }
    },
    // 获取用户信息
    async login() {
      const account = await EosTool.login();
      if (account) {
        this.$store.dispatch('setAccount', account || {});
      }
    },
    getRpcUrl() {
      EosTool.config.rpcUrl = this.$store.state.app.rpcUrl;
      EosTool.update();
    },
    // 第一次使用时，获取本地语言
    getLocaLanguage() {
      if (this.querys.language) {
        this.$i18n.locale = this.querys.language;
        this.$store.dispatch('setLanguage', this.querys.language);
      }
      const oldLang = localStorage.getItem('language');
      if (oldLang) {
        return;
      }
      // first visit
      let lang = 'en';
      if (navigator.language) {
        lang = navigator.language;
      } else {
        lang = navigator.browserLanguage;
      }
      if (lang.indexOf('-') !== -1) {
        this.language = `${lang.split('-')[0]}-${lang.split('-')[1].toUpperCase()}`;
      }
      if (this.language !== 'zh-CN' && this.language !== 'zh-TW' && this.language !== 'ko') {
        this.language = 'en';
      }
      this.$i18n.locale = this.language;
      this.$store.dispatch('setLanguage', this.language);
    },
    async getConfig() {
      if (this.configTimer) {
        clearTimeout(this.configTimer);
      }
      const params = {
        code: 'hamburgerswp',
        scope: 'hamburgerswp',
        table: 'global',
        json: true
      }
      const result = await EosTool.getTableRows(params);
      if (result && result.length > 0) {
        const item = result[0];
        const addFree = decadd(item.trade_fee, item.protocol_fee);
        item.totalFee = decdiv(addFree, 10000);
        item.totalFeeFormat = `${decdiv(addFree, 100)}%`;
        this.$store.dispatch('setConfig', item);
      }
      // refresh every 10s
      this.configTimer = setTimeout(this.getConfig, 10000);
    },
    // 24H swap 量统计
    async getSwapVolume() {
      // console.log('getSwapVolume---------------');
      const result = await api.swap.swap24HInfo();
      this.$store.dispatch("setStatInfo", result.data);
    },
    onPopupClose() {
      this.maintenanceVisible = false;
    },
    changeLang(){//语言切换监听
      this.$refs.road.setLang()
    }
  }
};
</script>
<style lang="scss" scoped>

html,
body,
html,
body,
#app {
  width: 100%;
  height: 100%;
}
.with-tabar {
  padding-bottom: 2rem;
}
#app {
  font-family: Helvetica Neue, Arial, Microsoft YaHei, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-width: 750PX;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  // position: relative;
}
.router-view {
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  background: #fff;
  flex: 1;
  font-size: 28px; //全局默认字体大小
}

.mt-popup{
  bottom: 100px;
}
</style>
