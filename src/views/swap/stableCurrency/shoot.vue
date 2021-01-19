<!-- 抢拍 -->
<template lang="html">
  <div class="shootIndex">
    <div class="shootTop">
      <!-- EOS实时价格/均价 -->
      <ul>
        <li>
          <p>EOS&nbsp;{{$t('stableCurrency.priceTwo')}}</p>
          <p>{{nowPrice}}&nbsp;USDB</p>
        </li>
        <li>
          <p>EOS&nbsp;{{$t('stableCurrency.fivePrice2')}}</p>
          <p>{{fivePrice}}&nbsp;USDB</p>
        </li>
      </ul>
      <p class="shootTitle">*{{$t('stableCurrency.plain')}}&nbsp;<span @click="rulesBox">{{$t('stableCurrency.rule')}}></span></p>
    </div>
    <!-- 爆仓列表 -->
    <div class="shootMes">
      <p class="mesTitle">
        {{$t('stableCurrency.toBurst')}}
        <!-- <router-link to="/allOut" tag="span">
          {{$t('stableCurrency.snapShot')}}
          <svg-icon :icon="'icon-back'" :size="26" svgClass="icon" :color="'#ccc'"></svg-icon>
        </router-link> -->
      </p>
      <ul v-if="isHasData">
        <li v-for="(shoot,indexSh) in shootList" :key="indexSh">
          <p class="accMes">
            {{shoot.owner.substring(0,4)}}***
            <button type="button" name="button" @click="rushShoot(indexSh)">{{$t('stableCurrency.bidBtn')}}(
              <i class="disMes" v-if="shoot.end_ts < 60">98{{$t('stableCurrency.disSymbol')}}</i>
              <i class="disMes" v-if="shoot.end_ts > 60 && shoot.end_ts < 120">96{{$t('stableCurrency.disSymbol')}}</i>
              <i class="disMes" v-if="shoot.end_ts > 120 && shoot.end_ts < 180">94{{$t('stableCurrency.disSymbol')}}</i>
              <i class="disMes" v-if="shoot.end_ts > 180 && shoot.end_ts < 240">92{{$t('stableCurrency.disSymbol')}}</i>
              <i class="disMes" v-if="shoot.end_ts > 300">9{{$t('stableCurrency.disSymbol')}}</i>)
            </button>
          </p>
          <div class="dealMes">
            <p>
              <span>{{$t('stableCurrency.totalCollateral')}}(EOS)</span>
              <span>{{parseFloat(shoot.total_collateral).toFixed(4)}}</span>
            </p>
            <p>
              <span>{{$t('stableCurrency.dealAve')}}(EOS)</span>
              <span>
                <span class="dealAve" v-if="shoot.end_ts < 60">{{(shoot.fivePrice * 0.98).toFixed(4)}}</span>
                <span class="dealAve" v-if="shoot.end_ts > 60 && shoot.end_ts < 120">{{(shoot.fivePrice * 0.96).toFixed(4)}}</span>
                <span class="dealAve" v-if="shoot.end_ts > 120 && shoot.end_ts < 180">{{(shoot.fivePrice * 0.94).toFixed(4)}}</span>
                <span class="dealAve" v-if="shoot.end_ts > 180 && shoot.end_ts < 240">{{(shoot.fivePrice * 0.92).toFixed(4)}}</span>
                <span class="dealAve" v-if="shoot.end_ts > 300">{{(shoot.fivePrice * 0.9).toFixed(4)}}</span>
                &nbsp;EOS</span>
            </p>
            <p>
              <span>{{$t('stableCurrency.totalCirculation')}}(USDB)</span>
              <span>{{parseFloat(shoot.total_issue).toFixed(4)}}</span>
            </p>
          </div>
        </li>
      </ul>
      <p v-else style="textAlign:center;color:#666;fontSize:.4rem;">暂无数据</p>
      <p style="textAlign:center;" v-if="isLoad">
        <mt-spinner style="margin:0 .1rem;" :type="2" v-if="true" color="#FFBD53"> </mt-spinner>
      </p>
    </div>
    <Popup title="规则" :width="85" ref="openRe" v-if="rushRules">
      <p class="rushRules">
        *爆仓折扣价即为该仓爆仓一分钟内为98折，折扣每分钟递增0.2折，最大折扣为9折，即该仓爆仓5分钟之后为9折。
      </p>
    </Popup>
  </div>
</template>
<script>
import EosTool from '@/utils/eostool'
import {mapState,mapMutations} from 'vuex'
import {getServeTime2} from '@/api/common'
import Popup from '@/views/swap/components/popup'
export default {
  name:'Shoot',
  data(){
    return{
      shootList:[],//即将爆仓列表
      isLoad:false,//loading
      isHasData:true,
      fivePrice:null,//五分钟均价
      nowPrice:null,//实时价格
      timer:null,//定时器
      rushRules:false,
    }
  },
  components:{Popup},
  computed:{

  },
  created(){
    this.getPrice();
    this.getShoot();
    this.timer = setInterval(()=>{
      this.getShoot();
    },15000)
  },
  watch:{
    shootList(val,oldVal){
      if(val.length > 0){
        this.isHasData = true;
      }else{
        this.isHasData = false;
      }
    }
  },
  methods:{
    ...mapMutations(['fivePrice_fn','nowPrice_fn']),
    async getPrice(){
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
            this.fivePrice_fn((e.avg_price /10000).toFixed(4));
            this.fivePrice = (e.avg_price /10000).toFixed(4);
          }
          if(e.key == 10){
            this.nowPrice_fn((e.avg_price /10000).toFixed(4));
            this.nowPrice = (e.avg_price /10000).toFixed(4);
          }
        });
      }
    },
    async getShoot(){//获取爆仓列表
      this.isLoad = true;
      const params={
        code:'eosusdbvault',
        scope:'eosusdbvault',
        table:'auctions',
        limit:500,
        json:true,
      };
      const result = await EosTool.getTableRows(params);
      let res = await getServeTime2()
      if(result.length > 0){
        result.forEach(e => {
          this.$set(e,'end_ts',(res.timestamp / 1000).toFixed(0) - e.create_ts)
          this.$set(e,'fivePrice',this.fivePrice)
        });
      }
      this.shootList = result;
      this.isLoad = false;
    },
    async rushShoot(index){//参与抢拍
      this.$ins.open();
      const account = this.$store.state.app.account;
      let nowPrice = null;
      let nowUSDB = parseFloat(this.shootList[index].total_issue);
      let nowDis = this.shootList[index].end_ts;
      // switch (nowDis) {
      //   case nowDis < 60:
      //     nowPrice = (nowUSDB * 0.98).toFixed(4);
      //     console.log(1)
      //     break;
      //   case nowDis > 60 && nowDis < 120:
      //     console.log(2)
      //     break;
      //   case nowDis > 120 && nowDis < 180:
      //     console.log(3)
      //     break;
      //   case nowDis > 180 && nowDis < 240:
      //     console.log(4)
      //     break;
      //   case nowDis > 300:
      //     console.log(5)
      //     break;
      // }
      if(nowDis < 60){
        nowPrice = (nowUSDB * 0.98).toFixed(4);
      }else if(nowDis > 60 && nowDis < 120){
        nowPrice = (nowUSDB * 0.96).toFixed(4);
      }else if(nowDis > 120 && nowDis < 180){
        nowPrice = (nowUSDB * 0.94).toFixed(4);
      }else if(nowDis > 180 && nowDis < 240){
        nowPrice = (nowUSDB * 0.92).toFixed(4);
      }else if(nowDis > 300){
        nowPrice = (nowUSDB * 0.9).toFixed(4);
      }
      const actions = [
        {
          account:'eosusdbtoken',
          name:'transfer',
          authorization:[
            {
              actor:account.name,
              permission:account.authorization || 'active'
            }
          ],
          data:{
            from:account.name,
            to:'eosusdbvault',
            quantity:nowPrice + ' USDB',
            memo:'bid:' + this.shootList[index].id
          }
        }
      ]
      const result = await EosTool.transact(actions);
      if(!result.transaction_id){
        //错误
        const res = EosTool.handleScatterError(result);
        this.$toast(res.type  ===  "lang" ? this.$t(res.text) : res.text);
        setTimeout(() => {
          this.$ins.close();
        },1000)
        return;
      }
      this.getShoot();
      this.$toast('抢拍成功');
      setTimeout(()=>{
        this.$ins.close();
      },1000)
    },
    rulesBox(){//规则弹窗
      this.rushRules = true;
      setTimeout(() => {
        this.$refs.openRe.openRe(true)
      },10)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer); //清除定时器
  }
}
</script>

<style lang="scss" scoped>
.shootTop{
  width: 95%;
  margin:0 auto;
  padding: 140px 20px 20px 20px;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  ul{
    width: 90%;
    margin:0 auto;
    display: flex;
    justify-content: space-between;
    li{
      width: 40%;
      display: flex;
      flex-direction: column;
      font-size: .4rem;
      p:first-child{
        color:#999;
      }
      p:last-child{
        color:black;
        font-size: .5rem;
        font-weight: 500;
      }
    }
  }
  .shootTitle{
    width: 100%;
    text-align: center;
    color:#FFA300;
    margin-top: .5rem;
    margin-bottom: .3rem;
  }
}
.shootMes{
  width: 95%;
  margin:0 auto;
  .mesTitle{
    line-height: 1.6rem;
    font-size: .55rem;
    font-weight: 500;
    position: relative;
    span{
      font-size: .4rem;
      font-weight: normal;
      color:#999;
      position: absolute;
      right:.4rem;
      top:.1rem;
      .icon{
        transform: rotate(180deg);
        position: absolute;
        top:.6rem;
        right:-.4rem;
      }
    }
  }
  ul{
    width: 100%;
    li{
      box-sizing: border-box;
      padding: .4rem .3rem;
      box-shadow: 0px 10px 30px #ccc;
      border-radius: 20px;
      font-size: .4rem;
      margin-top: .4rem;
      .accMes{
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding-bottom: .4rem;
        border-bottom: 1px solid #eee;
        font-weight: bold;
        .disMes{
          font-size: .36rem;
          color:white;
        }
        button{
          padding: 0 .2rem;
          font-size: .36rem;
          height: .7rem;
          border-radius: 10px;
          background: linear-gradient(90deg, #FFBD53 0%, #FFA300 100%);
          color:white;
        }
      }
      .dealMes{
        margin-top: .4rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        p{
          display: flex;
          flex-direction: column;
          span:first-child{
            font-size: .34rem;
            color:#999;
          }
          .dealAve{
            color:black!important;
            font-size: .4rem!important;
          }
        }
        p:last-child{
          text-align: right;
        }
      }
    }
    li:first-child{
      margin:0;
    }
  }
}
.rushRules{
  width: 90%;
  margin:0 auto;
  padding-bottom: .4rem;
  text-align: justify;
}
</style>
