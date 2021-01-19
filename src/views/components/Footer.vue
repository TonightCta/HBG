<template>
  <div class="footer">
    <div class="wrap">
      <span>{{$t('swap.volumn24h')}}: </span>
        <span>{{ toFixed(state.statInfo.volumeLog, 4) }}</span>
      <span>EOS,</span>
      <span>{{ state.statInfo.countLog || 0}}</span>
      <span>{{$t('swap.countOrders')}}</span>
    </div>
    <div class="wrap">
      <span>{{$t('public.totalValueLocked')}} {{ toFixed((state.statInfo.eos || 0) * 2, 4) }} EOS</span>
    </div>
    <div class="wrap contacts">
      <span><a href="https://t.me/HBGDEFI" target="_blank">Telegram</a></span>
      <!-- &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; -->
      <!-- <span @click="wechatQrcodeVisible=true;">Wechat</span>
      <mt-popup
        v-model="wechatQrcodeVisible"
        position="center"
        >
        <div class="wechat">
          <img  src="@/assets/images/qrWechat.png" />
        </div>
      </mt-popup> -->
      <!-- <br>
      <span
        v-clipboard:copy="ChickenPanini"
        v-clipboard:error="onError"
        v-clipboard:success="onCopy"
        class="feedback"
      >{{$t('public.feedbackWeChat')}} <img width="21px" src="@/assets/images/copy.png" />
    </span> -->
    </div>
    <div class="wrap auditReport">
      {{$t('public.audit')}} <span class="name"  @click="auditReportVisible=true;">{{$t('public.auditName')}}</span> {{$t('public.auditEnd')}}
      <mt-popup
        v-model="auditReportVisible"
        position="bottom"
        >
        <div>
          <img width="360px" src="@/assets/images/AuditReport.jpg" />
        </div>
      </mt-popup>
    </div>
    <p style="fontSize:.35rem;">© 2020 HBG Finance (BVI) Inc.</p>
  </div>
</template>

<script>
import { toFixed } from '@/utils/decimal';
export default {
  data() {
    return {
      wechatQrcodeVisible: false,
      auditReportVisible: false,
      ChickenPanini: 'ChickenPanini',
    }
  },
  components: {},
  watch: {},
  computed: {
    state() {
      return this.$store.state.app;
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    this.timer && clearTimeout(this.timer)
  },
  methods: {
    toFixed(n, l) {
      return toFixed(n, l)
    },
    onCopy() {
      this.$toast({
        message: this.$t("public.copySuccessfully"),
        position: "center",
        duration: 2000,
      });
    },
    onError() {
      this.$toast({
        message: this.$t("public.copyFailed"),
        position: "center",
        duration: 2000,
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.footer {
  font-size: 25px;
  padding: 50px 0;
  color: #333;
  text-align: center;
  .wrap {
    // color: #999;
    vertical-align: middle;
    // color: #8B572A;
    span:nth-child(2) {
      line-height: 34px;
      // color: #8B572A;
    }
    span:nth-child(3) {
      margin: 0 0 0 5px;
      line-height: 34px;
    }
    span:nth-child(4) {
      // color: #8B572A;
      margin: 0 5px 0 10px;
      line-height: 34px;
    }
  }
  .contacts {
    margin: 10px 0px;
    a {
      color: #333;
    }
    .feedback {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .auditReport {
    // font-size: 18px;
    .name {
      color: #ffa300;
    }
  }
}

.wechat {
  width: 400px;
  height: 400px;
  position: fixed;
  top:50%;
  left:50%;
  margin-left: -200px;
  margin-top: -200px;
  img{
    width: 100%;
    height: 100%;
  }
}


</style>
