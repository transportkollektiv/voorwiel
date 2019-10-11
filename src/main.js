import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import store from './store'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

var appConfig = require(`../config/config.${process.env.NODE_ENV}.js`).default;

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueI18n)

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.config.productionTip = false;

Vue.prototype.$appConfig = appConfig;

import Login from './components/Login';
import Rent from './components/Rent';
import './registerServiceWorker';

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/login', component: Login },
    { path: '/rent', component: Rent, meta: { requiresAuth: true }, props: (route) => {
      if (route.query && route.query.id) {
        return { bikeId: route.query.id }
      }
      return {};
    }},
    { path: '/b/:id', redirect: to => {
      const { params } = to;
      return { path: '/rent', query: { id: params.id } };
    }},
  ],
});

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  store.dispatch("IS_AUTHENTICATED")
    .then(() => next())
    .catch(() => next({ path: '/login' }));
});

const messages = {
  'en': {
    message: {
      app: {
        'login': 'Login',
        'logout': 'Logout',
        'unvalidated-message': 'You can\'t rent bikes because you haven\'t been validated yet. Please contact us so you can start riding a bike right away.'
      },
      rent: {
        'unlockcode': 'Unlock Code',
        'unlock': 'Unlock',
        'bikenumber': 'Bike number',
        'finish-rent': 'Finish Rent',
        'rent': 'Rent',
        'renting-for': 'Renting for',
      },
      rentbutton: {
        'rent-bike': 'Rent Bike',
        'rent-or-return-bike': 'Rent or Return Bike'
      },
      login: {
        'login-with': 'Login with'
      },
      about: {
        'title': 'About',
        'html': `An experimental <a href="https://github.com/stadtulm">open source</a> bikesharing, currently testing with employees of the City of Ulm.<br />
                <b>Want to take part?</b> Drop us a line &rarr; <a href="mailto:openbike@ulm.dev">openbike@ulm.dev</a>`
      }
    }
  },
  'de': {
    message: {
      app:{
        'login': 'Einloggen',
        'logout': 'Ausloggen',
        'unvalidated-message': 'Sie können noch keine Fahrräder ausleihen, da ihr Account noch nicht freigeschalten wurde. Bitte kontaktieren Sie uns, um sich freischalten zu lassen.'
      },
      rent: {
        'unlockcode': 'Entsperrcode',
        'unlock': 'Entsperren',
        'bikenumber': 'Radnummer',
        'finish-rent': 'Zurückgeben',
        'rent': 'Ausleihe',
        'renting-for': 'Ausleihe läuft',
      },
      rentbutton: {
        'rent-bike': 'Rad ausleihen',
        'rent-or-return-bike': 'Ausleihen oder Zurückgeben'
      },
      login: {
        'login-with': 'Einloggen mit'
      },
      about: {
        'title': 'Über',
        'html': `Ein experimentelles <a href="https://github.com/stadtulm">open source</a> Bikesharing im Test mit Beschäftigten der Stadt Ulm.<br />
                <b>Mitmachen?</b> Melde dich &rarr; <a href="mailto:openbike@ulm.dev">openbike@ulm.dev</a>`
      }
    }
  }
}

const i18n = new VueI18n({
  locale: 'de', // TODO: get browser locale
  messages,
  fallbackLocale: 'en',
})


new Vue({
  vuetify,
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app');
