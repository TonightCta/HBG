<!-- 稳定币兑换 -->
<template lang="html">
  <div class="currencyExchange">
    <div class="main">
      <div class="tab flex">
        <div
          class="btn flex-center"
          :class="{ active: menuActive === item.value }"
          v-for="(item, index) in menu"
          :key="index"
          @click="onMenuClick(index)"
        >
          <div>{{ $t(`currencyExchange.${item.label}`) }}</div>
        </div>
      </div>
      <div class="w92">
        <router-view></router-view>
      </div>
    </div>
    <div class="fovMes">
      <p>货币储备</p>
      <div class="fovDetails">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'CurrencyExchange',
  data(){
    return{
      menu: [//切换菜单
        {
          value: 0,
          label: "exchange",
        },
        {
          value: 1,
          label: "make",
        },
      ],
      menuActive: 0,
    }
  },
  created(){
    this.menuActive = this.$route.name === "Make" ? 1 : 0;
  },
  methods:{
    onMenuClick(val) {
      const routerName = val === 1 ? "Make" : "Exchange";
      if (this.$route.name === routerName) return;
      this.$router.push({ name: routerName }).then(() => {
        this.menuActive = this.$route.name === "Make" ? 1 : 0;
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.currencyExchange{
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
.w92{
  width: 95%;
  margin:0 auto;
  padding: 140px 20px 20px 20px;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
}
.fovMes{
  width: 92%;
  margin:0 auto;
  margin-top: .8rem;
  p{
    font-size: .5rem;
    font-weight: bold;
  }
}
</style>
