<!-- 投票列表 -->
<template lang="html">
  <div class="voteList">
    <Search :serList="loPairs" @filList="getFliList"/>
    <div class="listIndex">
      <ul>
        <li v-for="(vote,indexV) in loPairs" :key="indexV">
          <p>
            <img :src="url(vote.token0.contract, vote.token0.coin)" onerror="this.src='/static/images/eos.png'" alt />
            {{vote.token0.coin}}
            <img :src="url(vote.token1.contract, vote.token1.coin)" onerror="this.src='/static/images/eos.png'" alt />
            <span>{{vote.token1.coin}}</span>
          </p>
          <p>
            <img :src="icon" alt="">
            <span v-if="vote.nowVotes">{{vote.nowVotes}}</span>
            <span v-else>0</span>
            <span @click="voteDetails(indexV)" class="deText">{{$t('vote.details')}}></span>
          </p>
          <span class="hasVote">
            <img :src="choose" alt="" v-if="vote.isVote" @click="cancelPair(indexV)">
            <img :src="unchoose" alt="" v-else @click="choosePair(indexV)">
          </span>
        </li>
      </ul>
    </div>
    <!-- 去投票 -->
    <Table :hasVoteList="turnVoteList"></Table>
    <!-- <div class="goVote">
    <span>{{$t('vote.choose')}}&nbsp;{{turnVoteList.length}}/3</span>
    <button type="button" name="button" @click="toVote()">{{$t('vote.govote')}}</button>
  </div> -->
</div>
</template>

<script>
import Search from './search'
import Table from './fooTable'
import EosTool from "@/utils/eostool";
import {deepClone,coinUrl} from '@/utils/common'
export default {
  name:'VoteList',
  components:{Search,Table},
  data(){
    return{
      icon:require('@/assets/images/voteIcon_2.png'),
      choose:require('@/assets/images/choose.png'),
      unchoose:require('@/assets/images/unchoose.png'),
      test:require('@/assets/images/test.png'),
      turnVoteList:[],//选中币种ID
      pairs:JSON.parse(window.localStorage.getItem('pairs')),
      loPairs:[],
      allVotes:0,//总票数
    }
  },
  created(){
    for(let i in deepClone(this.pairs)){
      this.loPairs.push(deepClone(this.pairs)[i])
    }
    this.loPairs.forEach(e => {
      this.$set(e,'isVote',false)
    });
    this.getHasVote();
  },
  methods:{
    url(contract, coin) {
      return coinUrl(contract, coin);
    },
    async choosePair(index){//选中组合
      if(this.turnVoteList.length < 3){
        this.loPairs[index].isVote = true;
        this.turnVoteList.push(this.loPairs[index].pairId)
      }else{
        this.$toast(this.$t('vote.max'))
      }
    },
    async cancelPair(index){//取消选中
      this.loPairs[index].isVote=false;
      this.turnVoteList.splice(this.turnVoteList.indexOf(this.loPairs[index].pairId),1);
    },
    async getHasVote(){//获取投票信息
      const account = this.$store.state.app.account;
      const params = {
        code: "hbgdefivotes",
        scope: "hbgdefivotes",
        table: "pools",
        limit:500,
        json: true,
      }
      const userPar = {
        lower_bound:account.name,
        upper_bound:account.name,
        code: "hbgdefivotes",
        scope: "hbgdefivotes",
        table: "votes",
        json: true,
      }
      const result = await EosTool.getTableRows(params)
      const userVote = await EosTool.getTableRows(userPar)
      if(result.length > 0){
        let allVotes = 0;
        let tem = [];
        let temPairs = this.pairs;
        for(let y in result){
          allVotes = allVotes + result[y].votes;
          tem.push(allVotes);
          this.allVotes = tem[tem.length-1];
        }
        for(let x in temPairs){
          for(let i in result){
            if(temPairs[x].pairId == result[i].pool_id && result[i].votes != 0){
              this.$set(temPairs[x],'nowVotes',result[i].votes);
              this.$set(temPairs[x],'votePro',(temPairs[x].nowVotes / this.allVotes * 100).toFixed(2))
              break
            }else{
              this.$set(temPairs[x],'nowVotes',0);
              this.$set(temPairs[x],'votePro',0)
            }
          }
        }
        let userVo=[];
        if(userVote.length > 0){
          userVo.push(userVote[0].pool_id1,userVote[0].pool_id2,userVote[0].pool_id3);
          userVo.forEach(e => {
            if(e != 0 && this.turnVoteList.indexOf(e) == -1){
              this.turnVoteList.push(e)
            }
            for (let i in temPairs){
              if(temPairs[i].pairId == e){
                this.$set(temPairs[i],'isVote',true)
              }
            }
          });
        }
        this.loPairs = temPairs;
        setTimeout(() => {
          window.localStorage.setItem('votePairs',JSON.stringify(this.loPairs))
        },500)
      }else{
        return 0
      }
    },
    async getFliList(val){//获取筛选数据
      this.loPairs=val;
    },
    voteDetails(index){//投票详情
      this.$router.push({
        path:'/voteDetails',
        query:{
          act:0
        }
      });
      window.localStorage.setItem('voteDetails',JSON.stringify(this.loPairs[index]))
    },
  },
}
</script>

<style lang="scss" scoped>
.voteList{
  width: 100%;
  position: relative;
  .listIndex{
    width: 100%;
    padding-top: .4rem;
    padding-bottom: 1.4rem;
    ul{
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
            top:.38rem;
          }
          .deText{
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
      li:last-child{
        border:0;
      }
    }
  }
  .goVote{
    width: 100%;
    position: fixed;
    bottom:0;
    left:0;
    background: white;
    line-height: 1.6rem;
    box-shadow: 0px -10px 20px #eee;
    font-size: .4rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 .3rem;
    button{
      background: linear-gradient(90deg, #FFBD53 0%, #FFA300 100%);
      height: 1rem;
      margin-top: .3rem;
      width: 30%;
      border-radius: 100px;
      color:white;
      font-size: .4rem;
    }
  }
}
</style>
