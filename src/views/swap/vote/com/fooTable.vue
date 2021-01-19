<!-- 投票底栏 -->
<template lang="html">
  <div class="goVote">
    <span>{{$t('vote.choose')}}&nbsp;{{hasVoteList.length}}/3</span>
    <button type="button" name="button" @click="toVote()">{{$t('vote.govote')}}</button>
  </div>
</template>

<script>
import EosTool from '@/utils/eostool'
export default {
  name:'FooTable',
  props:{
    hasVoteList:Array
  },
  methods:{
    async toVote(){//发起投票
      // if(this.hasVoteList.length>=1){
      this.$ins.open()
      const account = this.$store.state.app.account;
      let data = {};
      switch (this.hasVoteList.length) {
        case 0:
        data = {
          owner:account.name,
          pool_id1:0,
          pool_id2:0,
          pool_id3:0,
        }
        break
        case 1:
        data = {
          owner:account.name,
          pool_id1:this.hasVoteList[0],
          pool_id2:0,
          pool_id3:0,
        }
        break;
        case 2:
        data = {
          owner:account.name,
          pool_id1:this.hasVoteList[0],
          pool_id2:this.hasVoteList[1],
          pool_id3:0,
        }
        break;
        case 3:
        data = {
          owner:account.name,
          pool_id1:this.hasVoteList[0],
          pool_id2:this.hasVoteList[1],
          pool_id3:this.hasVoteList[2],
        }
        break;
        default:
      }
      let actions=[{
        account:'hbgdefivotes',
        name:'vote',
        authorization:[{
          actor:account.name,
          permission:account.authority || "active"
        }],
        data:data
      }];
      let result=await EosTool.transact(actions);
      if(!result.transaction_id){
        //错误
        const res = EosTool.handleScatterError(result);
        this.$toast(res.type === "lang" ? this.$t(res.text) : res.text);
        this.$ins.close()
        return;
      }
      this.$toast(this.$t('toastTip.success'));
      setTimeout(() => {
        this.$parent.getHasVote(this.hasVoteList);
      },1500)
      this.$ins.close()
      // }else{
      //   this.$toast(this.$t('vote.fronterror'))
      // }
    },
  }
}
</script>

<style lang="scss" scoped>
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
</style>
