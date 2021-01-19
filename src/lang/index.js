import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from '../store';
import enLocale from './en';
import zhLocale from './zh-CN';

Vue.use(VueI18n);

const messages = {
  'zh-CN': zhLocale,
  en: enLocale,
};
const i18n = new VueI18n({
  locale: store.state.app.language, // set locale
  messages // locale messages
});

export default i18n;
