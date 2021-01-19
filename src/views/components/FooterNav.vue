<!-- 底部导航 -->
<template lang="html">
  <div class="footernav">
    <ul>
      <router-link to="/" tag="li"  @click.native="changeTab(0)" :class="{active:acTable == 0}">
        <svg-icon :color="'#999'" :icon="'icon-duihuan'" svgClass="icon" :size="50"/>
        <p>{{$t('swap.swap')}}</p>
      </router-link>
      <router-link to="/currenIndex" tag="li"  @click.native="changeTab(1)" :class="{active:acTable == 1}">
        <svg-icon :color="'#999'" :icon="'icon-wending'" svgClass="icon" :size="50"/>
        <p>USDB</p>
      </router-link>
      <!-- <router-link to="/currencyExchange" tag="li"  @click.native="changeTab(2)" :class="{active:acTable == 2}">
        <svg-icon :color="'#999'" :icon="'icon-wending'" svgClass="icon" :size="50"/>
        <p>稳定币兑换</p>
      </router-link> -->
      <router-link to="/swap1step" tag="li"  @click.native="changeTab(3)" :class="{active:acTable == 3}">
        <svg-icon :color="'#999'" :icon="'icon-yibu'" svgClass="icon" :size="50"/>
        <p>{{$t('public.oneStep')}}<sup class="oneStep">Beta</sup></p>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name:'FooterNav',
  data(){
    return{
      acTable:0
    }
  },
  created(){
    if(this.$route.name == 'swap'){
      this.acTable = 0;
    }else if(this.$route.name == 'Bond' || this.$route.name == 'About' || this.$route.name == 'Problem' || this.$route.name == 'Shoot'){
      this.acTable = 1;
    }
    // else if(this.$route.name == 'Exchange' || this.$route.name == 'Make'){
    //   this.acTable = 2;
    // }
    else{
      this.acTable = 3;
    }
  },
  methods:{
    async changeTab(n){
      this.acTable = n;
    },
  },
}
</script>

<style lang="scss" scoped>
.footernav{
  position: fixed;
  width: 100%;
  max-width: 750PX;
  z-index: 300;
  bottom:0;
  left:val(width / 2);
  height: 1.6rem;
  background: white;
  box-shadow: 0px 0px 30px #ccc;
  ul{
    font-size: .38rem;
    display: flex;
    justify-content: space-around;
    li{
      width: 33%;
      text-align: center;
      display: flex;
      position: relative;
      box-sizing: border-box;
      padding-top: .9rem;
      transition: 1s all;
      color:#999;
      .icon{
        position: absolute;
        top:.2rem;
        left:50%;
        margin-left: -.35rem;
        transition: .5s all;
      }
      p{
        width: 100%;
        text-align: center;
      }
      .oneStep {
        padding-left: 5px;
        font-size: 12px;
      }
    }
    li:last-child{
      p{
        box-sizing: border-box;
        padding-left: .4rem;
        margin-top: -.04rem;
      }
    }
    .active{
      color:#FFA300;
      .icon{
        color:#FFA300!important;
      }
    }
  }
}
</style>
