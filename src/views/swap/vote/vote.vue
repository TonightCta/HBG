<!-- 投票 -->
<template lang="html">
  <div class="voteIndex">
    <!-- 投票 -->
    <p class="voteTitle w95">
      <svg-icon :icon="'icon-back'" @click.native="backPage" :size="35" color="black" svgClass="backIcon"/>
      {{$t('vote.votetext')}}
      <span>
        {{$t('vote.rule')}}
        <img :src="howIcon" alt="" @click="openRule">
      </span>
    </p>
    <!-- 您的票数 -->
    <div class="youNum w95">
      <p>{{mortgageMes}}</p>
      <p>{{$t('vote.selfnum')}}</p>
      <p>
        <router-link to="/valut" tag="button" @click.native="changeTab(0)">{{$t('vote.irrigation')}}</router-link>
      </p>
    </div>
    <p class="indexMask"></p>
    <!-- table -->
    <div class="tableNow">
      <ul>
        <router-link to="/vote/voteList" tag="li" @click.native="changeTab(0)" :class="{onTab:acTable==0}">
          {{$t('vote.votetext')}}
        </router-link>
        <router-link to="/vote/ranking" tag="li" @click.native="changeTab(1)" :class="{onTab:acTable==1}">
          {{$t('vote.rand')}}
        </router-link>
        <router-link to="/vote/invested" tag="li" @click.native="changeTab(2)" :class="{onTab:acTable==2}">
          {{$t('vote.invested')}}
        </router-link>
      </ul>
    </div>
    <div class="w95">
      <router-view></router-view>
    </div>
    <Popup :width="85" :title="this.$t('vote.rule')" :withBtn='false' ref="openRe" v-if="depBox">
      <div class="voteRemark">
        <!-- 投票规则 -->
        <p>1.{{$t('vote.rules.one')}}</p>
        <p>2.{{$t('vote.rules.two')}}</p>
        <p>3.{{$t('vote.rules.three')}}</p>
        <p>4.{{$t('vote.rules.four')}}</p>
        <p>5.{{$t('vote.rules.five')}}</p>
      </div>
    </Popup>
  </div>
</template>

<script>
import EosTool from "@/utils/eostool";
import Popup from '@/views/swap/components/popup'
export default {
  name:'Vote',
  data(){
    return{
      howIcon:require('@/assets/images/howIcon.png'),
      acTable:0,
      mortgageMes:0,//用户抵押HBG数量
      depBox:false,
    }
  },
  components:{Popup},
  created(){
    this.getUserValut();
    if(window.sessionStorage.getItem('acTable')){
      if(this.$route.name === 'VoteList'){
        this.acTable = 0;
      }else{
        this.acTable = window.sessionStorage.getItem('acTable');
      }
    }
  },
  methods:{
    //切换table
    async changeTab(n){
      this.acTable = n;
    },
    async getUserValut(){//获取用户抵押信息
      this.$ins.open()
      const account = this.$store.state.app.account;
      let params = {
        lower_bound:account.name,
        upper_bound:account.name,
        code:'hbgdefistake',
        scope:'hbgdefistake',
        table:'stakes',
        json:true
      };
      let res = await EosTool.getTableRows(params);
      if(res.length > 0){
        this.mortgageMes = Math.floor(res[0].staked / 1000000);
      }else{
        this.mortgageMes = 0
      }
      setTimeout(() => {
        this.$ins.close()
      },500)
    },
    openRule(){//规则
      this.depBox = true;
      setTimeout(() => {
        this.$refs.openRe.openRe(true)
      },100)
    },
    backPage(){//返回
      this.$router.push('/swap')
    }
  },
}
</script>

<style lang="scss" scoped>
.voteIndex{
  width: 100%;
  .w95{
    width: 95%;
    margin:0 auto;
  }
  .voteTitle{
    font-size: .7rem;
    line-height: 2rem;
    height: 2rem;
    text-align: center;
    position: relative;
    .backIcon{
      position: absolute;
      top:50%;
      margin-top: -.175rem;
      left:0;
    }
    span{
      font-size: .4rem;
      height: .4rem;
      color:#666;
      position: absolute;
      right:0;
      display: inline-block;
      top:.1rem;
      padding-right: .5rem;
      img{
        width: .4rem;
        height: .4rem;
        position: absolute;
        right:0;
        top:.8rem;
      }
    }
  }
  .youNum{
    text-align: center;
    margin-top: .2rem;
    p:first-child{
      font-size: .8rem;
      font-weight: 400;
    }
    p:nth-child(2){
      font-size: .5rem;
    }
    p:last-child{
      margin-top: .3rem;
      button{
        width: 3rem;
        height: 1rem;
        border-radius: 100px;
        background: white;
        color:white;
        background-image: linear-gradient(to right, #FFBD53 , #FFA300);
        font-size: .46rem;
        box-shadow: 0px 4px 20px rgba(255, 163, 0, 0.3);
      }
    }
  }
  .indexMask{
    width: 100%;
    height: .3rem;
    background: #f5f5f5;
    margin-top: .6rem;
  }

  .tableNow{
    margin-top: .4rem;
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
  .voteRemark{
    width: 100%;
    padding-bottom: .5rem;
    margin-top: -.3rem;
    p{
      width: 80%;
      margin:0 auto;
      text-align: left;
      line-height: 1rem;
      font-size: .4rem;
      letter-spacing: 1px;
    }
  }
}
</style>
