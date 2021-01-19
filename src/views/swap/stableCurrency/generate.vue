<!-- 生成 -->
<template lang="html">
  <div class="generateIndex">
    <div class="generateTop">
      <!-- 生成信息 -->
      <div class="generateMes">
        <ul>
          <li>
            <p>EOS {{$t('stableCurrency.total')}} {{$t('stableCurrency.generate')}}</p>
            <p>{{allEOS}}</p>
          </li>
          <li>
            <p>USDB {{$t('stableCurrency.totalT')}}</p>
            <p>{{allUSDB}}</p>
          </li>
        </ul>
      </div>
      <!-- 收益信息 -->
      <div class="generateGet">
        <ul>
          <li>
            <p>{{$t('stableCurrency.rate')}}</p>
            <p>{{config.annualized}}%</p>
          </li>
          <li>
            <!-- 平均抵押率 -->
            <p>{{$t('stableCurrency.rateC')}}</p>
            <p>{{(allEOS * avePrice / allUSDB * 100).toFixed(2)}}%</p>
          </li>
          <!-- <li>
            <p>24H&nbsp;EOS{{$t('stableCurrency.amount')}}</p>
            <p>4203.0930</p>
          </li> -->
        </ul>
      </div>
      <p class="EOSMes">
        EOS&nbsp;{{$t('stableCurrency.price')}}:&nbsp;{{avePrice}}&nbsp;USDB
      </p>
      <!-- 按钮 -->
      <router-link to="/generateU" tag="button" class="takeUs">{{$t('stableCurrency.generate')}}USDB</router-link>
      <!-- <button type="button" name="button" class="takeUs"></button> -->
    </div>
    <!-- 子视图 -->
    <div class="tableNow">
      <ul>
        <router-link to="/generate/bondList" tag="li" @click.native="changeTab(0)" :class="{onTab:acTableGen == 0}">
          {{$t('stableCurrency.debt1')}}
        </router-link>
        <!-- <router-link to="/generate/about" tag="li" @click.native="changeTab(1)" :class="{onTab:acTableGen == 1}">
          {{$t('stableCurrency.about')}}
        </router-link> -->
        <router-link to="/generate/problem" tag="li" @click.native="changeTab(2)" :class="{onTab:acTableGen == 2}">
          {{$t('stableCurrency.problem')}}
        </router-link>
      </ul>
    </div>
    <div class="w92">
      <router-view></router-view>
    </div>
    <!-- <Popup  :title="testTitle" :width="85" ref="openRe" v-if="testBox">
      <p class="testTitle">
        {{$t('public.testMsg')}}
      </p>
    </Popup> -->
  </div>

</template>
<script>
// import Popup from '@/views/swap/components/popup'
import EosTool from '@/utils/eostool'
import {mapState,mapMutations} from 'vuex'
export default {
  name:'Generate',
  data(){
    return{
      acTableGen:0,
      avePrice:0,//EOS五分钟均价
      allUSDB:0,
      allEOS:0,
      config:{
        burstFine:null,
        lineStr:null,
        annualized:0,
      },
      // testBox:false,//测试信息弹框
      // testTitle:this.$t('public.tip'),
    }
  },
  created(){
    this.getGenMes();
    if(this.$route.name == 'Bond'){
      this.acTableGen = 0;
    }else{
      this.acTableGen = 2;
    }
  },
  mounted(){
    // if(!window.sessionStorage.getItem('testOK')){
    //   this.testBox = true;
    //   setTimeout(() => {
    //     this.$refs.openRe.openRe(true);
    //     window.sessionStorage.setItem('testOK',1)
    //   },10)
    // }
  },
  computed:{
    // ...mapState(['allEOS','allUSDB'])
  },
  methods:{
    ...mapMutations(['fivePrice_fn','nowPrice_fn','USDBConfig_fn']),
    //切换table
    async changeTab(n){
      this.acTableGen = n;
    },
    async getGenMes(){
      //抵押率计算
      let paramsTwo = {
        code:'oracle.defi',
        scope:'oracle.defi',
        table:'avgprices',
        json:true
      };
      const result1 = await EosTool.getTableRows(paramsTwo);
      if(result1.length > 0){
        result1.forEach((e) => {
          if(e.key == 300){
            this.avePrice = (e.avg_price /10000).toFixed(4);
            this.fivePrice_fn((e.avg_price /10000).toFixed(4));
          }
          if(e.key == 10){
            this.nowPrice_fn((e.avg_price /10000).toFixed(4));
          }
        });
      }
      let params={
        code:'eosusdbvault',
        scope:'eosusdbvault',
        table:'vaults',
        limit:1000,
        json:true
      };
      //总量计算
      const result=await EosTool.getTableRows(params);
      let allUSDB = 0;
      let allEOS = 0;
      result.forEach((val, idx, arr) => {
          allUSDB += parseFloat(val.issue);
          allEOS += parseFloat(val.collateral);
      },0);
      this.allUSDB = allUSDB.toFixed(4);
      this.allEOS = allEOS.toFixed(4);
      //年化计算
      let params2 = {
        code:'eosusdbvault',
        scope:'eosusdbvault',
        table:'configs',
        json:true
      };
      const result2 = await EosTool.getTableRows(params2);
      if(result2.length > 0){
        this.config.burstFine = result2[4].value / 100;
        this.config.lineStr = result2[3].value / 10000;
        this.config.annualized = (result2[1].value / 100).toFixed(2);
      }
      this.USDBConfig_fn(this.config);
      window.localStorage.setItem('locaConfig',JSON.stringify(this.config))
    }
  }
}
</script>

<style lang="scss" scoped>
.w92{
  width: 92%;
  margin:0 auto;
  margin-top: .4rem;
}
.testTitle{
  width: 90%;
  margin:0 auto;
  text-align: left;
  padding-bottom: .4rem;
  font-size: .4rem;
}
.generateTop{
  width: 95%;
  margin:0 auto;
  padding: 140px 20px 20px 20px;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  position: relative;
  .generateMes{
    width: 90%;
    margin:0 auto;
    ul{
      width: 100%;
      display: flex;
      justify-content: space-between;
      li{
        font-size: .4rem;
        text-align: center;
        p:first-child{
          color:#999;
        }
        p:last-child{
          font-size: .5rem;
          font-weight: 500;
        }
      }
    }
  }
  .generateGet{
    width: 95%;
    margin:0 auto;
    margin-top: .5rem;
    background: #f5f5f5;
    padding: .36rem .3rem;
    border-radius: 15px;
    box-sizing: border-box;
    ul{
      display: flex;
      justify-content: space-around;
      li{
        font-size: .4rem;
        text-align: center;
        p:first-child{
          color:#999;
        }
        p:last-child{
          color:#128758;
          margin-top: .1rem;
        }
      }
    }
  }
  .EOSMes{
    font-size: .4rem;
    line-height: 1rem;
    width: 100%;
    text-align: center;
    color:#FFA300;
    margin-bottom: .5rem;
    margin-top: .5rem;
  }
  .takeUs{
    position: absolute;
    width: 80%;
    height: 1.3rem;
    background: linear-gradient(90deg, #FFBD53 0%, #FFA300 100%);
    color:white;
    border-radius: 50px;
    left:50%;
    margin-left: -40%;
    bottom:-.65rem;
    font-size: .5rem;
    font-weight: 500;
  }
}
.tableNow{
  margin-top: 1rem;
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
