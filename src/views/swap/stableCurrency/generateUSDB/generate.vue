<!-- 生成USDB -->
<template lang="html">
  <div class="generate">
    <!-- 生成配置 -->
    <div class="newGen">
      <ul class="genMes">
        <li>
          <p>
            <span class="inpTitle">{{$t('stableCurrency.mortgage2')}}{{$t('stableCurrency.amt')}}</span>
          </p>
          <div class="newInput">
            <p class="input">
              <input type="number" name="" value="" v-model="morAmount" @blur="outMor">
              <span class="place">EOS</span>
            </p>
            <p class="inpText">
              <span>
                <!-- 占位符 -->
              </span>
              <span style="display:flex;">
                {{$t('stableCurrency.balance')}}:
                <mt-spinner style="margin:0 .1rem;" :type="2" v-if="loadBalance" color="#FFBD53"> </mt-spinner>
                <span v-else>{{config.userBalance}}&nbsp;EOS</span>
              </span>
            </p>
          </div>
        </li>
        <li>
          <p>
            <span class="inpTitle">{{$t('stableCurrency.generate')}}{{$t('stableCurrency.amt')}}</span>
          </p>
          <div class="newInput">
            <p class="input">
              <input type="number" v-model="genAmount" name="" value="" @blur="outGen">
              <span class="place">USDB</span>
            </p>
            <p class="inpText">
              <span>
                <!-- 占位符 -->
              </span>
              <span @click="maxGen">
                {{$t('stableCurrency.max')}}{{$t('stableCurrency.generate')}}:&nbsp;{{Number(config.priceUs / 1.5 * morAmount).toFixed(4)}}&nbsp;USDB
              </span>
            </p>
          </div>
        </li>
        <li>
          <p>
            <span class="inpTitle">{{$t('stableCurrency.mortgage2')}}{{$t('stableCurrency.ratio')}}</span>
          </p>
          <div class="newInput">
            <p class="input">
              <input type="text" name="" style="border:none;" value="" v-model="inputPro">
              <span class="place">%</span>
              <span class="blMask"></span>
            </p>
          </div>
        </li>
      </ul>
      <!-- 债仓预览 -->
      <div class="preview">
        <div class="viewMes">
          <p>
            <span>{{$t('stableCurrency.mortgage2')}}{{$t('stableCurrency.ratio')}}&nbsp;<svg-icon :icon="'icon-problem'" style="marginBottom:.05rem;"  color="#666" :size="30" @click.native="mortgageOpen"></svg-icon></span>
            <span>{{inputPro}}%</span>
          </p>
          <p>
            <span>{{$t('stableCurrency.totalGen')}}(USDB)</span>
            <span>{{genAmount}}&nbsp;USDB</span>
          </p>
          <p>
            <span>{{$t('stableCurrency.totalAmount')}}(EOS)</span>
            <span>{{morAmount}}&nbsp;EOS</span>
          </p>
          <p>
            <span>{{$t('stableCurrency.burst')}}{{$t('stableCurrency.priceTwo')}}(EOS)&nbsp;<svg-icon :icon="'icon-problem'" color="#666" :size="30" @click.native="burstPrice"></svg-icon></span>
            <span>
              {{config.burstPrice.toFixed(4)}}&nbsp;EOS
            </span>
          </p>
        </div>
      </div>
      <!-- 生成USDB -->
      <p class="genBtn">
        <button type="button" name="button" @click="subGen">{{$t('stableCurrency.generate')}}USDB</button>
      </p>
    </div>
    <!-- 基础参数 -->
    <div class="genConfig">
      <p class="configTitle">{{$t('stableCurrency.basic')}}</p>
      <ul>
        <li>
          <span>EOS&nbsp;{{$t('stableCurrency.fivePrice2')}}></span>
          <span>{{config.priceUs}}&nbsp;USDB</span>
        </li>
        <li>
          <span>{{$t('stableCurrency.burst')}}{{$t('stableCurrency.fine')}}&nbsp;<svg-icon :icon="'icon-problem'" svgClass="problem" color="#666" :size="30" @click.native="burstFineOpen"></svg-icon></span>
          <span>{{config.burstFine}}%</span>
        </li>
        <li>
          <span>{{$t('stableCurrency.burst')}}{{$t('stableCurrency.ratio')}}&nbsp;<svg-icon :icon="'icon-problem'" svgClass="problem" color="#666" :size="30" @click.native="burstRatio"></svg-icon></span>
          <span>{{(config.lineStr * 100).toFixed(2)}}%</span>
        </li>
        <li>
          <span>{{$t('stableCurrency.rate')}}&nbsp;<svg-icon :icon="'icon-problem'" svgClass="problem" color="#666" :size="30" @click.native="annBoxOpen"></svg-icon></span>
          <span>{{config.annualized}}%</span>
        </li>
      </ul>
    </div>
    <!-- 平均抵押率 -->
    <Popup :title="mortgageTitle" :width="85" ref="openRe" v-if="mortgageBox">
      <div class="mortgageBox">
        <div class="mortgageBoxTitle">
          <p>{{$t('stableCurrency.mortgage2')}}{{$t('stableCurrency.ratio')}}=</p>
          <p>
            <span>{{$t('stableCurrency.mortgage2')}}{{$t('stableCurrency.amt')}} X EOS&nbsp;{{$t('stableCurrency.fivePrice2')}}</span>
            <span class="line"></span>
            <span>{{$t('stableCurrency.total')}}{{$t('stableCurrency.generate')}} + {{$t('stableCurrency.included2')}}</span>
          </p>
        </div>
        <p style="textAlign:left;marginTop:.5rem;color:red;">*{{$t('popup.mortgageText')}}&ge;150%</p>
      </div>
    </Popup>
    <!-- 爆仓价格 -->
    <Popup :title="burstPriceTitle" :width="85" ref="openRe" v-if="burstPriceBox">
      <div class="mortgageBox">
        <div class="mortgageBoxTitle">
          <p>{{$t('popup.burstPriceTitle')}}=</p>
          <p>
            <span>({{$t('stableCurrency.total')}}{{$t('stableCurrency.generate')}} + {{$t('stableCurrency.included2')}}) X 125%</span>
            <span class="line"></span>
            <span>{{$t('stableCurrency.total')}}{{$t('stableCurrency.mortgage2')}}{{$t('stableCurrency.amt')}}</span>
          </p>
        </div>
        <p style="textAlign:left;marginTop:.5rem;color:red;">
          {{$t('popup.burstPriceText')}}
        </p>
      </div>
    </Popup>
    <!-- 爆仓罚金 -->
    <Popup :title="burstFineTitle" :width="85" ref="openRe" v-if="burstFineBox">
      <p style="textAlign:left;paddingBottom:.4rem;width:90%;margin:0 auto;fontSize:.4rem;">
        {{$t('popup.burstFineText')}}
      </p>
    </Popup>
    <!-- 爆仓比率 -->
    <Popup :title="burstRatioTitle" :width="85" ref="openRe" v-if="burstRatioBox">
      <p style="textAlign:left;paddingBottom:.4rem;width:90%;margin:0 auto;fontSize:.4rem;">
        {{$t('popup.burstRatioText')}}&nbsp;&le;&nbsp;{{$t('popup.burstRatioText2')}}
      </p>
    </Popup>
    <!-- 年化费率 -->
    <Popup :title="annTitle" :width="85" ref="openRe" v-if="annBox">
      <div class="annBox">
        <p>{{$t('popup.annText')}}</p>
        <div class="annBoxTitle">
          <p>{{$t('popup.annText2')}}=</p>
          <p>
            <span>{{$t('stableCurrency.total')}}{{$t('stableCurrency.generate')}} X {{$t('popup.annTitle')}}</span>
            <span class="line"></span>
            <span>365{{$t('popup.day')}}</span>
          </p>
        </div>
        <p>{{$t('popup.annText3')}}</p>
        <p>{{$t('popup.annText4')}}</p>
        <p>{{$t('popup.annText5')}}</p>
      </div>
    </Popup>
  </div>
</template>

<script>
import Vue from 'vue'
import { Spinner,Indicator } from 'mint-ui';
import {mapState,mapMutations} from 'vuex'
import EosTool from "@/utils/eostool";
import Popup from '@/views/swap/components/popup'
Vue.component(Spinner.name, Spinner);
export default {
  name:'Generate',
  data(){
    return{
      doubt:require('@/assets/images/howIcon.png'),
      inputPro:0,//抵押比例
      morAmount:(0).toFixed(4),//抵押数量
      genAmount:(0).toFixed(4),//生成金额
      loadBalance:false,//余额加载
      config:{
        burstFine:null,//爆仓罚金
        burstPrice:0,//爆仓价格
        lineStr:null,//强平线
        annualized:null,//年化率
        userBalance:0,//用户余额
        priceUs:Number(1).toFixed(4),//EOS五分钟均价
      },
      mortgageBox:false,//平均抵押率
      mortgageTitle:this.$t('popup.mortgageTitle'),
      burstPriceBox:false,//爆仓价格
      burstPriceTitle:this.$t('popup.burstPriceTitle'),
      burstFineBox:false,//爆仓罚金
      burstFineTitle:this.$t('popup.burstFineTitle'),
      burstRatioBox:false,//爆仓比率
      burstRatioTitle:this.$t('popup.burstRatioTitle'),
      annBox:false,//年化费率
      annTitle:this.$t('popup.annTitle')
    }
  },
  computed:{
    ...mapState(['USDBConfig'])
  },
  components:{Popup},
  created(){
    if(window.localStorage.getItem('locaConfig')){
      this.USDBConfig_fn(JSON.parse(window.localStorage.getItem('locaConfig')))
    }
    this.getUserEOS();
    this.getConfig();
  },
  watch:{
    morAmount(val,oldVal){
      if(val != null && val != '' && val >0 && this.genAmount > 0 && this.genAmount != null && this.genAmount != ''){
        this.inputPro = (val * this.config.priceUs / this.genAmount * 100).toFixed(2);
        this.config.burstPrice = this.genAmount * this.config.lineStr / val;
      }
    },
    genAmount(val,oldVal){
      if(val != null && val != '' && val > 0 && this.morAmount > 0 && this.morAmount != null && this.morAmount != ''){
        this.inputPro = (this.morAmount * this.config.priceUs / val * 100).toFixed(2)
        this.config.burstPrice = val * this.config.lineStr / this.morAmount;
      }
    }
  },
  methods:{
    ...mapMutations(['USDBConfig_fn']),
    async getUserEOS(){//获取用户余额
      this.loadBalance=true;
      const account = this.$store.state.app.account
      let balance=await EosTool.getCurrencyBalance(
        'eosio.token',account.name,'EOS'
      );
      if(!balance){
        this.config.userBalance = '0'
      }else{
        this.config.userBalance = parseFloat(balance)
      }
      this.loadBalance=false;
    },
    async getConfig(){//获取配置信息
      this.config.burstFine = this.USDBConfig.burstFine;
      this.config.lineStr = this.USDBConfig.lineStr;
      this.config.annualized = this.USDBConfig.annualized;
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
            this.$set(this.config,'priceUs',(e.avg_price /10000).toFixed(4))
          }
        });
      }
      window.localStorage.setItem('USDBConfig',JSON.stringify(this.config));
    },
    async subGen(){//生成USDB
      const account = this.$store.state.app.account;
      if(this.morAmount <= 0){
        this.$toast(this.$t('toastTip.toasMsg5'))
      }else{
        this.$ins.open();
        const actions = [
          {
            account:'eosio.token',
            name: "transfer",
            authorization:[
              {
                actor:account.name,
                permission:account.authorization || 'active'
              }
            ],
            data:{
              from:account.name,
              to:'eosusdbvault',
              quantity:this.morAmount + ' EOS',
              memo:'issue:' + this.genAmount * 10000
            }
          }
        ];
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
        this.morAmount = (0).toFixed(4);
        this.genAmount = (0).toFixed(4);
        this.inputPro = (0).toFixed(2);
        this.config.burstPrice = 0;
        this.$toast('生成成功');
        this.getUserEOS()
        setTimeout(()=>{
          this.$ins.close();
        },1000)
      }
    },
    maxGen(){//最大可生成
      this.genAmount = Number(this.config.priceUs / 1.5 * this.morAmount).toFixed(4)
    },
    //失焦事件
    outMor(){
      this.morAmount = Number(this.morAmount).toFixed(4);
      this.comAve()
    },
    outGen(){
      this.genAmount = Number(this.genAmount).toFixed(4);
      this.comAve()
    },
    comAve(){//计算抵押比例
      if(this.morAmount != null && this.morAmount != '' && this.morAmount >0 && this.genAmount > 0 && this.genAmount != null && this.genAmount != ''){
        if(Number(this.inputPro) < 150){
          this.$toast(this.$t('toastTip.toasMsg3'));
          this.genAmount = (0).toFixed(4);
          this.config.burstPrice = 0;
          this.inputPro = (0).toFixed(2);
        }else if(Number(this.nputPro) > 550){
          this.$toast(this.$t('toastTip.toasMsg4'))
          this.genAmount = (0).toFixed(4);
          this.config.burstPrice = 0;
          this.inputPro = (0).toFixed(2);
        }
      }
    },
    mortgageOpen(){//平均抵押率
      this.mortgageBox = true;
      this.burstPriceBox=false;
      this.burstFineBox = false;
      this.annBox = false;
      this.burstRatioBox = false;
      setTimeout(() => {
        this.$refs.openRe.openRe(true)
      },10)
    },
    burstPrice(){//爆仓价格
      this.mortgageBox = false;
      this.burstPriceBox = true;
      this.burstFineBox = false;
      this.annBox = false;
      this.burstRatioBox = false;
      setTimeout(() => {
        this.$refs.openRe.openRe(true)
      },10)
    },
    burstFineOpen(){//爆仓罚金
      this.mortgageBox = false;
      this.burstPriceBox = false;
      this.burstFineBox = true;
      this.burstRatioBox = false;
      this.annBox = false;
      setTimeout(() => {
        this.$refs.openRe.openRe(true)
      },10)
    },
    burstRatio(){//爆仓比例
      this.mortgageBox = false;
      this.burstPriceBox = false;
      this.burstFineBox = false;
      this.burstRatioBox = true;
      this.annBox = false;
      setTimeout(() => {
        this.$refs.openRe.openRe(true)
      },10)
    },
    annBoxOpen(){//年化费率
      this.mortgageBox = false;
      this.burstPriceBox = false;
      this.burstFineBox = false;
      this.burstRatioBox = false;
      this.annBox = true;
      setTimeout(() => {
        this.$refs.openRe.openRe(true)
      },10)
    },
  }
}
</script>

<style lang="scss" scoped>
.generate{
  // overflow: hidden;
  width: 92%;
  margin:0 auto;
}
.newGen{
  background: white;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  padding:0 .3rem;
  border-radius: 20px;
  margin-top: .8rem;
  position: relative;
  padding-bottom: .5rem;
}
.genMes{
  width: 100%;
  li{
    p:first-child{
      width: 100%;
      margin:0 auto;
      font-size: .44rem;
      line-height: 1.4rem;
    }
    .newInput{
      background: #f5f5f5;
      border-radius: 10px;
      box-sizing: border-box;
      padding: .1rem .2rem;
      .input{
        position: relative;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .blMask{
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0);
          top:0;
          left:0;
        }
        input{
          width: 100%;
          height: 1.2rem;
          background: #f5f5f5;
          font-size: .5rem;
          font-weight: bold;
          box-sizing: border-box;
          padding-left: .3rem;
          border-bottom: 1px solid rgba(0,0,0,.1);
        }
        .place{
          position: absolute;
          right:.2rem;
          color:#999;
          font-size: .4rem;
          top:50%;
          margin-top: -.6rem;
        }
      }
      .inpText{
        width: 100%;
        text-align: right;
        line-height: 1.4rem;
        color:#999;
        font-size: .45rem;
        display: flex;
        justify-content: space-between;
      }
    }


  }
}
.preview{
  width: 100%;
  box-sizing: border-box;
  padding: .3rem;
  border-radius: 20px;
  font-size: .4rem;
  img{
    width: .45rem;
    height: .45rem;
  }
  .viewMes{
    width: 100%;
    display: flex;
    margin-top: .4rem;
    flex-wrap: wrap;
    p{
      display: flex;
      flex-direction: column;
      font-size: .44rem;
      width: 50%;
      margin-bottom: .3rem;
      span{
        line-height: .8rem;
      }
      span:first-child{
        color:#999;
      }
      span:last-child{
        font-weight: bold;
      }
    }
  }
}
.genBtn{
  width: 80%;
  position: absolute;
  left:50%;
  margin-left: -40%;
  bottom:-.6rem;
  button{
    width: 100%;
    height: 1.3rem;
    background: linear-gradient(90deg, #FFBD53 0%, #FFA300 100%);
    color:white;
    border-radius: 50px;
    font-size: .5rem;
    font-weight: 500;
    box-shadow: 0px 4px 20px rgba(255, 163, 0, 0.3);
  }
}
.genConfig{
  width: 100%;
  padding-bottom: .5rem;
  margin-top: 1rem;
  .configTitle{
    font-size: .5rem;
    font-weight: bold;
    margin-top:.5rem;
  }
  ul{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    background: white;
    box-sizing: border-box;
    padding: .4rem .3rem;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    margin-top: .5rem;
    li{
      width: 50%;
      display: flex;
      flex-direction: column;
      font-size: .44rem;
      span{
        line-height: .8rem;
      }
      span:first-child{
        color:#999;
      }
      span:last-child{
        font-weight: bold;
        font-size: .5rem;
      }
      .problem{
        // margin-bottom: .05rem;
      }
    }
  }
}
.mortgageBox{
  width: 90%;
  margin:0 auto;
  font-size: .38rem;
  padding-bottom: .4rem;
  .mortgageBoxTitle{
    width: 100%;
    display: flex;
    font-size: .3rem;
    box-sizing: border-box;
    padding-left: .3rem;
    p{
      height: 1.4rem;
    }
    p:first-child{
      line-height: 1.4rem;
      margin-right: .5rem;
    }
    p:last-child{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .line{
        width: 100%;
        height: 2px;
        background: black;
      }
    }
  }
}
.annBox{
  width: 90%;
  margin:0 auto;
  font-size: .38rem;
  .annBoxTitle{
    width: 100%;
    display: flex;
    font-size: .3rem;
    padding-left: .3rem;
    p{
      height: 1.4rem;
      width: auto;
      text-align: center;
    }
    p:first-child{
      line-height: 1.4rem;
      margin-right: .5rem;
    }
    p:last-child{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .line{
        width: 100%;
        height: 2px;
        background: black;
      }
    }
  }
  p{
    text-align: left;
    width: 90%;
    margin:0 auto;
    margin-bottom: .4rem;
  }
}
</style>
