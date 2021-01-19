<template>
  <div class="maintenance">
    <div class="title">{{ $t('public.tip') }}</div>
    <div class="content flex-center">
      <div class="img">
        <img src="@/assets/images/common/maintenance.png" alt="">
      </div>
      <div class="msg">{{ $t('public.maintenance') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  methods: {

  }
}
</script>

<style scoped lang="scss">
.maintenance {
  width: 620px;
  height: 660px;
  .title {
    font-size: 30px;
    text-align: center;
    line-height: 100px;
    color: $color-text;
  }

  .content{
    flex-direction: column;
    height: 450px;
    font-size: 24px;
    .img img {
      width: 240px;
    }
    .msg {
      margin-top: 30px;
    }
  }

}
</style>
