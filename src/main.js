import Vue from 'vue'
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';

import store from './store'
import App from './App.vue'
import vuetify from './plugins/vuetify'

import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.config.productionTip = false;

import './registerServiceWorker';

import config from './config';
import i18n from './i18n';
import router from './router';

document.title = config.TITLE;

let vueInstance = new Vue({
  vuetify,
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app');

if (config.SENTRY_DSN) {
  Sentry.init({
    dsn: config.SENTRY_DSN,
    integrations: [new VueIntegration({vueInstance, attachProps: true, logErrors: true})],
  });
}
