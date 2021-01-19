<!-- 所有抢拍 -->
<template lang="html">
  <div class="allOut">
    <!-- 子视图 -->
    <div class="tableNow">
      <ul>
        <router-link to="/addOut/soldout" tag="li" @click.native="changeTab(0)" :class="{onTab:acTable==0}">
          {{$t('stableCurrency.soldOut')}}
        </router-link>
        <router-link to="/addOut/endOut" tag="li" @click.native="changeTab(1)" :class="{onTab:acTable==1}">
          {{$t('stableCurrency.toBurst')}}
        </router-link>
        <router-link to="/addOut/myOut" tag="li" @click.native="changeTab(2)" :class="{onTab:acTable==2}">
          {{$t('stableCurrency.snapShot')}}
        </router-link>
      </ul>
    </div>
    <div class="w95">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name:'AllOut',
  data(){
    return{
      acTable:0,
    }
  },
  methods:{
    //切换table
    async changeTab(n){
      this.acTable = n;
    },
  }
}
</script>

<style lang="scss" scoped>
.w95{
  width: 95%;
  margin:0 auto;
}
.tableNow{
  margin-top: .4rem;
  ul{
    width: 93%;
    margin:0 auto;
    display: flex;
    padding-top: .1rem;
    position: relative;
    li{
      font-size: .4rem;
      color:#999;
      line-height: .7rem;
      position: relative;
      transition: .5s all;
      box-sizing: border-box;
    }
    li:nth-child(2),li:nth-child(3){
      margin-left: .35rem;
    }
    .onTab{
      // span{
      font-size:.6rem;
      color:black;
      font-weight: bold;
      // }
    }
  }
}
</style>
