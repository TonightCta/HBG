// mint-ui
import Vue from 'vue'
import { Popup, Loadmore, Toast, Range ,Picker,Indicator,Spinner} from 'mint-ui';

// mint-ui
Vue.component(Popup.name, Popup);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Toast.name, Toast);
Vue.component(Range.name, Range);
Vue.component(Picker.name, Picker);
Vue.component(Spinner.name, Spinner);

Vue.$toast = Vue.prototype.$toast = Toast;
Vue.prototype.$ins=Indicator;
Vue.prototype.$load=Spinner;
