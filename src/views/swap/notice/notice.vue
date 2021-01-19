<!-- 公告中心 -->
<template lang="html">
  <div class="noticeCen">
    <p v-if="isHasData" class="noData">
      <svg-icon :color="$store.state.app.themeColor" :icon="'icon-empty'" :size="90" />
      <br>
      <span>{{$t('public.noMore')}}</span>
    </p>
    <mt-loadmore v-else :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
      <ul class="notMes">
        <li v-for="(notice,indexNo) in notList" :key="indexNo" @click="goDetails(indexNo)">
          <p>{{notice.title}}</p>
          <p>{{notice.content.substring(0,20)}}...</p>
          <p>{{notice.create_time.substring(0,10)}}</p>
        </li>
      </ul>
  </mt-loadmore>
  </div>
</template>

<script>
import {announcement} from '@/api/common'
import { Indicator } from 'mint-ui';
export default {
  name:'Notice',
  data(){
    return{
      notList:[],
      allLoaded:false,//加载
      params:{//请求参数
        pageSize:10,
        currPage:1
      },
      isHasData:false
    }
  },
  watch:{
    notList(val,oldVal){
      if(val.length>=1){
        this.isHasData=false;
      }else{
        this.isHasData=true;
      }
    }
  },
  created(){
    this.getNoticeData()
  },
  methods:{
    goDetails(index){//跳转详情
      this.$router.push({
        name:'NoticeDetails',
        params:{
          notDe:this.notList[index]
        }
      })
    },
    loadTop() {//从新加载
      this.$refs.loadmore.onTopLoaded();
      this.getNoticeData()
    },
    loadBottom() {//加载更多
      this.allLoaded = true;// 若数据已全部获取完毕
      this.$refs.loadmore.onBottomLoaded();
      // this.params.currPage=Number(this.params.pageSize)+10;
      // this.getNoticeData();
    },
    async getNoticeData(){
      Indicator.open();
      const res=await announcement(this.params);
      if(res.data)
        Indicator.close();
      this.notList=res.data;
    }
  }
}
</script>

<style lang="scss" scoped>
.noticeCen{
  width: 100%;
  margin-top:.2rem;
  padding-bottom: 1rem;
  .noData{
    width: 100%;
    text-align: center;
    font-size: .5rem;
    padding-top: 1rem;
    span{
      font-size: .4rem;
      color:#999;
    }
  }
  .notMes{
    width: 100%;
    padding-bottom: 2rem;
    li{
      line-height: .5rem;
      box-sizing: border-box;
      padding: .2rem;
      border-radius: 10px;
      box-shadow: 0px 2px 15px #ccc;
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 24px;
      color: #333333;
      width: 95%;
      margin:0 auto;
      margin-top: .3rem;
      p:first-child{
        line-height: 60px;
        font-size: 32px;
        font-weight: bold;
      }
      p:last-child{
        text-align: right;
        color:#999;
      }
    }
  }
}
</style>
