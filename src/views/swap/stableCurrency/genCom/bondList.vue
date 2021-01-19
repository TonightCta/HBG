<!-- 债仓排行 -->
<template lang="html">
  <div class="bondList">
    <!-- 债仓Title -->
    <p class="bondTitle">
      <span>{{$t('stableCurrency.accountName')}}</span>
      <span>{{$t('stableCurrency.totalAmount')}}(EOS)</span>
      <span>{{$t('stableCurrency.totalGen')}}(USDB)</span>
    </p>
    <!-- 债仓列表 -->
    <ul>
      <li v-for="(bond,indexBo) in bondList" :key="indexBo">
        <img :src="bond.img" alt="" v-if="bond.img">
        <span v-else>{{indexBo + 1}}</span>
        <p>{{bond.owner}}</p>
        <p style="textAlign:center;paddingLeft:.1rem;">{{parseFloat(bond.collateral).toFixed(4)}}</p>
        <p>{{parseFloat(bond.issue).toFixed(4)}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import EosTool from "@/utils/eostool"
import {mapMutations} from 'vuex'
export default {
  name:'BondList',
  data(){
    return{
      bondList:[],
    }
  },
  created(){
    this.getBond()
  },
  methods:{
    ...mapMutations(['allEos_fn','allUSDB_fn']),
    async getBond(){
      let params={
        code:'eosusdbvault',
        scope:'eosusdbvault',
        table:'vaults',
        limit:10,
        json:true
      };
      const result=await EosTool.getTableRows(params);
      this.bondList = result.sort((x,y) => parseFloat(y.issue) - parseFloat(x.issue));
      this.$set(this.bondList[0],'img',require('@/assets/images/champion.png'))
      this.$set(this.bondList[1],'img',require('@/assets/images/runner.png'))
      this.$set(this.bondList[2],'img',require('@/assets/images/second.png'));
      let allUSDB = 0;
      let allEOS = 0;
      this.bondList.forEach((val, idx, arr) => {
          allUSDB += parseFloat(val.issue);
          allEOS += parseFloat(val.collateral);
          if(val.owner.split('').length > 3){
            this.$set(val,'owner',val.owner.substring(0,3) + '***' + val.owner.substring(10,val.owner.split('').length))
          }
      },0);
      this.allEos_fn(allEOS.toFixed(4))
      this.allUSDB_fn(allUSDB.toFixed(4))
    }
  }
}
</script>

<style lang="scss" scoped>
.bondTitle{
  width: 100%;
  font-size: .36rem;
  color:#666;
  display: flex;
  justify-content: space-between;
  padding-bottom: .2rem;
  border-bottom: 1px solid #eee;
  span{
    display: inline-block;
    width: 31%;
    text-align: center;
  }
  span:last-child{
    text-align: right;
  }
}
ul{
  margin-top: .2rem;
  li{
    display: flex;
    position: relative;
    justify-content: space-between;
    font-size: .4rem;
    // height: 2rem;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    padding-left: .2rem;
    p{
      width: 31%;
      text-align: center;
      line-height: 1.4rem;
    }
    p:last-child{
      text-align: right;
    }
    img{
      position: absolute;
      width: .54rem;
      height: .6rem;
      left: -.1rem;
      top:50%;
      margin-top:-.3rem;
    }
    span{
      position: absolute;
      font-size: .44rem;
      left:0;
      top:50%;
      margin-top: -.265rem;
    }
  }
}
</style>
