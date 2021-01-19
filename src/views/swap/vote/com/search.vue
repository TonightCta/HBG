<!-- 搜索市场 -->
<template lang="html">
  <div class="searchCom">
    <input type="text" name="" value="" v-model="searVal" :placeholder="remark">
    <img :src="sIcon" alt="">
  </div>
</template>

<script>
export default {
  name:'Search',
  props:{
    serList:Array
  },
  data(){
    return{
      sIcon:require('@/assets/images/search.png'),
      remark:this.$t('vote.search'),
      searVal:null,
      oriList:[],//原始数组
    }
  },
  watch:{
    searVal(val,oldVal){
      if(val !== oldVal){
        let serList=[];
        this.serList.forEach( e=> {
          if(val.toLocaleUpperCase() == e.token0.coin || val.toLocaleUpperCase() == e.token1.coin){
            serList.push(e)
            this.$emit('filList',serList)
          }
        });
      }
      if(val == '' || val == null){
        this.$emit('filList',this.oriList)
      }
    }
  },
  created(){
    this.oriList = this.serList;
  },
}
</script>

<style lang="scss" scoped>
.searchCom{
  position: absolute;
  top:-.84rem;
  right:0;
  input{
    width: 3.4rem;
    display: inline-block;
    background: #f5f5f5;
    text-align: right;
    line-height: .9rem;
    padding-right: .4rem;
    font-size: .4rem;
    border-radius: 100px;
  }
  img{
    width: .7rem;
    height: .7rem;
    position: absolute;
    left:.4rem;
    top:.07rem;
  }
}
</style>
