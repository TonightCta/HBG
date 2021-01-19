<!-- 兑换 -->
<template lang="html">
  <div class="exchange">
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <button type="button" name="button" class="exchangeBtn">兑换</button>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.exchange{
  width: 100%;
  position: relative;
  padding-bottom: .7rem;
  .exchangeBtn{
    position: absolute;
    width: 80%;
    height: 1.3rem;
    background: linear-gradient(90deg, #FFBD53 0%, #FFA300 100%);
    color:white;
    border-radius: 50px;
    left:50%;
    margin-left: -40%;
    bottom:-.65rem;
    font-size: .5rem;
    font-weight: 500;
  }
}
</style>
