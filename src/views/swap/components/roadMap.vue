<!-- 路线图 -->
<template lang="html">
  <div class="roadMap">
    <p class="roadTitle">{{$t('public.roadmap')}}</p>
    <div class="roadMes" v-if="langType=='zh-CN'">
      <ul>
        <li v-for="(road,indexR) in roadList" :key="indexR">
          <img :src="icon" alt="" class="icon">
          <span class="title">{{road.title}}<br/></span>
          <span class="text">{{road.text}}</span>
          <span class="line"></span>
        </li>
      </ul>
    </div>
    <div class="roadMes" v-else>
      <ul>
        <li v-for="(road,indexR) in enRoad" :key="indexR">
          <img :src="icon" alt="" class="icon">
          <span class="title entitle">{{road.title}}<br/></span>
          <span class="text entext">{{road.text}}</span>
          <span class="line"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name:'RoadMap',
  data(){
    return{
      icon:require('@/assets/images/roadIcon.png'),
      roadList:[
        {
          text:'USDB稳定币',
          title:'去中心化抵押型稳定币(MakerDao)'
        },
        {
          text:'稳定币兑换',
          title:'专注于稳定币互换的交易平台(Curve)'
        },
        {
          text:'ColaDex',
          title:'去中心化聚合交易平台'
        },
        {
          text:'预言机',
          title:'去中心化验证型预言机（NEST）'
        },
        {
          text:'HBG DAO',
          title:'开放投票权和提案权',
        },
      ],
      langType:this.$store.state.app.language,
      enRoad:[
        {
          text:'USDB-Stable currency',
          title:'Decentralized mortgage stable currency(MakerDao)'
        },
        {
          text:'Stable currency',
          title:'Focus on stable currency swap trading platform(Curve)'
        },
        {
          text:'ColaDex',
          title:'Decentralized aggregation trading platform'
        },
        {
          text:'Prophecy machine',
          title:'Decentralized verification Oracle（NEST）'
        },
        {
          text:'HBG DAO',
          title:'Open voting and proposal rights',
        },
      ]
    }
  },
  methods:{
    setLang(){
      this.langType = this.$store.state.app.language
    }
  }
}
</script>

<style lang="scss" scoped>
.roadMap{
  width: 90%;
  margin:0 auto;
  overflow:hidden;
  .roadTitle{
    font-size: .5rem;
    font-weight: bold;
  }
  .roadMes{
    width: 100%;
    margin-top: .6rem;
    ul{
      li{
        height: 1.6rem;
        position: relative;
        color:#9A3100;
        font-size: .2rem;
        img{
          position: absolute;
          left:50%;
          margin-left: -.25rem;
          width: .5rem;
          height: .5rem;
          z-index: 10;
        }
        .text{
          position: absolute;
          font-size: .4rem;
          width: 50%;
        }
        .title{
          display: inline-block;
          width: 100%;
          position: absolute;
          font-size: .34rem;
        }
        .line{
          display: inline-block;
          height: 1rem;
          border-right: .06rem dashed #FCEAD4;
          // border-right: .06rem dashed red;
          position: absolute;
          margin-left: -.03rem;
          left:50%;
          z-index: 1;
          bottom:.1rem;
        }
      }
      li:first-child{
        .text{
          left:55%;
          top:-.26rem;
        }
        .title{
          left:55%;
          bottom: .9rem;
        }
        .entext{
          top:-.2rem;
        }
        .entitle{
          width: 50%;
          bottom: 0.5rem;
        }
      }
      li:nth-child(2){
        .text{
          left:24%;
          top:-.36rem;
        }
        .entext{
          left:15%;
          top:-.22rem;
        }
        .title{
          left:1.4%;
          bottom: .48rem;
          display: inline-block;
          width: 50%;
          text-align: right;
          box-sizing: border-box;
          padding-right: .45rem;
        }
        .entitle{
          left: 1%;
          bottom: .1rem;
        }
      }
      li:nth-child(3){
        .text{
          left:55%;
          top:-.2rem;
        }
        .title{
          left:55%;
          bottom: .9rem;
          width: 45%;
          text-align: left;
          box-sizing: border-box;
          padding-right: .45rem;
        }
        .entitle{
          text-align: left;
          padding: 0;
          bottom: 0;
        }
      }
      li:nth-child(4){
        .text{
          left:32%;
          top:-.3rem;
        }
        .title{
          left:.5%;
          bottom: .4rem;
          width: 50%;
          text-align: right;
          box-sizing: border-box;
          padding-right: .45rem;
        }
        .entext{
          left: 8.5%;
        }
        .entitle{
          bottom:.5rem;
        }
      }
      li:last-child{
        height: 1.2rem;
        .text{
          left:55%;
          top:-.14rem;
        }
        .title{
          left:54.5%;
          bottom:.4rem;
        }
        .entitle{
          width: 50%;
          bottom:0;
        }
        .line{
          display: none;
        }
      }
    }
  }
}
</style>
