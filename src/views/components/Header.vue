<template>
  <div class="header">
    <div class="topbar">
      <span class="logo" @click="onLogoClick">
        <img src="@/assets/images/logo.png" alt="logo" />
      </span>
      <div class="menus flex-fe">
        <span class="name">{{ account_name }}</span>
        <span class="top-btn flex-center" @click="openSetting">
          <svg-icon :icon="'icon-setting'" :size="64"/>
        </span>
        <span class="top-btn flex-center" @click="showMenu = true">
          <svg-icon :icon="'icon-menu'" :size="46"/>
        </span>
      </div>
    </div>
    <!-- 菜单弹窗 start -->
    <mt-popup
      class="popup-menu"
      v-model="showMenu"
      popup-transition="popup-fade">
      <mt-popup-menu v-if="showMenu" @listenClose="onMenuClose" @changeLang="hasCahneLan" />
    </mt-popup>
    <!-- 设置 -->
    <mt-popup class="popup"
      v-model="showSetting"
      popup-transition="popup-fade">
      <div class="tip-popup">
        <div class="close close1" @click="onCloseClick">
          <svg-icon :icon="'icon-close-gray'" :size="24" :color="'#999'"/>
        </div>
        <div class="title">{{ $t('swap.slippageProtectionSetting') }}</div>
        <div class="word" style="color: #333">
          <span>{{ $t('swap.slippageProtectionDescription') }}</span>
        </div>
        <!-- 设置滑点保护值： -->
        <div class="set-value">
          {{ $t('swap.slippageProtectionValue') }}
        </div>
        <div class="percentage flex">
          <template v-for="(item, index) in percentageList">
            <div class="item"
              :key="index"
              @click="handleSavePercentCheck(item.id)"
              :class="{'active' : percentActive === item.id}"
              v-if="item.id !== 5">
              {{ item.label }}
            </div>
            <div v-else
              :key="index"
              class="percent"
              @click="handleSavePercentCheck(item.id)"
              :class="{'active' : percentActive === item.id}">
              <input type="number"
              @input="handlePercentInput(item)"
              style="text-align:center;"
              v-model="savePercent"
              :placeholder="$t('public.diy')">
              <span>%</span>
            </div>
          </template>
        </div>
         <!-- 确定 -->
          <div class="flex-center">
            <button class="btn1" @click="handleSavePercentSure">
              {{ $t('public.sure') }}
            </button>
          </div>
      </div>
    </mt-popup>
    <!-- 节点设置-->
    <mt-popup
      class="popup"
      v-model="showNodeSetting"
      popup-transition="popup-fade">
      <NodeSetting v-if="showNodeSetting" @listenClose="onNodeSettingClose()" />
    </mt-popup>
  </div>
</template>

<script>
import PopupMenu from '@/views/swap/popup/PopupMenu';
import NodeSetting from '@/views/components/NodeSetting';

export default {
  components: {
    'mt-popup-menu': PopupMenu,
    NodeSetting,
  },
  data() {
    return {
      showSetting: false,
      showMenu: false,
      showNodeSetting: false,
      percentageList: [ // 数量百分比
        {
          id: 0,
          label: '1%',
          value: 100,
        },
        {
          id: 1,
          label: '3%',
          value: 300,
        },
        {
          id: 2,
          label: '5%',
          value: 500,
        },
        {
          id: 3,
          label: '10%',
          value: 1000,
        },
        {
          id: 4,
          label: '20%',
          value: 2000,
        },
        {
          id: 5,
          label: 'DIY',
          value: '',
        },
      ],
      percentActive: -1, // 滑点选中值
      savePercent: null, // 滑点输入中值
    }
  },
  computed: {
    state() {
      return this.$store.state.app;
    },
    account_name() {
      return this.$store.state.app.account.name ? this.$store.state.app.account.name : '';
    }
  },
  props: {
    userOpenStatusVo: {
      type: Object,
    }
  },
  mounted() {
    const slippageTolerance = this.$store.state.app.slippageTolerance;
    const selected = this.percentageList.find(v => v.value === slippageTolerance);
    this.percentActive = selected ? selected.id : -1;
    this.$eventbus.$on('setting', type => {
      if (type == 'slippage') {
        this.showSetting = true;
      } else if (type == 'node') {
        this.showNodeSetting = true;
      }
    });
  },
  methods: {
    onLogoClick() {
      this.$router.push({ path: '/' })
    },
    openSetting(){
      let slAnce=this.$store.state.app.slippageTolerance;
      let valist=[];
      //自定义预设值写入
      if(Number(slAnce)!=0 && !(isNaN(slAnce))){
        this.percentageList.forEach(e => {
          valist.push(e.value/100);
        });
        if(valist.indexOf(slAnce)>-1){
          // console.log(valist.indexOf(slAnce));
          this.percentActive=valist.indexOf(slAnce)
        }else{
          this.percentActive=this.percentageList.length-1;
          this.savePercent=slAnce;
        }
      }
      this.showSetting = true;
    },
    onMenuClose() {
      this.showMenu = false;
    },

    onNodeSettingClose() {
      this.showNodeSetting = false;
    },

    // 返回滑点
    onCloseClick() {
      this.showSetting = false;
    },

    // 选中滑点
    handleSavePercentCheck(id) {
      this.percentActive = id;
    },

    // 滑点保护输入
    handlePercentInput(obj) {
      const item = obj;
      if (item.id === 5 && this.percentActive === 5) {
        item.value = parseInt(this.savePercent * 100 );
        this.$set(this.percentageList, 5, item);
      }
    },

    // 滑点保存
    handleSavePercentSure() {
      const item = this.percentageList.find(v => v.id === this.percentActive);
      if (item) {
        if (item.id === 5) {
          if (this.savePercent >= 100 || this.savePercent <= 0) {
            this.$toast(this.$t('swap.slippageSettingError'));
            return;
          }
        }
        const slippageTolerance = parseInt(item.value);
        this.$store.dispatch('setSlippageTolerance', slippageTolerance/100);
        this.showSetting = false;
        this.$toast(this.$t('public.settingSuccess'));
      }
    },
    hasCahneLan(v){
      this.$emit('turnLang',true)
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  z-index: 300;
  background: white;
  box-shadow: 0px 10px 10px #eee;
  margin-bottom: .4rem;
}
.topbar{
  margin: 0 auto;
  height: 132px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 25px 0 25px;
  font-size: 30px;
  color: #333;
  .logo, .logo img {
    display: block;
    // width: 183px;
    height: 75px;
    cursor: pointer;
  }
  .menus {
    height: 92px;
    .name {
      display: block;
      line-height: 92px;
    }
    .top-btn {
      margin-left: 20px;
      width: 68px;
      height: 68px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 10px 0 #eee;
    }
  }
}
/* ---- 菜单弹窗 start ---- */
.popup-menu{
  top: 110px;
  right: 27px;
  left: auto;
  transform: none;
  z-index: 1000;
  background: transparent;
}
/* ---- 菜单弹窗 end ---- */

.popup{
  z-index: 2002;
  background: transparent;
}

.tip-popup{
  width: 621px;
  border-radius: 15px;
  background: #fff;
  box-sizing: border-box;
  padding: 15px 30px 25px;
  position: relative;
  color: $color-333;
  .close{
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 10px;
    color: #000;
  }

  img {
    width: 240px;
  }
  .title{
    font-size: 32px;
    color: #333;
    text-align: center;
    margin-bottom: 40px;
  }

  .word1 {
    font-size: 30px;
    text-align: center;
    margin: 30px 0;
  }

  .word2 {
    font-size: 27px;
    text-align: center;
  }

  .set-value {
    margin-top: 30px;
  }

}

.percentage {
  justify-content: space-between;
  margin-top: 20px;
  flex-wrap: wrap;

  .item {
    width: 155px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border: 1px solid #999999;
    border-radius: 30px;
    margin-left: 30px;
    margin-bottom: 25px;

    &:nth-child(n) {
      margin-left: 0;
    }

    &.active {
      color: #fff;
      background-color: $color-theme;
      border-color: $color-theme;
    }
  }
  input::-webkit-input-placeholder{
    // color:#bbb !important;
    font-size: 24px !important;
    // font-weight: 400;
  }
  input {
    box-sizing: border-box;
    width: 157px;
    height: 62px;
    line-height: 62px;
    font-size: 30px;
    outline-style: none;
    background: transparent;
    color: #333;
    border: 1px solid #999999;
    border-radius: 31px;
    padding: 0 45px 0 20px;
  }

  .active {
    color: #fff !important;
    input {
      color: #fff !important;
      background-color: $color-theme;
      border-color: $color-theme;
    }
    input::placeholder {
      color: #fff !important;
    }
  }

  .percent {
    position: relative;
    margin-top: -24px;
    color: #999;

    span {
      position: absolute;
      right: 22px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.btn1 {
  position: relative;
  width: 90%;
  height: 90px;
  background: $btn-bg;
  color: $btn-color;
  margin-bottom: 30px;
  font-size: 28px;
  border-radius: 45px;
  margin: 20px 0 10px 0;

  &.btn2 {
    background: #fff;
    color: #333;
    border: 1px solid $btn-bg
  }
}
</style>
