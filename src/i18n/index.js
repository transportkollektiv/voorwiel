import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n)

const messages = require('./messages.json');

const i18n = new VueI18n({
  locale: 'de', // TODO: get browser locale
  messages,
  fallbackLocale: 'en',
})

export default i18n;
