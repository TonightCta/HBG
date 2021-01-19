<!-- 即将爆仓 -->
<template lang="html">
  <div class="">
    <p class="soltTitle">*EOS{{$t('stableCurrency.price')}}：3.0599USDB</p>
    <p class="noData">
      <svg-icon :size="200" :color="'#999'" :icon="'icon-empty'"></svg-icon>
    </p>
  </div>
</template>

<script>
export default {
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
.noData{
  width: 100%;
  text-align: center;
  margin-top: 1rem;
}
</style>
