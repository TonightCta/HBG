<!-- 管理抵押 -->
<template lang="html">
  <div class="management">
    <div class="newMan">
      <!-- 操作 -->
      <ul class="genMes">
        <li>
          <p>
            <span class="inpTitle">{{$t('stableCurrency.operType')}}</span>
          </p>
          <p class="input">
            <span class="manType">
              <span class="" @click="plus()" :class="{turnActive:isTurn == 1}">
                {{$t('stableCurrency.plus')}}
                <img :src="manType" alt="">
              </span>
              <span class="" @click="reduce()" :class="{turnActive:isTurn == 2}">
                {{$t('stableCurrency.reduce')}}
                <img :src="manType" alt="">
              </span>
            </span>
          </p>
        </li>
        <li>
          <p>
            <span class="inpTitle">{{numText}}{{$t('public.amount')}}</span>
          </p>
          <div class="newInput">
            <p class="input">
              <input type="number" name="" value="" v-model="operNum" @blur="outOper">
              <span class="place">EOS</span>
            </p>
            <p class="inpText" v-if="isTurn == 1" @click="operNum = parseFloat(config.userBalance)">{{$t('stableCurrency.balance')}}:&nbsp;{{config.userBalance}}&nbsp;EOS</p>
            <p class="inpText" v-else @click="operNum = availableBla">{{$t('stableCurrency.max')}}{{$t('pool.sub')}}:&nbsp;{{availableBla}}&nbsp;EOS</p>
          </div>
        </li>
      </ul>
      <!-- 债仓预览 -->
      <div class="preview">
        <div class="viewMes">
          <p>
            <span>{{$t('stableCurrency.mortgage2')}}{{$t('stableCurrency.ratio')}}&nbsp;<svg-icon :icon="'icon-problem'" svgClass="problem" style="marginBottom:.05rem;" color="#666" :size="30" @click.native="mortgageOpen"></svg-icon></span>
            <span>{{ave}}%</span>
          </p>
          <p>
            <span>{{$t('stableCurrency.totalGen')}}(USDB)</span>
            <span v-if="config.issue">{{parseFloat(config.issue).toFixed(4)}}&nbsp;USDB</span>
            <span v-else>0.0000&nbsp;EOS</span>
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
      <!-- 增加/减少抵押量 -->
      <p class="genBtn">
        <button type="button" name="button" @click="operSub">{{numText}}</button>
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
          <span>{{$t('stableCurrency.burst')}}{{$t('stableCurrency.fine')}}&nbsp;<svg-icon :icon="'icon-problem'" color="#666" :size="30" @click.native="burstFineOpen"></svg-icon></span>
          <span>{{(config.burstFine).toFixed(2)}}%</span>
        </li>
        <li>
          <span>{{$t('stableCurrency.burst')}}{{$t('stableCurrency.proportion')}}&nbsp;<svg-icon :icon="'icon-problem'" color="#666" :size="30" @click.native="burstRatio"></svg-icon></span>
          <span>{{(config.lineStr * 100).toFixed(2)}}%</span>
        </li>
        <li>
          <span>{{$t('stableCurrency.rate')}}&nbsp;<svg-icon :icon="'icon-problem'" color="#666" :size="30" @click.native="annBoxOpen"></svg-icon></span>
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
export default {
  name:'Management',
  data(){
    return{
      manType:require('@/assets/images/turnType.png'),//选中角标
      isTurn:1,//1增加 2减少
      numText:this.$t('stableCurrency.plus'),//按钮文案
      config:null,//USDB配置
      fine:'0.0000',//爆仓价格
      ave:0,//平均抵押率
      operNum:(0).toFixed(4),//操作数量
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
      availableBla:null,//最大可减少量
    }
  },
  components:{Popup},
  created(){
    this.config = JSON.parse(window.localStorage.getItem('USDBConfig'));
    if(this.config.ave){
      this.fine = (parseFloat(this.config.issue) * this.config.lineStr / parseFloat(this.config.collateral)).toFixed(4)
      this.ave = (parseFloat(this.config.collateral) * this.config.priceUs / parseFloat(this.config.issue) * 100).toFixed(2)
    }
    this.getUSDBMes()
  },
  watch:{
    isTurn(val,oldVal){//按钮文案切换
      if(val == 1){
        this.numText = this.$t('stableCurrency.plus')
      }else{
        this.numText = this.$t('stableCurrency.reduce')
      }
    },
    operNum(val,oldVal){//操作数量监听
      if(this.config.issue){
        let temValue = 0;//临时数据
        if(this.isTurn == 1){ //增加
          temValue = temValue + Number(val);
          this.config.collateral = parseFloat(this.config.collateral) + temValue - oldVal;
        }else{
          if(Number(val) > Number(this.availableBla)){
            this.operNum = (0).toFixed(4)
            this.$toast(this.$t('stableCurrency.reduceError'))
          }
          temValue = temValue - Number(val);
          this.config.collateral = parseFloat(this.config.collateral) + temValue + Number(oldVal);
        }
        this.fine=(parseFloat(this.config.issue) * this.config.lineStr / this.config.collateral).toFixed(4)
        this.ave = (parseFloat(this.config.collateral) * this.config.priceUs / parseFloat(this.config.issue) * 100).toFixed(2);
      }else{
        this.$toast(this.$t('toastTip.toasMsg7'));
        this.operNum = (0).toFixed(4)
      }
    }
  },
  methods:{
    async operSub(){//提交操作
      if(this.operNum > 0){
        this.$ins.open()
        const account = this.$store.state.app.account;
        let morRatio = this.ave = (parseFloat(this.config.collateral) * this.config.priceUs / parseFloat(this.config.issue) * 100).toFixed(2)
        if(morRatio < 150){
          this.$toast(this.$t('toastTip.toasMsg3'))
          setTimeout( ()=>{
            this.$ins.close()
          },2000)
        }else{
          let actions = [];
          if(this.isTurn == 1){//增加
            actions = [
              {
                account:'eosio.token',
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
                  quantity:this.operNum + ' EOS',
                  memo:'deposit'
                }
              }
            ]
          }else{
            actions = [
              {
                account:'eosusdbvault',
                name:'withdraw',
                authorization:[
                  {
                    actor:account.name,
                    permission:account.authorization || 'active'
                  }
                ],
                data:{
                  owner:account.name,
                  quantity:this.operNum + ' EOS',
                }
              }
            ]
          }
          // console.log(actions)
          const result = await EosTool.transact(actions);
          if(!result.transaction_id){
            //错误
            const res = EosTool.handleScatterError(result);
            if(res.code == 305003){
              this.$toast('123')
            }else{
              this.$toast(res.type  ===  "lang" ? this.$t(res.text) : res.text);
            }
            setTimeout(() => {
              this.$ins.close();
            },1000)
            return;
          }
          this.$toast(this.$t('toastTip.success'))
          this.operNum = (0).toFixed(4);
          setTimeout(() => {
            this.getUSDBMes();
          },3000)
          setTimeout(()=>{
            this.$ins.close()
          },1000);
        }
      }else{
        this.$toast(this.$t('toastTip.toasMsg1'))
      }
    },
    async getUSDBMes(){
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
        this.fine = (parseFloat(this.config.issue) * this.config.lineStr / parseFloat(this.config.collateral)).toFixed(4)
        this.ave = (parseFloat(this.config.collateral) * this.config.priceUs / parseFloat(this.config.issue) * 100).toFixed(2)
        window.localStorage.setItem('USDBConfig',JSON.stringify(this.config));
        this.availableBla = (parseFloat(this.config.collateral) - (1.5 * (parseFloat(this.config.issue) + parseFloat(this.config.interest)) / this.config.priceUs)).toFixed(4)
      }
    },
    plus(){//增加EOS
      this.isTurn = 1;
      this.operNum = (0).toFixed(4);
      this.getUSDBMes()
    },
    reduce(){//减少EOS
      this.isTurn = 2;
      this.operNum = (0).toFixed(4);
      this.getUSDBMes()
    },
    //失焦事件
    outOper(){
      this.operNum = Number(this.operNum).toFixed(4)
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
  },
}
</script>

<style lang="scss" scoped>
.management{
  width: 92%;
  margin:0 auto;
}
.newMan{
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
      border-radius: 15px;
      box-sizing: border-box;
      padding: 0 .2rem;
      .inpTitle{
        display: inline-block;
        font-size: .44rem;
        color:#666;
        width: 25%;
      }
      input{
        width: 100%;
        background: #f5f5f5;
        height: 1.2rem;
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
      .inpText{
        width: 100%;
        text-align: right;
        line-height: 1.4rem;
        color:#999;
        font-size: .4rem;
        padding-right: .1rem;
      }
    }
    .input{
      position: relative;
      width: 100%;
      display: flex;
      justify-content: space-between;
      line-height: 1.2rem;
      .manType{
        width: 100%;
        display: flex;
        justify-content: space-between;
        span{
          width: 49%;
          text-align: center;
          height: 1.2rem;
          border:2px solid #ccc;
          box-sizing: border-box;
          display: inline-block;
          padding: 0 .44rem;
          border-radius: 15px;
          position: relative;
          transition: .5s all;
          font-size: .4rem;
          font-weight: bold;
          img{
            position: absolute;
            width: .44rem;
            height: .44rem;
            right:0;
            top:0;
            opacity: 0;
            transition: .5s all;
          }
        }
        .turnActive{
          border-color:#FFA300;
          color:#FFA300;
          img{
            opacity: 1;
          }
        }
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
