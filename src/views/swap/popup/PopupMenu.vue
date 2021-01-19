<template>
  <div class="menu">
    <!-- 挖矿 -->
    <!-- <div class="item" @click="onFundraisingClick">{{ $t('swap.fundraising') }}</div> -->
    <!-- <div class="item" @click="on1StepClick">{{ $t('public.oneStep') }} <sup class="oneStep">Beta</sup></div> -->
    <div class="item" @click="onApClick">Apsis</div>
    <div class="item" @click="onMineClick">HBG {{ $t('swap.mining') }}</div>
    <!-- <div class="item" @click="onColaClick">COLA {{ $t('swap.mining') }}</div> -->
    <div class="item" @click="onNotice">{{ $t('swap.notice') }}</div>
    <!-- <div class="item"><a href="/static/pdf/Whitebook.pdf" target="_blank" @click="onWhiteBookClick">{{ $t('public.whiteBook') }}</a></div> -->
    <div class="item" @click="onValutClick">{{ $t('swap.valut') }}</div>
    <!-- <div class="item" @click="onVotetClick">{{ $t('swap.vote') }}</div> -->
    <div class="item" @click="onSettingClick" @listenClose="closePopup">{{ $t('swap.nodeSetting') }}</div>
    <div class="item" @click="onLanguageClick">{{ lang }}</div>
    <div class="item" @click="onLoginLogoutClick">{{ login }}</div>
  </div>
</template>

<script>
import EosTool from '@/utils/eostool';
import axios from 'axios';
export default {
  name: 'Menu',
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
    lang() { return this.$store.state.app.language == 'en' ? 'CN' : 'EN' },
    login() { return this.$store.state.app.account.name ? this.$t('public.logout') : this.$t('public.login') },
  },
  props:{},
  mounted() { },
  methods: {
    closePopup() {
      this.$emit('listenClose', true);
    },

    on1StepClick() {
      this.$router.push({ path: '/swap1step' });
      this.closePopup();
    },
    onFundraisingClick() {
      this.$router.push({ path: '/start' });
      this.closePopup();
    },
    onMineClick() {
      this.$router.push({ path: '/mining' });
      this.closePopup();
    },
    onColaClick() {
      window.location.href = 'https://coladex.com/';
      this.closePopup();
    },
    onWhiteBookClick() {
      this.closePopup();
    },
    onSettingClick() {
      this.$eventbus.$emit('setting', 'node');
      this.closePopup();
    },
    onLanguageClick() {
      const lang = this.$store.state.app.language == 'en' ? 'zh-CN' : 'en';
      this.$store.dispatch('setLanguage', lang);
      this.$i18n.locale = lang;
      this.closePopup();
      this.$emit('changeLang',true)
    },
    // 帮助中心
    onSupportClick() {
    },
    async onLoginLogoutClick() {
      if (this.$store.state.app.account.name) {
        await EosTool.logout();
        this.$store.dispatch('setAccount', {});
      } else {
        const account = await EosTool.login();
        if (account) {
          this.$store.dispatch('setAccount', account || {});
        }
      }
      this.closePopup();
    },
    // 获取IP位置
    async checkIpIsChina() {
      const result = axios.get('https://ipapi.co/json/');
      if (result.data && result.data.country_name === 'China') {
        return true;
      } else {
        return false;
      }
    },
    onNotice(){//公告中心
      this.$router.push('/noticeCenter');
      this.closePopup();
    },
    onValutClick(){//金库
      this.$router.push('/valut');
      this.closePopup();
    },
    onVotetClick(){//投票
      this.$router.push('/vote');
      this.closePopup();
    },
    onApClick(){
      window.location = 'https://apsis.cash'
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/public.scss";

.menu{
  background: #FFF;
  // width: 250px;
  min-width: 240px;
  box-sizing: border-box;
  padding: 0 25px;
  border-radius: 8px;
  color: $color-333;

  .item{
    font-size: 26px;
    height: 89px;
    border-bottom: 1px solid $color-input;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    color: #333;
    cursor: pointer;

    &:last-child{
      border-bottom: 0px solid $color-input;
    }

    a {
      color: #333;
    }
    .oneStep {
      padding-left: 5px;
      font-size: 12px;
      color: red;
    }
  }

  .tip-popup{
    width: 621px;
    border-radius: 15px;
    background: #fff;
    box-sizing: border-box;
    padding: 45px 30px;
    position: relative;
    color: $color-333;
    .close{
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 10px;
      color: #000;
    }
    .title{
      font-size: 32px;
      color: #333;
      text-align: center;
      margin-bottom: 40px;
    }
    .content{
      margin: 35px 0 50px;
      font-size: 27px;
      color: $color-999;

      .word1 {
        text-align: center;
      }
    }
  }
}
</style>
