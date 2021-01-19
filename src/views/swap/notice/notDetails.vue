<!-- 公告详情 -->
<template lang="html">
  <div class="notDetails">
    <p>{{notMes.title}}</p>
    <p>{{notMes.content}}</p>
    <p>{{notMes.create_time.substring(0,10)}}</p>
  </div>
</template>

<script>
export default {
  name:'NotDetails',
  data(){
    return{
      notMes:{}
    }
  },
  created(){
    this.notMes=this.$route.params.notDe;
  }
}
</script>

<style lang="scss" scoped>
.notDetails{
  width: 95%;
  margin:0 auto;
  p:first-child{
    line-height: 150px;
    border-bottom: 1px solid #ccc;
    font-weight: 600;
    font-size: 32px;
  }
  p:nth-child(2){
    margin-top: 30px;
    font-weight: 400;
    font-size: 24px;
    color: #333333;
  }
  p:last-child{
    margin-top: .8rem;
    text-align: right;
    font-size: 24px;
    color:#999;
  }
}
</style>
