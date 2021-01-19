<!-- 关于USDB -->
<template lang="html">
  <div class="about">
    <p>{{$t('about.title')}}</p>
    <p style="marginTop:.4rem;">{{$t('about.title2')}}</p>
    <ul>
      <li>
        <svg-icon :color="'#333'" :icon="'icon-about'" svgClass="icon" :size="50"/>
        <span>{{$t('about.title3')}}</span>
        <p>{{$t('about.text1')}}<br>{{$t('about.text2')}}</p>
      </li>
      <li>
        <svg-icon :color="'#333'" :icon="'icon-about'" svgClass="icon" :size="50"/>
        <span>{{$t('about.title4')}}</span>
        <p>{{$t('about.text3')}}<br>{{$t('about.text4')}}</p>
      </li>
      <li>
        <svg-icon :color="'#333'" :icon="'icon-about'" svgClass="icon" :size="50"/>
        <span>{{$t('about.title5')}}</span>
        <p>灵活的债仓管理，更好的掌控风险<br>五分钟均价，降低价格波动影响</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.about{
  p{
    font-size: .4rem;
    text-align: left;
  }
  ul{
    margin-top: .4rem;
    li{
      position: relative;
      box-sizing: border-box;
      padding-left: 1rem;
      margin-top: .8rem;
      .icon{
        position: absolute;
        width: .6rem;
        left:0;
        top:0;
      }
      span{
        font-size: .5rem;
        font-weight: 500;
      }
      p{
        color:#999;
        margin-top: .3rem;
      }
    }
    li:first-child{
      margin:0;
    }
  }
}
</style>
