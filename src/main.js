import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import store from './store'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

var appConfig = require(`../config/config.${process.env.NODE_ENV}.js`).default;

Vue.use(Vuex);
Vue.use(VueRouter);

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.config.productionTip = false;

Vue.prototype.$appConfig = appConfig;

import Login from './components/Login';

const routes = [
  { path: '/login', component: Login },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app');
