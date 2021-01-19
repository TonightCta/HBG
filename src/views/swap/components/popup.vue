<!-- 弹框封装 -->
<template lang="html">
  <div class="popup" v-if="hidePopup">
    <div class="mask" ref="mask"  @click="closePopup"></div>
    <div class="content" ref="content" :style="{width:width+'%',marginLeft:- width/2 +'%',}">
      <img :src="close" alt="" class="close" @click="closePopup">
      <p class="title">
        <img :src="dec" alt="" class="dec">
        <img :src="dec" alt="" class="dec">
        {{title}}
      </p>
      <slot></slot>
      <!-- <p class="btnType2" v-if="withBtn">
        <button type="button" name="button">{{$t('popup.confirm')}}</button>
      </p> -->
      <!-- <p class="btn" v-if="withCancel">
        <button type="button" name="button">{{$t('popup.cancel')}}</button>
        <button type="button" name="button">{{$t('popup.confirm')}}</button>
      </p> -->
    </div>
  </div>
</template>

<script>
export default {
  /**
   * @for popup
   * @author 崔田
   * @param width 弹框宽度
   * @param title 弹框标题
   * @param withBtn 带确认按钮  ----->不传默认为false  **已废弃
   * @param withCancel 带确认/取消按钮   ----->不传默认为false  **已废弃
   */
  name:'Popup',
  props:{
    specialValue:{
      default:true,
      type:Boolean
    },
    show:Boolean,
    width:Number,
    title:String,
    withBtn:Boolean,
    withCancel:Boolean,
  },
  data(){
    return{
      conHeight:null,
      close:require('@/assets/images/closeIcon.png'),
      dec:require('@/assets/images/decIcon.png'),
      hidePopup:false,
    }
  },
  mounted(){
    //确认按钮
    if(!this.withBtn){
      this.withBtn=false;
    }else{
      return this.withBtn;
    }
    //带取消按键的按钮
    if(!this.withCancel){
      this.withCancel=false;
    }else{
      return this.withCancel;
    }
  },
  methods:{
    async openRe(val){
      if(val){
        this.hidePopup = true;
        setTimeout(()=>{
          this.$refs.mask.style.opacity='1';
          setTimeout(()=>{
            let conHeight=this.$refs.content.offsetHeight;
            this.$refs.content.style.marginTop= -(conHeight/2) +'px';
            this.$refs.content.style.opacity='1';
            // 禁止页面滑动
        //     let perD=function(e){e.preventDefault()}
        // 　　 document.body.style.overflow='hidden';
        // 　　 document.addEventListener("touchmove",perD,{passive: false});
          },100)
        },50)
      }
    },
    closePopup(){
      this.$refs.content.style.opacity='0'
      this.$refs.mask.style.opacity='0';
      setTimeout(()=>{
        this.hidePopup=false;
        //恢复页面滑动
        // let perD=function(e){e.preventDefault()}
        // document.body.style.overflow = ''
        // document.removeEventListener('touchmove', perD, {passive: false})
      },400)
    }
  },
  watch:{
    specialValue(val,oldVal){
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.mask{
  position: fixed;
  width: 100%;
  height: 100%;
  top:0;
  left:0;
  z-index: 500;
  background: rgba(0,0,0,.5);
  transition: .3s all;
  opacity: 0;
}
.content{
  height: auto;
  position: fixed;
  top:50%;
  left:50%;
  background: white;
  z-index: 600;
  border-radius: 20px;
  box-sizing: border-box;
  padding: .2rem;
  text-align: center;
  transition: .3s all;
  opacity: 0;
  .close{
    position: absolute;
    width: 1.1rem;
    height: 1.1rem;
    right:0;
    top:0;
  }
  .title{
    width: 100%;
    line-height: 1.6rem;
    height: 1.6rem;
    font-size: .46rem;
    .dec{
      width: .2rem;
      height: .2rem;
      position: absolute;
      margin-top: .7rem;
    }
    .dec:first-child{
      left:30%;
    }
    .dec:last-child{
      right:30%;
    }
  }
  .btn{
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin-top: .1rem;
    padding-bottom: .2rem;
    button{
      width: 40%;
      line-height: 1rem;
      font-size: .4rem;
      border-radius: 100px;
    }
    button:first-child{
      color:#9A3100;
      box-sizing: border-box;
      border:2px solid #9A3100;
      background: white;
    }
    button:last-child{
      background-image: linear-gradient(to right, #FFBD53 , #FFA300);
      color:white;
    }
  }
  .btnType2{
    width: 100%;
    margin-top: .1rem;
    padding-bottom: .2rem;
    button{
      width: 60%;
      line-height: 1rem;
      font-size: .4rem;
      border-radius: 100px;
      background-image: linear-gradient(to right, #FFBD53 , #FFA300);
      color:white;
    }
  }
}
</style>
