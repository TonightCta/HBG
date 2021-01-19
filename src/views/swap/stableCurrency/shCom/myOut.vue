<!-- 我的抢拍 -->
<template lang="html">
  <div class="">
    <!-- 实时价格 -->
    <p class="soltTitle">*EOS{{$t('stableCurrency.priceNow')}}：3.0199USDB</p>
    <!-- 抢拍列表 -->
    <ul>
      <li v-for="(shoot,indexSh) in shootList" :key="indexSh">
        <p class="accMes">
          {{shoot.name}}
          <span>{{$t('stableCurrency.snapEnd')}}</span>
        </p>
        <div class="dealMes">
          <p>
            <span>{{$t('stableCurrency.dealNum')}}(EOS)</span>
            <span>{{shoot.num}}</span>
          </p>
          <p>
            <span>{{$t('stableCurrency.dealAve')}}(EOS)</span>
            <span>{{shoot.allNum}}&nbsp;USDB</span>
          </p>
          <p>
            <span>{{$t('stableCurrency.dealAmount')}}</span>
            <span>{{shoot.dealNum}}&nbsp;USDB</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name:'SoldOut',
  data(){
    return{
      shootList:[
        {
          name:'fun********',
          num:'2019.0392',
          allNum:'3.3333',
          dealNum:'0.0020'
        },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.soltTitle{
  width: 100%;
  margin-top: .4rem;
  color:#FFA300;
  box-sizing: border-box;
  padding-left: .1rem;
}
ul{
  width: 100%;
  li{
    box-sizing: border-box;
    padding: .4rem .3rem;
    box-shadow: 0px 10px 30px #ccc;
    border-radius: 20px;
    font-size: .4rem;
    margin-top: .4rem;
    .accMes{
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding-bottom: .4rem;
      border-bottom: 1px solid #eee;
      font-weight: bold;
    }
    .dealMes{
      margin-top: .4rem;
      width: 100%;
      display: flex;
      justify-content: space-between;
      p{
        display: flex;
        flex-direction: column;
        span:first-child{
          font-size: .34rem;
          color:#999;
        }
      }
      p:last-child{
        text-align: right;
      }
    }
  }
}
</style>
