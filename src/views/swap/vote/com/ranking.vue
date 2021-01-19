<!-- 排名 -->
<template lang="html">
  <div class="rankingList">
    <Search :serList="voteList" @filList="getFliList"/>
    <ul class="ranList">
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
          <span class="ranDe" @click="voteDetails(indexV)">{{$t('vote.details')}}></span>
        </p>
        <span class="num">
          <img :src="vote.img" alt="" v-if="vote.img">
          <span v-else class="unImg">{{indexV+1}}</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import Search from './search'
import { coinUrl } from '@/utils/common'

export default {
  name:'Ranking',
  components:{Search},
  data(){
    return{
      test:require('@/assets/images/test.png'),
      icon:require('@/assets/images/voteIcon_2.png'),
      voteList:[],
      pairs:JSON.parse(window.localStorage.getItem('votePairs')),
    }
  },
  created(){
    this.voteList = this.pairs.sort(function(a,b){
      return b.nowVotes - a.nowVotes
    });
    this.$set(this.voteList[0],'img',require('@/assets/images/champion.png'))
    this.$set(this.voteList[1],'img',require('@/assets/images/runner.png'))
    this.$set(this.voteList[2],'img',require('@/assets/images/second.png'))
  },
  methods:{
    url(contract, coin) {
      return coinUrl(contract, coin);
    },
    async getFliList(val){//获取筛选数据
      this.voteList = val.sort((a,b) => {
        return b.nowVotes - a.nowVotes
      });
    },
    voteDetails(index){//投票详情
      this.$router.push({
        path:'/voteDetails',
        query:{
          act:1
        }
      });
      window.localStorage.setItem('voteDetails',JSON.stringify(this.voteList[index]))
    }
  }
}
</script>

<style lang="scss" scoped>
.rankingList{
  width: 100%;
  position: relative;
  padding-top: .4rem;
  padding-bottom: .5rem;
  .ranList{
    li{
      position: relative;
      font-size: .4rem;
      padding-top: .3rem;
      border: 1px solid #EAEAEA;
      box-sizing: border-box;
      padding:.4rem .5rem .2rem 1.6rem;
      margin-top: .3rem;
      border-radius: 20px;
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
        line-height: 1rem;
        padding-left: .7rem;
        position: relative;
        img{
          width: .6rem;
          height: .6rem;
          position: absolute;
          left:0;
          top:.2rem;
        }
        .ranDe{
          color:#FFA300;
          position: absolute;
          right:0;
          top:50%;
          margin-top: -.95rem;
        }
      }
      .num{
        position: absolute;
        left:.3rem;
        top:50%;
        margin-top: -.6rem;
        img{
          width: 1rem;
          height: 1.2rem;
        }
        .unImg{
          font-size: .6rem;
          position: absolute;
          top:.2rem;
          left:.3rem;
        }
      }
    }
    li:first-child{
      border: 1px solid #FFC867;
      box-shadow: 0px 3px 6px rgba(255, 189, 83, 0.5);
    }
    li:nth-child(2){
      box-shadow: 0px 3px 6px rgba(156, 168, 177, 0.5);
      border: 1px solid #9CA8B1;
    }
    li:nth-child(3){
      box-shadow: 0px 3px 6px rgba(223, 127, 100, 0.5);
      border: 1px solid rgba(245, 179, 146, 0.5);
    }
  }
}
</style>
