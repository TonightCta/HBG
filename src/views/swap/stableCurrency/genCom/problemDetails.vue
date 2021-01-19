<!-- 常见问题内页 -->
<template lang="html">
  <div class="problemDe">
    <p>{{deMes.title}}</p>
    <p>{{deMes.contentT}}</p>
    <p>{{deMes.content}}</p>
  </div>
</template>

<script>
export default {
  name:'ProblemDetails',
  data(){
    return{
      deMes:{},
    }
  },
  created(){
    this.deMes = this.$route.params.deMes;
  }
}
</script>

<style lang="scss" scoped>
.problemDe{
  width: 95%;
  margin:0 auto;
  p:first-child{
    padding:25px 0 40px 0;
    border-bottom: 1px solid #ccc;
    font-weight: 600;
    font-size: 32px;
  }
  p:nth-child(2),p:last-child{
    margin-top: 30px;
    font-weight: 400;
    font-size: 24px;
    color: #333333;
  }
  // p:last-child{
  //   margin-top: .8rem;
  //   text-align: right;
  //   font-size: 24px;
  //   color:#999;
  // }
}
</style>
