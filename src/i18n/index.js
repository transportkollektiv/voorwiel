import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { mergeDeep } from './util';
Vue.use(VueI18n);

import config from '../config';

let messages = require('./messages.json');

if (config.I18N_MESSAGE_OVERRIDE) {
  mergeDeep(messages, config.I18N_MESSAGE_OVERRIDE);
}

const i18n = new VueI18n({
  locale: 'de', // TODO: get browser locale
  messages,
  fallbackLocale: 'en',
});

export default i18n;
