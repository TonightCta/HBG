<!-- 投票详情 -->
<template lang="html">
  <div class="voteDetails">
    <!-- 币种 -->
    <div class="currency w95">
      <p>
        <img :src="url(voteDetails.token0.contract, voteDetails.token0.coin)" onerror="this.src='/static/images/eos.png'" alt />
        <span>{{voteDetails.token0.coin}}</span>
        <span>{{voteDetails.token0.tokenId.slice(0,voteDetails.token1.tokenId.length-5)}}</span>
      </p>
      <p>+</p>
      <p>
        <img :src="url(voteDetails.token1.contract, voteDetails.token1.coin)" onerror="this.src='/static/images/eos.png'" alt />
        <span>{{voteDetails.token1.coin}}</span>
        <span>{{voteDetails.token1.tokenId.slice(0,voteDetails.token1.tokenId.length-5)}}</span>
      </p>
    </div>
    <!-- 总共票数 -->
    <div class="allVote w95">
      <p>{{voteDetails.nowVotes}}</p>
      <p>{{$t('vote.allV')}}</p>
    </div>
    <div class="voteMask"></div>
    <!-- 投票列表 -->
    <div class="detailsList w95">
      <p class="listTitle">
        {{$t('vote.listV')}}
        <span>{{$t('vote.allP')}}:{{panelList.length}}</span>
      </p>
      <ul  v-if="isHasData">
        <li v-for="(voteDe,indexVD) in panelList" :key="indexVD">
          <p>
            <span>{{voteDe.owner}}</span>
            <span class="grey">2020.11.10 09:11:52</span>
          </p>
          <p>
            <span>{{voteDe.votes}}</span>
            <span class="grey">{{$t('vote.voteN')}}</span>
          </p>
        </li>
      </ul>
      <p v-else class="noMoreData">{{$t('public.noMore')}}</p>
    </div>
  </div>
</template>

<script>
import EosTool from '@/utils/eostool'
import {coinUrl} from '@/utils/common'

export default {
  name:'VoteDetails',
  data(){
    return{
      test:require('@/assets/images/test.png'),
      panelList:[],
      voteDetails:JSON.parse(window.localStorage.getItem('voteDetails')),
      isHasData:false,//是否有数据
    }
  },
  watch:{
    panelList(val,oldVal){
      if(val.length > 0){
        this.isHasData = true;
      }else{
        this.isHasData=false;
      }
    }
  },
  created(){
    this.getVotepan();
    window.sessionStorage.setItem('acTable',this.$route.query.act);
  },
  methods:{
    url(contract, coin) {
      return coinUrl(contract, coin);
    },
    async getVotepan(){//获取投票人列表
      const params={
        code:'hbgdefivotes',
        scope:'hbgdefivotes',
        table:'votes',
        limit:500,
        json:true
      };
      const result = await EosTool.getTableRows(params);
      result.forEach(e => {
        if(e.pool_id1 == this.voteDetails.pairId || e.pool_id2 == this.voteDetails.pairId || e.pool_id3 == this.voteDetails.pairId){
          this.panelList.push(e)
        }
      })
    }
  },
  beforeDestroy(){
    window.localStorage.removeItem('voteDetails')
  }
}
</script>

<style lang="scss" scoped>
.voteDetails{
  width: 100%;
  .w95{
    width: 95%;
    margin:0 auto;
  }
  .currency{
    display: flex;
    // padding-left: .9rem;
    justify-content: space-around;
    height: 2rem;
    box-sizing: border-box;
    padding-top: .2rem;
    border-radius: 15px;
    background: #f5f5f5;
    margin-top: .4rem;
    // padding-top: .3rem;
    p{
      position: relative;
      display: flex;
      flex-direction: column;
      padding-left: 1.6rem;
      box-sizing: border-box;
      width: 40%;
      text-align: left;
      padding-top: .3rem;
      img{
        position: absolute;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        left:.4rem;
        top:.32rem;
      }
      span:nth-child(2){
        font-size: .5rem;
      }
      span:last-child{
        color:#999;
      }
    }
    p:nth-child(2){
      line-height: 1.5rem;
      font-size: .7rem;
      text-align: center;
      width: 5%;
      padding-left: 0;
      padding: 0;
    }
  }
  .allVote{
    text-align: center;
    margin-top: .6rem;
    p:first-child{
      font-size: .9rem;
      font-weight: 500;
      line-height: 1.2rem;
    }
    p:last-child{
      font-size: .5rem;
    }
  }
  .voteMask{
    width: 100%;
    height: .3rem;
    background: #f5f5f5;
    margin-top: .4rem;
  }
  .detailsList{
    margin-top: .4rem;
    .listTitle{
      font-size: .6rem;
      font-weight: 500;
      position: relative;
      span{
        font-size: .4rem;
        font-weight: normal;
        position: absolute;
        right:0;
        top:.05rem;
      }
    }
    ul{
      margin-top: .1rem;
      li{
        padding-top: .3rem;
        border-bottom: 1px solid rgba(0,0,0,.1);
        display: flex;
        justify-content: space-between;
        padding-bottom: .2rem;
        p{
          line-height: .8rem;
          display: flex;
          flex-direction: column;
          font-size: .4rem;
          .grey{
            color:#999;
          }
        }
        p:last-child{
          text-align: right;
        }
      }
    }
    .noMoreData{
      width: 100%;
      line-height: 1rem;
      font-size: .4rem;
      text-align: center;
      color:#666;
      margin-top:.6rem;
    }
  }
}
</style>
