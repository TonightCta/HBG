<!-- 偿还USDB -->
<template lang="html">
  <div class="repay">
    <!-- 待还金额 -->
    <div class="newPay">
      <p class="issue" v-if="config.issue" @click="quickNum">{{(allOutstanding).toFixed(4)}}</p>
      <p class="issue" v-else>0.0000</p>
      <p class="remark">{{$t('stableCurrency.returned')}}({{$t('stableCurrency.included')}})</p>
      <p class="newText">{{$t('stableCurrency.repayment')}}({{$t('stableCurrency.included')}}:&nbsp;{{(allOutstanding).toFixed(4)}}&nbsp;USDB)</p>
      <p class="newInput">
        <input type="number" v-model="backAccount" name="" value="" @blur="outBack">
        <span>
          {{$t('stableCurrency.balance')}}:&nbsp;{{usdbBalance}}
        </span>
        <span class="place">USDB</span>
      </p>
      <!-- 债仓预览 -->
      <div class="preview">
        <div class="viewMes">
          <p>
            <span>{{$t('stableCurrency.mortgage2')}}{{$t('stableCurrency.ratio')}}&nbsp;<svg-icon :icon="'icon-problem'" style="marginBottom:.05rem;"  color="#666" :size="30" @click.native="mortgageOpen()"></svg-icon></span>
            <span>{{ave}}%</span>
          </p>
          <p>
            <span>{{$t('stableCurrency.totalGen')}}(USDB)</span>
            <span v-if="config.issueC">{{parseFloat(config.issueC).toFixed(4)}}&nbsp;USDB</span>
            <span v-else>0.0000&nbsp;USDB</span>
          </p>
          <p>
            <span>{{$t('stableCurrency.totalAmount')}}(EOS)</span>
            <span v-if="config.collateral">{{parseFloat(config.collateral).toFixed(4)}}&nbsp;EOS</span>
            <span v-else>0.0000&nbsp;EOS</span>
          </p>
          <p>
            <span>{{$t('stableCurrency.burst')}}{{$t('stableCurrency.priceTwo')}}(EOS)&nbsp;<svg-icon :icon="'icon-problem'" color="#666" :size="30" @click.native="burstPrice"></svg-icon></span>
            <span>
              {{fine}}&nbsp;EOS
            </span>
          </p>
        </div>
      </div>
      <!-- 偿还USDB -->
      <p class="genBtn">
        <button type="button" name="button" @click="backUSDB">{{$t('stableCurrency.repay')}}USDB</button>
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
import EosTool from "@/utils/eostool";
import Popup from '@/views/swap/components/popup'
import {getServeTime2} from '@/api/common'
export default {
  name:'Repay',
  data(){
    return{
      config:null,//USDB配置项
      backAccount:(0).toFixed(4),//偿还金额
      fine:'0.0000',//爆仓罚金
      ave:0,//平均抵押率
      mortgageBox:false,//平均抵押率
      mortgageTitle:this.$t('popup.mortgageTitle'),
      burstPriceBox:false,//爆仓价格
      burstPriceTitle:this.$t('popup.burstPriceTitle'),
      burstFineBox:false,//爆仓罚金
      burstFineTitle:this.$t('popup.burstFineTitle'),
      burstRatioBox:false,//爆仓比率
      burstRatioTitle:this.$t('popup.burstRatioTitle'),
      annBox:false,//年化费率
      annTitle:this.$t('popup.annTitle'),
      usdbBalance:null,//用户USD余额
      timeIns:null,//时间差利息
      allOutstanding:0,//所有待偿还
    }
  },
  components:{Popup},
  created(){
    this.config = JSON.parse(window.localStorage.getItem('USDBConfig'));
    this.getUSDBMes();
    setInterval(()=>{
      this.comInterestDiff()
    },30000)
  },
  methods:{
    async getUSDBMes(){//获取生成USDB信息
      const account = this.$store.state.app.account
      let params = {
        upper_bound:account.name,
        lower_bound:account.name,
        code:'eosusdbvault',
        scope:'eosusdbvault',
        table:'vaults',
        json:true
      };
      const result = await EosTool.getTableRows(params);
      if(result.length > 0){
        this.$set(this.config,'interest',result[0].interest)
        this.$set(this.config,'issue',result[0].issue)
        this.$set(this.config,'issueC',result[0].issue)
        this.$set(this.config,'collateral',result[0].collateral)
        this.$set(this.config,'proportion',Number(parseFloat(result[0].collateral) / parseFloat(result[0].issue) * 100).toFixed(2));
        this.$set(this.config,'update_ts',result[0].update_ts);
        this.fine = (parseFloat(this.config.issue) * this.config.lineStr / parseFloat(this.config.collateral)).toFixed(4)
        this.ave = (parseFloat(this.config.collateral) * this.config.priceUs / (parseFloat(this.config.issueC) + parseFloat(this.config.interest)) * 100).toFixed(2)
        this.allOutstanding = parseFloat(this.config.issue) + parseFloat(this.config.interest)
        window.localStorage.setItem('USDBConfig',JSON.stringify(this.config));
      }else{
        this.$set(this.config,'interest',0)
        this.$set(this.config,'issue',0)
      }
      const USDBBalance = await EosTool.getCurrencyBalance(
        'eosusdbtoken',account.name,'USDB'
      );
      if(!USDBBalance){
        this.usdbBalance = (0).toFixed(4) + ' USDB'
      }else{
        this.usdbBalance = USDBBalance
      }
    },
    async comInterestDiff(){//计算利息差
      let serveTime = await getServeTime2();//服务器时间
      //时间差
      let timeEnd = Number(serveTime.timestamp / 1000).toFixed(0) - Number(this.config.update_ts);
      //年利息
      let yearIns = parseFloat(this.config.issue) * (this.config.annualized / 100).toFixed(2)
      //每秒利息
      let secIns = yearIns / 365 / 24 / 60 / 60;
      //时间段利息
      if(this.allOutstanding < 0.0005){
        this.timeIns = parseFloat(timeEnd / 100 * secIns) + parseFloat(.0003);
      }else{
        this.timeIns = parseFloat(timeEnd / 100 * secIns)
      }
      //最终需偿还总额
      this.allOutstanding = parseFloat(this.allOutstanding) + parseFloat(this.timeIns);
    },
    async backUSDB(){//偿还USDB
      const account = this.$store.state.app.account;
      if(Number(this.backAccount) <= 0){
        this.$toast(this.$t('toastTip.toasMsg2'))
      }else{
        this.$ins.open()
        const actions = [
          {
            account:'eosusdbtoken',
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
              quantity:parseFloat(this.backAccount) + ' USDB',
              memo:''
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
        this.$toast(this.$t('toastTip.success'))
        this.getUSDBMes();
        this.backAccount=(0).toFixed(4);
        setTimeout(() => {
          this.$ins.close();
        },1000)
      }
    },
    //失焦事件
    outBack(){
      this.backAccount = Number(this.backAccount).toFixed(4)
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
    quickNum(){//快捷操作
      this.backAccount = (parseFloat(this.config.issue) + parseFloat(this.config.interest)).toFixed(4)
    }
  },
  watch:{
    backAccount(val,oldVal){
      let allUSDB = (parseFloat(this.config.issue) + parseFloat(this.config.interest)).toFixed(4);
      if(!this.config.issue){
        this.$toast(this.$t('toastTip.toasMsg6'));
        this.backAccount = (0).toFixed(4)
      }else if(Number(val) == Number(allUSDB) || Number(val) > Number(allUSDB)){
        this.fine = (0).toFixed(4)
        this.ave = (0).toFixed(2)
        this.config.issueC = (0).toFixed(4)
      }else if(Number(val) < Number(allUSDB) && Number(val) > parseFloat(this.config.issue)){
        this.config.issueC = (parseFloat(this.config.issue) + parseFloat(this.config.interest) - val).toFixed(4)
        this.fine = (parseFloat(this.config.issueC) * this.config.lineStr / parseFloat(this.config.collateral)).toFixed(4)
        this.ave = (parseFloat(this.config.collateral) * this.config.priceUs / (parseFloat(this.config.issueC) + parseFloat(this.config.interest)) * 100).toFixed(2)
      }else{
        this.config.issueC = (parseFloat(this.config.issue) - val).toFixed(4)
        this.fine = (parseFloat(this.config.issueC) * this.config.lineStr / parseFloat(this.config.collateral)).toFixed(4)
        this.ave = (parseFloat(this.config.collateral) * this.config.priceUs / (parseFloat(this.config.issueC) + parseFloat(this.config.interest)) * 100).toFixed(2)
      }
    }
  },
  computed:{

  },
}
</script>

<style lang="scss" scoped>
.repay{
  width: 92%;
  margin: 0 auto;
}
.newPay{
  background: white;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  padding:0 .3rem;
  border-radius: 20px;
  margin-top: .8rem;
  position: relative;
  padding-bottom: .5rem;
  .issue{
    width: 100%;
    text-align: center;
    font-size: 1rem;
    font-weight: 500;
    line-height: 2.2rem;
  }
  .remark{
    text-align: center;
    font-size: .4rem;
    margin-top: -.2rem;
    color:#666;
  }
  .newText{
    font-size: .4rem;
    color:#333;
    line-height: 1.2rem;
    margin-top: .1rem;
  }
  .newInput{
    width: 100%;
    position: relative;
    background: #f5f5f5;
    box-sizing: border-box;
    padding: .1rem .2rem;
    border-radius: 15px;
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
      font-size: .44rem;
      top:50%;
      margin-top: -.7rem;
    }
    span:nth-child(2){
      display: inline-block;
      width: 100%;
      text-align: right;
      line-height: 1rem;
      color:#999;
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
        margin-bottom: .05rem;
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
