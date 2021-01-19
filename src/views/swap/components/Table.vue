<template lang="html">
  <div class="">
    <ul class="dataTable">
      <router-link :to="tabData.urlOne" tag="li" @click.native="changeTab(0)" :class="{onTab:acTable==0}">
        {{tabData.textOne}}
      </router-link>
    <!--  <li @click="changeTab(0)" :class="{onTab:acTable==0}">
          <span>成交榜</span>
        当前委托
      </li> -->
      <router-link :to="tabData.urlSec" tag="li" @click.native="changeTab(1)" :class="{onTab:acTable==1}">
        {{tabData.textTwo}}
      </router-link>
      <!-- <li @click="changeTab(1)" :class="{onTab:acTable==1}">
      <span>深度榜</span>
        历史委托
      </li>-->
      <router-link v-if="tabData.urlThree" :to="tabData.urlThree" tag="li" @click.native="changeTab(2)" :class="{onTab:acTable==2}">
        {{tabData.textThree}}
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  /**
    * @author 崔田
    * @param  tabData.urlOne 第一选项路由地址
    * @param  tabData.TextOne 第一选项标题名称
    * @param  tabData.isPup   控制Pup侧边栏按钮
  */
  name:'Table',
  props:{
    tabData:Object
  },
  data(){
    return{
      acTable:0,
    }
  },
  created(){
    if(this.$route.name == 'Generate'){
      this.acTable = 0;
      this.tabData.textOne = this.$t('stableCurrency.generate') + this.$t('stableCurrency.us')
      this.tabData.textTwo = this.$t('stableCurrency.repay')
      this.tabData.textThree = this.$t('vote.irrigation')
    }else if(this.$route.name == 'Repay'){
      this.acTable = 1;
      this.tabData.textOne = this.$t('stableCurrency.generate')
      this.tabData.textTwo = this.$t('stableCurrency.repay') + this.$t('stableCurrency.us')
      this.tabData.textThree = this.$t('vote.irrigation')
    }else if(this.$route.name == 'Management'){
      this.acTable = 2;
      this.tabData.textOne = this.$t('stableCurrency.generate')
      this.tabData.textTwo = this.$t('stableCurrency.repay')
      this.tabData.textThree = this.$t('vote.irrigation') + this.$t('stableCurrency.us')
    }
  },
  methods:{
    //切换table
    async changeTab(n){
      this.acTable=n;
      if( n == 0){
        this.tabData.textOne = this.$t('stableCurrency.generate') + this.$t('stableCurrency.us')
        this.tabData.textTwo = this.$t('stableCurrency.repay')
        this.tabData.textThree = this.$t('vote.irrigation')
      }else if( n == 1){
        this.tabData.textOne = this.$t('stableCurrency.generate')
        this.tabData.textTwo = this.$t('stableCurrency.repay') + this.$t('stableCurrency.us')
        this.tabData.textThree = this.$t('vote.irrigation')
      }else if( n ==2 ){
        this.tabData.textOne = this.$t('stableCurrency.generate')
        this.tabData.textTwo = this.$t('stableCurrency.repay')
        this.tabData.textThree = this.$t('vote.irrigation') + this.$t('stableCurrency.us')
      }
    },
    editPup(){
      this.$emit('openPup',true)
    }
  },
}
</script>

<style lang="scss" scoped>
.dataTable{
  width: 95%;
  margin:0 auto;
  display: flex;
  padding-top: .1rem;
  position: relative;
  li{
    font-size: .4rem;
    color:#666;
    line-height: .3rem;
    position: relative;
    transition: .5s all;
    box-sizing: border-box;
    margin-left: .3rem;
  }
  li:first-child{
    margin:0;
  }
  .onTab{
    font-size:.7rem;
    color:black;
    font-weight: bold;
  }
}
</style>
