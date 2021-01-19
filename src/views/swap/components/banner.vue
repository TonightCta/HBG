<!-- 轮播图 -->
<template lang="html">
  <div class="bannerIndex">
    <mt-swipe :show-indicators="false">
      <mt-swipe-item v-for="(ban,index) in banList" :key="index">
        <img :src="ban" alt="" @click="openApsis">
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>

<script>
import Vue from 'vue'
import { Swipe, SwipeItem } from 'mint-ui';
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
export default {
  name:'Banenr',
  data(){
    return{
      banList:[
        require('@/assets/images/indexBanner.png')
      ]
    }
  },
  methods:{
    openApsis(){
      window.location = 'https://apsis.cash'
    }
  }
}
</script>

<style lang="scss" scoped>
.bannerIndex{
  width: 93%;
  margin:0 auto;
  height: 2rem;
  text-align: center;
  margin-bottom: .2rem;
  img{
    width: 100%;
    height: 100%;
    border-radius: 15px;
  }
}
</style>
