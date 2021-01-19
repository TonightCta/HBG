<!-- 常见问题 -->
<template lang="html">
  <div class="problem">
    <ul>
      <li v-for="(pro,indexP) in proList" :key="indexP" @click="proDe(indexP)">
        <p>{{pro.title}}</p>
        <svg-icon :color="'#ccc'" :size="30" svgClass="icon" :icon="'icon-back'"></svg-icon>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name:'Problem',
  data(){
    return{
      
    }
  },
  computed:{
    proList(){
      return [
        {
          title:this.$t('qa.question1'),
          content:this.$t('qa.answer1'),
          contentT:'',
        },
        // {
        //   title:this.$t('qa.question2'),
        //   content:this.$t('qa.answer2')
        // },
        {
          title:this.$t('qa.question3'),
          content:this.$t('qa.answer3'),
          contentT:this.$t('qa.answer2'),
        }
      ]
    }
  },
  methods:{
    proDe(index){
      this.$router.push({
        name:'ProblemDe',
        params:{
          deMes:this.proList[index]
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.problem{
  ul{
    li{
      color:#333;
      border-bottom: 1px solid #eee;
      position: relative;
      font-size: .4rem;
      p{
        height: 1.4rem;
        line-height: 1.4rem;
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .icon{
        transform: rotate(180deg);
        font-weight: 600;
        position: absolute;
        top:50%;
        margin-top: -.15rem;
        right:.2rem;
      }
    }
  }
}
</style>
