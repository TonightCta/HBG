import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from '@/utils/axios'
import i18n from './lang'
import VueClipboard from 'vue-clipboard2';
import './router/action'
import './utils/directives'
// components
import SvgIcon from '@/views/components/SvgIcon';

import '@/assets/css/public.scss'
import 'mint-ui/lib/style.css'
import '@/utils/mint-ui'

Vue.config.productionTip = false;
Vue.prototype.$http = http;
Vue.prototype.$eventbus = new Vue();

// 国际化 - 语言
Vue.use(i18n);
Vue.use(VueClipboard);

// components
Vue.component('svg-icon', SvgIcon);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
