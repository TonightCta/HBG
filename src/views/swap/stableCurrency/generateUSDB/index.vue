<!-- 生成 -->
<template lang="html">
  <div class="generateU">
    <Table :tabData="routeMes"/>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Table from '@/views/swap/components/Table'
export default {
  name:'GenerateUSDB',
  data(){
    return{
      routeMes:{
        urlOne:'/generate',
        urlSec:'/repay',
        urlThree:'/management',
        textOne:null,
        textTwo:null,
        textThree:null,
      }
    }
  },
  components:{Table}
}
</script>

<style lang="scss" scoped>
.generateU{
  padding-top: .5rem;
  .w92{
    width: 92%;
    margin:0 auto;
    margin-top: 1rem;
  }
}

</style>
