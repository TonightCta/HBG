<!-- 已投列表 -->
<template lang="html">
  <div class="investedList">
    <Search :serList="voteList" @filList="getFliList"/>
    <ul class="insList" v-if="isVote">
      <li v-for="(vote,indexV) in voteList" :key="indexV">
        <p>
          <img :src="url(vote.token0.contract, vote.token0.coin)" onerror="this.src='/static/images/eos.png'" alt />
          {{vote.token0.coin}}
          <img :src="url(vote.token1.contract, vote.token1.coin)" onerror="this.src='/static/images/eos.png'" alt />
          <span>{{vote.token1.coin}}</span>
        </p>
        <p>
          <img :src="icon" alt="">
          <span>{{vote.nowVotes}}&nbsp;(&nbsp;{{vote.votePro}}&nbsp;%)</span>
          <span class="invDe" @click="voteDetails(indexV)">{{$t('vote.details')}}></span>
        </p>
        <span class="hasVote">
          <img :src="choose" alt="" v-if="vote.isVote" @click="cancelPair(indexV)">
          <img :src="unchoose" alt="" v-else @click="choosePair(indexV)">
        </span>
      </li>
    </ul>
    <p v-else class="nomore">{{$t('public.noMore')}}</p>
    <Table :hasVoteList="turnVoteList"></Table>
  </div>
</template>

<script>
import Search from './search'
import EosTool from '@/utils/eostool'
import Table from './fooTable'
import { coinUrl } from '@/utils/common'

export default {
  name:'Invested',
  components:{Search,Table},
  data(){
    return{
      closeIcon:require('@/assets/images/closeIconUn.png'),
      icon:require('@/assets/images/voteIcon_2.png'),
      choose:require('@/assets/images/choose.png'),
      unchoose:require('@/assets/images/unchoose.png'),
      voteList:[],
      pairs:JSON.parse(window.localStorage.getItem('votePairs')),
      isVote:false,//是否有数组
      turnVoteList:[],//选中币种ID
    }
  },
  created(){
    this.getMyVote()
  },
  watch:{
    voteList(val,oldVal){
      if(val.length > 0){
        this.isVote = true;
      }else{
        this.isVote = false;
      }
    }
  },
  methods:{
    url(contract, coin) {
      return coinUrl(contract, coin);
    },
    async getMyVote(){//获取我的投票
      const account =this.$store.state.app.account;
      const params={
        lower_bound:account.name,
        upper_bound:account.name,
        code:'hbgdefivotes',
        scope:'hbgdefivotes',
        table:'votes',
        json:true
      };
      const result=await EosTool.getTableRows(params);
      this.pairs.forEach(e => {
        if(result[0]){
          if(e.pairId == result[0].pool_id1 || e.pairId == result[0].pool_id2 || e.pairId == result[0].pool_id3){
            this.voteList.push(e)
          }
        }
      });
      this.voteList.forEach(e => {
        this.turnVoteList.push(e.pairId)
      })
    },
    async getFliList(val){//获取筛选数据
      this.voteList = val;
    },
    async choosePair(index){//选中组合
      if(this.turnVoteList.length < 3){
        this.voteList[index].isVote = true;
        this.turnVoteList.push(this.voteList[index].pairId)
      }else{
        this.$toast(this.$t('vote.max'))
      }
    },
    async cancelPair(index){//取消选中
      this.voteList[index].isVote = false;
      this.turnVoteList.splice(this.turnVoteList.indexOf(this.voteList[index].pairId),1);
    },
    voteDetails(index){//投票详情
      this.$router.push({
        path:'/voteDetails',
        query:{
          act:2
        }
      });
      window.localStorage.setItem('voteDetails',JSON.stringify(this.voteList[index]))
    },
    getHasVote(val){
      let lastVote=[];
      for(let i in this.voteList){
        for(let x in val){
          if(this.voteList[i].pairId == val[x]){
            lastVote.push(this.voteList[i])
          }
        }
      }
      this.voteList = lastVote;
    }
    // cancelVote(index){
    //   // console.log(this.voteList[index]);
    //   const account=this.$store.state.app.account;
    //   const actions=[{
    //     account:'hbgdefivotes',
    //     name:'vote',
    //     authorization:[{
    //       actor:account.name,
    //       permission:account.authority || "active"
    //     }],
    //     data:data
    //   }];
    // },
  }
}
</script>

<style lang="scss" scoped>
.investedList{
  width: 100%;
  position: relative;
  padding-top: .4rem;
  .insList{
    li{
      position: relative;
      font-size: .4rem;
      border-bottom: 1px solid rgba(0,0,0,.1);
      padding-top: .3rem;
      p:first-child{
        position: relative;
        padding-left: 1.1rem;
        line-height: 1rem;
        img{
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          border:0;
          position: absolute;
          left:0;
        }
        img:nth-child(2){
          left:2.6rem;
        }
        span{
          margin-left: 1.7rem;
        }
      }
      p:nth-child(2){
        position: relative;
        line-height: 1.4rem;
        padding-left: .7rem;
        img{
          width: .6rem;
          height: .6rem;
          position: absolute;
          left:0;
          top:.4rem;
        }
        .invDe{
          color:#FFA300;
          margin-left: .2rem;
        }
      }
      .hasVote{
        position: absolute;
        right:0;
        top:.7rem;
        img{
          width: 1.2rem;
          height:1.2rem;
        }
      }
    }
  }
  .nomore{
    width: 100%;
    line-height: 1.5rem;
    font-size: .4rem;
    color:#666;
    text-align: center;
  }
}
</style>
