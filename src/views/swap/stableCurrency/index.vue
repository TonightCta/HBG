<!-- 稳定币 -->
<template lang="html">
  <div class="currencyIndex">
    <!-- <Header @turnLang="changeRoadLang"/> -->
    <div class="main">
      <div class="tab flex">
        <div
          class="btn flex-center"
          :class="{ active: menuActive === item.value }"
          v-for="(item, index) in menu"
          :key="index"
          @click="onMenuClick(index)"
        >
          <div>{{ $t(`stableCurrency.${item.label}`) }}</div>
        </div>
      </div>
      <div class="">
        <router-view></router-view>
      </div>
    </div>
    <!-- <div class="mask" @touchmove.prevent v-if="isDev">
      <img :src="deve" alt=""><br><br>
      {{$t('deve.deve')}}<br>
      {{$t('deve.wait')}}...
    </div> -->
  </div>
</template>

<script>
// import Header from "@/views/components/Header";
export default {
  name:'StableCurrency',
  data(){
    return{
      menu: [//切换菜单
        {
          value: 0,
          label: "generate",
        },
        {
          value: 1,
          label: "shoot",
        },
      ],
      menuActive: 0,
      deve:require('@/assets/images/deveIcon.png'),
      isDev:true,
    }
  },
  created(){
    if(process.env.NODE_ENV == 'dev'){
      this.isDev = false
    }
    this.menuActive = this.$route.name === "Shoot" ? 1 : 0;
    // console.log(window.localStorage.getItem('language'))
  },
  // components:{Header},
  methods:{
    onMenuClick(val) {
      const routerName = val === 1 ? "Shoot" : "Generate";
      if (this.$route.name === routerName) return;
      this.$router.push({ name: routerName }).then(() => {
        this.menuActive = this.$route.name === "Shoot" ? 1 : 0;
      });
    },
    // changeRoadLang(){
    //   this.$refs.road.setLang()
    // }
  }
}
</script>

<style lang="scss" scoped>
.currencyIndex{
  width: 100%;
  .main {
    position: relative;
    margin: 0;
    padding: 0;
    .tab {
      position: absolute;
      top: 0;
      left: 60px;
      right: 60px;
      height: 120px;
      z-index: 2;
      box-sizing: border-box;
      padding: 0 20px 0 20px;
      font-size: 32px;
      color: #333;
      text-align: center;
      margin: 0 auto;
      .btn {
        flex: 1;
        padding: 0 30px;
        text-align: center;
        font-weight: bold;
        & > div {
          width: 2rem;
          height: 60px;
          line-height: 60px;
          border-bottom: 5px solid #e8e8e8;
          cursor: pointer;
        }
      }
      .active > div {
        color: $btn-bg;
        border-color: $btn-bg;
      }
    }
  }
  .mask{
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.7);
    top:0;
    left:0;
    z-index: 200;
    color:white;
    text-align: center;
    font-size: .4rem;
    box-sizing: border-box;
    padding-top: 60%;
    img{
      width: 1.4rem;
    }
  }
}
</style>
