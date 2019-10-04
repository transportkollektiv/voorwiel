import Vue from 'vue'
import Vuex from 'vuex'
import store from './store'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

import appConfig from '../config/config.default';

Vue.use(Vuex)
Vue.use(VueRouter);

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.config.productionTip = false;

Vue.prototype.$appConfig = appConfig;

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
