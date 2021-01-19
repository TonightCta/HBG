<!-- 金库 -->
<template lang="html">
  <div class="valutIndex">
    <div class="bannerBg">
      <!-- <img :src = "bgUrl" alt = "">  -->
      <svg-icon :icon="'icon-back'" @click.native="backPage" :size="35" color="white" svgClass="backIcon"/>
    </div>
    <div class="valutCon">
      <ul class="selfMes">
        <!-- 总存款 -->
        <li>
          <p> {{$t('valut.allset')}}<span> {{allMor}}</span> </p>
          <p> {{$t('valut.realtime')}}<span> {{ann}}</span> </p>
          <p> {{$t('valut.allhas')}}<span> {{allStock}}</span> </p>
          <p> {{$t('valut.secdis')}}<span> {{secdisVal}}</span> </p>
        </li>
        <!-- 待领取收益 -->
        <li>
          <p>
            {{$t('valut.stayget')}}
            <!-- <img :src="howIcon" alt=""> -->
            <br>
            <span style="display:inline-block" v-if="mortgageMes.staked != 0"> {{unclaimedGet}}</span>
            <span v-else> 0&nbsp;HBG</span>
          </p>
          <p>
            <button type="button" name="button" style="fontSize:.4rem;" @click="getAllMor"> {{$t('valut.receive')}}</button>
          </p>
        </li>
        <!-- 我的存款 -->
        <li>
          <p>
            {{$t('valut.savings')}}&nbsp;( HBG )
            <span> {{(mortgageMes.staked/1000000).toFixed(6)}}<span style="color:#999;"> &nbsp;{{'('+morRatio+'%' +')'}}</span> </span>
          </p>
          <!-- <p>
            {{$t('valut.unlockdate')}}
            <span> {{mortgageMes.end_time}}</span>
          </p>  -->
          <p class="releaseOutTime">
            {{$t('valut.refunding')}} {{(parseFloat(mortgageMes.refunding) / 1000000).toFixed(6) + ' HBG'}}
            <span v-if="isCount"> {{countTime}}</span>
            <span v-else @click="reNow"> {{$t('valut.nowget')}}</span>
            <mt-spinner style="margin:0 .1rem;" :type="2" v-if="loadCountTime" color="#FFBD53"> </mt-spinner>
          </p>
          <p>
            <button type="button" name="button" style="fontSize:.4rem;" @click="openRetr"> {{$t('valut.retrieve')}}</button>
            <button type="button" name="button" style="fontSize:.4rem;" @click="openDep"> {{$t('valut.deposit')}}</button>
          </p>

        </li>
      </ul>
      <!-- HBG达人 -->
      <p class="conTitle">
        HBG&nbsp;{{$t('valut.talent')}}
        <span> {{$t('valut.total')}}:&nbsp;{{allTalent}}</span>
      </p>
      <ul class="elseOne">
        <li v-for="(elsen,indexEl) in elseList" :key="indexEl">
          <div class="eldetails" v-if = "elsen.unclaimedBackNumber != 0">
            <div class="getMes">
              <p>
                <span> {{elsen.unclaimedBack}}</span>
                <span> {{(elsen.unclaimedBackNumber / (elsen.staked / 1000000) * 100).toFixed(2)}}%</span>
              </p>
              <p>
                <span> {{elsen.owner}}</span>
                <span> {{$t('valut.get')}}</span>
              </p>
            </div>
            <div class="setMes">
              <p>
                {{$t('valut.deposit')}}(HBG)
                <span> {{elsen.backStaked}}</span>
              </p>
              <!-- <p>
                {{$t('valut.unlockdate')}}
                <span> {{elsen.re_time}}</span>
              </p>  -->
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 取回存款 -->
    <Popup :width="85" :title ="this.$t('valut.retrieve')" :withBtn='true' ref="openRe" v-if="retrieveBox">
      <div class="retrieveBox">
        <div class="writeBox">
          <p>
            <span> {{$t('valut.currency')}}</span>
            <span> {{$t('valut.deposit')}}{{$t('swap.balance')}}</span>
          </p>
          <div class="write">
            <p>
              <img src="https://ndi.340wan.com/eos/hbgdefitoken-hbg.png" alt = "">
              <span> HBG</span>
              <span> HBG.tonken</span>
            </p>
            <p>
              <input type="number" v-model="getBackValue" name="" placeholder="请输入取回金额">
            </p>
          </div>
        </div>
        <!-- <p class = "endTime"> {{$t('valut.enddate')}}：2020.11.10 09:11:52</p>  -->
        <p class="btnType2">
          <button type="button" name="button" @click="getValut"> {{$t('popup.confirm')}}</button>
        </p>
      </div>
    </Popup>
    <!-- 存入存款 -->
    <Popup :width="85" :title="this.$t('valut.deposit')" :withBtn='true' ref="openRe" v-if="depBox">
      <div class="retrieveBox">
        <div class="writeBox">
          <p>
            <span style="display:flex;"> {{$t('swap.balance')}}:
              &nbsp;&nbsp;
              <mt-spinner style="margin:0 .1rem;" :type="2" v-if="getBlance" color="#FFBD53"> </mt-spinner>
              <span v-else style="marginLeft:.1rem;" @click="setOpenre"> {{userBalance}}</span> &nbsp;
            </span>
            <span> {{$t('valut.deposit')}}</span>
          </p>
          <div class="write">
            <p>
              <img src="https://ndi.340wan.com/eos/hbgdefitoken-hbg.png" alt="">
              <span>HBG</span>
              <span>HBG.tonken</span>
            </p>
            <p>
              <input type="number" v-model="setValue" name="" placeholder="请输入存入金额">
            </p>
          </div>
          <p class="depDate">
            <span> {{$t('valut.depdate')}}</span>
            <span> {{$t('valut.demand')}}</span>
          </p>
          <p class="valutRemark">
            {{$t('valut.backremark')}}
          </p>
        </div>
        <p class="endTime"> {{$t('valut.income')}}：{{getNHBG}}&nbsp;HBG</p>
        <p class="btnType2">
          <button type="button" name="button" @click="setValut"> {{$t('popup.confirm')}}</button>
        </p>
      </div>
    </Popup>
    <!-- 存款时间 -->
    <mt-popup
      v-model="popupVisible"
      position="bottom">
      <div class="" style="width:100%;">
        <p class="chooseDate">
          <span> {{$t('popup.cancel')}}</span>
          <span> {{$t('popup.confirm')}}</span>
        </p>
        <mt-picker :slots="slots" @change = "onValuesChange"></mt-picker>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import Popup from '@/views/swap/components/popup'
import EosTool from "@/utils/eostool";
import { Spinner,Indicator } from 'mint-ui';
import {toLocalTime,countdown2} from '@/utils/common'
import {getServeTime2} from '@/api/common'
Vue.component(Spinner.name, Spinner);
export default {
  name:'Valut',
  data(){
    return{
      howIcon:require('@/assets/images/howIcon.png'),
      testIcon:require('@/assets/images/test.png'),
      elseList:[],
      testValue:(0.0).toFixed(2),
      retrieveBox:false,//取款盒子
      depBox:false,//存款盒子
      popupVisible:false,//存款时间盒子
      slots: [
       {
         flex: 1,
         values: ['2015-01', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06'],
         className: 'slot1',
         textAlign: 'right'
       }, {
         divider: true,
         content: '-',
         className: 'slot2'
       }, {
         flex: 1,
         values: ['2015-01', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06'],
         className: 'slot3',
         textAlign: 'left'
       }
     ],
     getBlance:true,//获取余额load
     userBalance:0,//用户余额
     setValue:0,//存入金额
     mortgageMes:{//已抵押信息
       owner:null,
       refunding:null,
       release_time:null,
       staked:0,
       end_time:'-'
     },
     userAllBalance:0,//用户总HBG余额
     getBackValue:null,//取回存款金额
     unclaimedGet:null,//待领取收益
     allMor:null,//总存款
     allStock:null,//总库存
     secdisVal:null,//每秒分配量
     ann:null,//实时年化
     getNHBG:0.00,//预期年化收益
     countTime:null,//解押倒计时
     isCount:true,//是否解押完成
     allTalent:null,//HBG达人总数
     count:0,//倒计时分钟
     seconds:0,//倒计时秒
     loadCountTime:false,
    }
  },
  components:{Popup},
  created(){
    this.getUserValut();
    this.getUserBalance();
  },
  watch:{
    setValue(val,oldVal){//存款输入监听
      // console.log(val);
      this.getNHBG = (val * parseFloat(this.ann) / 100).toFixed(2);
      // console.log(this.getHBG)
    },
  },
  computed:{
    morRatio(){//存款比例计算
      if(this.mortgageMes.staked != 0){
        return ((this.mortgageMes.staked / 1000000).toFixed(6) / (this.userAllBalance).toFixed(6)*100).toFixed(2)
      }else{
        return 0
      }
    }
  },
  methods:{
    openRetr(){//取回弹框
      this.retrieveBox = true;
      this.depBox = false;
      setTimeout(() => {
        this.$refs.openRe.openRe(true)
      },10)
      this.getBackValue = (this.mortgageMes.staked / 1000000).toFixed(6);
    },
    openDep(){//存款弹框
      this.retrieveBox = false;
      this.depBox = true;
      setTimeout(() => {
        this.$refs.openRe.openRe(true)
      },10);
    },
    onValuesChange(picker, values) {
      if (values[0] >  values[1]) {
        picker.setSlotValue(1, values[0]);
      }
    },
    async getUserBalance(){//获取用户HBG余额
      const account = this.$store.state.app.account
      let balance = await EosTool.getCurrencyBalance(
        'hbgdefitoken',account.name,'HBG'
      );
      if(!balance){
        this.userBalance = '0'
      }else{
        if(!this.mortgageMes.staked && !this.mortgageMes.refunding){//如果没有抵押和解压中的HBG
          this.userBalance = balance
        }else if(this.mortgageMes.staked && !this.mortgageMes.refunding){//如果有抵押中的HBG
          this.userBalance = (parseInt(balance) - this.mortgageMes.staked / 1000000).toFixed(6)+' HBG';
        }else{//如果有抵押中并且有解压中的HBG
          this.userBalance = (parseInt(balance) - this.mortgageMes.staked / 1000000 - this.mortgageMes.refunding / 1000000).toFixed(6)+' HBG';
        }
      }
      //用户余额
      this.userAllBalance = parseFloat(balance);
      //总库存
      // this.allStock = await EosTool.getCurrencyBalance(
      //   'hbgdefitoken','hbgdefivault','HBG'
      // )
      let params = {
        code:'hbgdefivault',
        scope:'hbgdefivault',
        table:'stat',
        json:true
      };
      let statdata = await EosTool.getCurrencyBalance(
        'hbgdefitoken','hbgdefivault','HBG'
      )
      if (!statdata) {
        this.allStock = '0';
      } else {
        this.allStock = statdata;
      }
      this.getProfit();
      setTimeout(()=>{
        this.getTalent();
      },1000)
      //每秒分配量
      this.secdisVal = Number(parseFloat(this.allStock) / 604800).toFixed(6)+' HBG';
      this.claStakedTime()
      this.getBlance = false;
    },
    async claStakedTime(){//计算解押HBG数量以及可取回时间
      if(this.mortgageMes.refunding){
        this.loadCountTime=true;
        let res = await getServeTime2();
        this.count = ((new Date(this.mortgageMes.release_time.replace('T', ' ') + ' GMT').getTime() - res.timestamp) / 60 / 1000).toFixed(0);
        if(this.count >= 0){
          let time = setInterval( () => {
            if (this.seconds == 0 && this.count != 0) {
              this.seconds = 59
              this.count -= 1
              this.isCount = true;
            } else if (Number(this.count) == 0 && this.seconds == 0) {
              this.seconds = 0
              this.isCount = false;
              clearInterval(time)
            } else {
              this.seconds -= 1
              if(this.seconds < 10 && String(this.seconds).length <= 1){
                this.seconds = '0'+this.seconds
              }
              if(this.count < 10 && String(this.count).length <= 1){
                this.count = '0' + this.count
              }
            }
              this.countTime = '00:' + this.count + ':' + this.seconds;
              if(this.countTime != null){
                this.loadCountTime = false;
              }
          }, 1000)
        }else{
          this.loadCountTime = false;
          this.isCount = false;
        }
      }else{
        this.mortgageMes.refunding = 0;
        this.countTime = '-';
        this.isCount = true;
        this.loadCountTime = false;
      }
    },
    async getUserValut(){//获取用户抵押信息
      const account  = this.$store.state.app.account;
      let params = {
        lower_bound:account.name,
        upper_bound:account.name,
        code:'hbgdefistake',
        scope:'hbgdefistake',
        table:'stakes',
        json:true
      };
      let res = await EosTool.getTableRows(params);
      // 17750010665
      if(res.length >  0){
        this.mortgageMes = res[0];
        const endTime = toLocalTime(new Date(this.mortgageMes.release_time).getTime());
        this.$set(this.mortgageMes,'end_time',endTime)
      }else{
        this.mortgageMes = {
          staked:0,
          end_time:'-',
          refunding:0,
        }
      }
    },
    setOpenre(){
      this.setValue = parseFloat(this.userBalance).toFixed(6);
    },
    async setValut(){//存款调起
      this.$ins.open();
      const account = this.$store.state.app.account;
      let userLanceNum = parseFloat(this.userBalance)
      if(this.setValue >  0){
        if(Number(this.setValue).toFixed(6) >  userLanceNum){
          this.$toast(this.$t('valut.unbalance'))
          this.$ins.close();
        }else{
          let setHBG = Number(this.setValue).toFixed(6)+' HBG';
          const actions = [{
            account:'hbgdefistake',
            name:'stake',
            authorization:[{
              actor:account.name,
              permission:account.authority || "active"
            }],
            data:{
              owner:account.name,
              quantity:setHBG
            }
          }];
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
          this.$toast(this.$t('valut.setSuccess'));
          this.getUserValut();
          this.getUserBalance();
          setTimeout(() => {
            this.getTalent()
          },2000)
          this.$refs.openRe.closePopup();
          setTimeout(() => {
            this.$ins.close();
          },1000)
        }
      }else {
        setTimeout(() => {
          this.$ins.close();
        },1000)
        this.$toast(this.$t('valut.errorNo'))
      }
    },
    async getValut(){//取回存款调起
      this.$ins.open();
      const account = this.$store.state.app.account;
      let userLanceNum = this.mortgageMes.staked / 1000000;
      if(Number(this.getBackValue) >  0){
        if(Number(this.getBackValue).toFixed(6) >  userLanceNum){
          this.$toast(this.$t('valut.unbalance'))
          setTimeout(() => {
            this.$ins.close();
          },1000)
        }else{
          let getHBG = Number(this.getBackValue).toFixed(6)+' HBG';
          const actions = [{
            account:'hbgdefistake',
            name:'unstake',
            authorization:[{
              actor:account.name,
              permission:account.authority || "active"
            }],
            data:{
              owner:account.name,
              quantity:getHBG
            }
          }];
          const result = await EosTool.transact(actions);
          if(!result.transaction_id){
            //错误
            const res = EosTool.handleScatterError(result);
            this.$toast(res.type === "lang" ? this.$t(res.text) : res.text);
            setTimeout(() => {
              this.$ins.close();
            },1000)
            return;
          }
          this.$toast(this.$t('valut.backsuccess'));
          setTimeout(() => {
            this.getUserValut();
            this.count = 0;
            this.seconds = 0;
          },5000)
          setTimeout(()=>{
            this.getUserBalance()
            this.getTalent();
          },6000)
          this.$refs.openRe.closePopup()
          setTimeout(() => {
            this.$ins.close();
          },1000)
        }
      }else{
        setTimeout(() => {
          this.$ins.close();
        },1000)
        this.$toast(this.$t('valut.errorNo'))
      }
    },
    async getProfit(){//计算待领取收益
      const account = this.$store.state.app.account;
      // if(this.mortgageMes.staked! = 0){
        //时长计算
        let params = {
          lower_bound:account.name,
          upper_bound:account.name,
          code:'hbgdefivault',
          scope:'hbgdefivault',
          table:'rewards',
          json:true
        };
        let duration = 0;//时长
        let update_time = 0;
        let unget = 0;//未领取数量
        let userMor = (this.mortgageMes.staked / 1000000).toFixed(6);//用户抵押HBG数量
        let allMor = 0;//总抵押HBG
        let res = await EosTool.getTableRows(params);
        if(res.length >  0){
          update_time = res[0].update_time;
          unget = res[0].unclaimed
        }
        duration = (new Date().getTime() / 1000).toFixed(0) - update_time;
        let paramsTwo = {
          code:'hbgdefistake',
          scope:'hbgdefistake',
          table:'stat',
          json:true
        };
        let resWto = await EosTool.getTableRows(paramsTwo);
        if(resWto.length >  0){
          allMor = resWto[0].staked / 1000000;
          this.allMor = resWto[0].staked / 1000000+' HBG'
        }
        //待领取数量 = 未领取数量(hbgdefivault.rewards表中的unclaimed) + hbgdefivault的hbg余额 * hbg抵押数量(hbgdefistake.stakes表) / hbg总抵押数量 * 时长 / 86400
        let yeardisVal = parseFloat(this.secdisVal) * 86400 *365;
        this.ann = (yeardisVal / parseFloat(this.allMor) * 100).toFixed(2) + '%';
        this.unclaimedGet = (unget / 1000000 + parseFloat(this.allStock) * userMor / allMor * duration / 86400).toFixed(6) + ' HBG';
      // }
      // else{
      //   this.unclaimedGet = 0+' HBG'
      // }
    },
    async getAllMor(){//领取收益
      Indicator.open()
      const account = this.$store.state.app.account;
      const actions = [{
        account:'hbgdefivault',
        name:'claim',
        authorization:[{
          actor:account.name,
          permission:account.authority || "active"
        }],
        data:{
          owner:account.name,
        }
      }];
      const result = await EosTool.transact(actions)
      if(!result.transaction_id){
        //错误
        const res = EosTool.handleScatterError(result);
        this.$toast(res.type === "lang" ? this.$t(res.text) : res.text);
        setTimeout(() => {
          this.$ins.close();
        },1000)
        return;
      }
      setTimeout(() => {
        this.$ins.close();
      },1000)
      this.$toast(this.$t('valut.receive')+this.$t('valut.success'));
      setTimeout(() => {
        this.getProfit();
        this.getUserBalance();
      },2000)
    },
    async getTalent(){//获取HBG达人
      let claim = {
        code:'hbgdefivault',
        scope:'hbgdefivault',
        table:'rewards',
        limit:500,
        json:true
      }
      let params = {
        code:'hbgdefistake',
        scope:'hbgdefistake',
        table:'stakes',
        limit:500,
        json:true
      };
      let res = await EosTool.getTableRows(params);
      let cla = await EosTool.getTableRows(claim);
      for (const resRow of res) {
        for (const claRow of cla) {
          if (resRow.owner == claRow.owner) {
            resRow.claimed = claRow.claimed;
            resRow.unclaimed = claRow.unclaimed;
            resRow.update_time = claRow.update_time;
            break;
          }
        }
      }
      res.forEach(get => {
        this.$set(get,'unclaimedBack',(get.unclaimed / 1000000 + parseFloat(this.allStock) * (get.staked / 1000000).toFixed(6) / parseFloat(this.allMor) * ((new Date().getTime() / 1000).toFixed(0)-get.update_time) / 86400).toFixed(6) + ' HBG')
        this.$set(get,'unclaimedBackNumber',Number((get.unclaimed / 1000000 + parseFloat(this.allStock) * (get.staked / 1000000).toFixed(6) / parseFloat(this.allMor) * ((new Date().getTime() / 1000).toFixed(0)-get.update_time) / 86400).toFixed(6)))
        this.$set(get,'re_time',toLocalTime(get.release_time));
        this.$set(get,'backStaked',(get.staked / 1000000).toFixed(6)+' HBG');
      });
      this.elseList=res.sort((x,y) => y.staked-x.staked);
      this.allTalent=res.length;
      this.elseList=this.elseList.splice(0,10)
    },
    async reNow(){//领取质押HBG
      const account = this.$store.state.app.account;
      this.$ins.open()
      const actions = [{
        account:'hbgdefistake',
        name:'release',
        authorization:[{
          actor:account.name,
          permission:account.authority || "active"
        }],
        data:{
          owner:account.name,
        }
      }];
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
      setTimeout(() => {
        this.getUserValut()
        this.getUserBalance();
      },2000)
      setTimeout(() => {
        this.$ins.close();
      },1000)
    },
    backPage(){//返回
      this.$router.push('/swap')
    }
  }
}
</script>

<style lang="scss" scoped>
.valutIndex{
  width: 100%;
  height: 100%;
  z-index: 100;
  .bannerBg{
    width: 100%;
    height: 5rem;
    z-index: 99;
    background: url('../../../assets/images/valutBg.png');
    background-size: 100% 100%;
    box-sizing: border-box;
    .backIcon{
      margin-left:.4rem;
      margin-top:.2rem;
    }
  }
  .valutCon{
    width: 95%;
    margin:0 auto;
    margin-top: -.7rem;
    z-index: 1000;
    padding-bottom: .3rem;
    .selfMes{
      width: 100%;
      li{
        border-radius: 20px;
        box-shadow: 0px 0px 40px #ddd;
        background: white;
        margin-top: .4rem;
        padding: .5rem .34rem;
        font-size: .4rem;
      }
      li:first-child{
        margin-top:0;
        display: flex;
        flex-wrap: wrap;
        p{
          width: 50%;
          display: flex;
          flex-direction: column;
          margin-bottom: .2rem;
          font-size: .4rem;
          color:#999;
          span{
            color:black;
          };
        }
        p:nth-child(3),p:nth-child(4){
          margin-bottom: 0;
        }

      }
      li:nth-child(2){
        display: flex;
        p{
          width: 50%;
          font-size: .4rem;
          color:#999;
          position: relative;
          span{
            display: inline-block;
            margin-top: .1rem;
            color:black;
          }
          img{
            width: .34rem;
            height: .34rem;
            position: absolute;
            right: 0;
            top:.1rem;
            left:2.2rem;
          }
        }
        p:last-child{
          text-align: right;
          button{
            width: 2.6rem;
            line-height: .9rem;
            margin-top: .2rem;
            border-radius: 100px;
            color:white;
            background-image: linear-gradient(to right, #FFBD53 , #FFA300);
          }
        }
      }
      li:last-child{
        p{
          display: flex;
          flex-direction: column;
          color:#999;
          span{
            color:black;
          }
        }
        p:nth-child(2){
          margin-top: .3rem;
        }
        .releaseOutTime{
          color:#FFA300;
          position: relative;
          margin-top: .2rem;
          font-size: .4rem;
          span{
            position: absolute;
            right:.2rem;
            color:#FFA300;
          }
        }
        p:last-child{
          flex-direction: row;
          justify-content: space-around;
          margin-top: .4rem;
          button{
            width: 45%;
            line-height: .9rem;
            border-radius: 100px;
          }
          button:first-child{
            color:#9A3100;
            box-sizing: border-box;
            line-height: .8rem;
            border:2px solid #9A3100;
            background: white;
          }
          button:last-child{
            background-image: linear-gradient(to right, #FFBD53 , #FFA300);
            color:white;
          }
        }
      }
    }
    .conTitle{
      width: 98%;
      margin:0 auto;
      font-size: .5rem;
      line-height: 1.6rem;
      position: relative;
      span{
        font-size: .38rem;
        line-height: 1.6rem;
        position: absolute;
        right:0;
        top:50%;
        margin-top: -.8rem;
      }
    }
    .elseOne{
      width: 100%;
      li{
        .eldetails{
          border-radius: 20px;
          background: white;
          padding: .5rem .34rem;
          font-size: .4rem;
          margin-bottom: .4rem;
          box-shadow: 0px 0px 40px #ddd;
          .getMes{
            border-bottom: 1px solid rgba(0,0,0,.1);
            padding-bottom: .2rem;
            p{
              display: flex;
              justify-content: space-between;
              font-size: .5rem;
              font-weight: 400;
            }
            p:last-child{
              color:#999;
              font-weight: normal;
              font-size: .36rem;
              line-height: .7rem;
            }
          }
          .setMes{
            display: flex;
            margin-top: .3rem;
            p{
              width: 50%;
              display: flex;
              flex-direction: column;
              font-size: .36rem;
              color:#999;
              line-height: .6rem;
              span{
                font-size: .44rem;
                color:black;
              }
            }
          }
        }
      }
    }
  }
  .retrieveBox{
    width: 90%;
    margin:0 auto;
    .writeBox{
      width: 100%;
      padding: .3rem .2rem .4rem;
      box-sizing: border-box;
      background: #f5f5f5;
      border-radius: 15px;
      p:first-child{
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: .36rem;
      }
      .write{
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: .4rem;
        p{
          width: 40%;
        }
        p:first-child{
          display: flex;
          flex-direction: column;
          position: relative;
          box-sizing: border-box;
          padding-left: 1rem;
          text-align: left;
          font-size: .26rem;
          justify-content: space-between;
          span:nth-child(2){
            font-size: .4rem;
          }
          span:nth-child(3){
            color:#999;
            margin-top: .1rem;
          }
          img{
            width: .88rem;
            height: .88rem;
            border-radius: 50%;
            position: absolute;
            left:0;
            top:-.05rem;
          }
        }
        p:last-child{
          box-sizing: border-box;
          height: .8rem;
          input{
            width: 100%;
            background: #f5f5f5;
            border-bottom:1px solid #ccc;
            text-align: right;
            line-height: .7rem;
            font-size: .4rem;
          }
        }
      }
      .valutRemark{
        text-align: left;
        margin-top:.3rem;
        font-size: .3rem;
        color:#666;
      }
    }
    .depDate{
      width: 100%;
      margin-top: .4rem;
      display: flex;
      font-size: .36rem;
      color:#333;
      justify-content: space-between;
    }
    .endTime{
      color:#333;
      font-size: .36rem;
      line-height: 1rem;
    }
    .btnType2{
      width: 100%;
      margin-top: .3rem;
      padding-bottom: .2rem;
      button{
        width: 80%;
        line-height: 1rem;
        font-size: .4rem;
        border-radius: 100px;
        background-image: linear-gradient(to right, #FFBD53 , #FFA300);
        color:white;
      }
    }
  }
  .chooseDate{
    width: 80%;
    margin:0 auto;
    display: flex;
    justify-content: space-between;
    line-height: 1rem;
    font-size: .4rem;
    span:first-child{
      color:#666;
    }
    span:last-child{
      color:#FFA300;
    }
  }
}
</style>
