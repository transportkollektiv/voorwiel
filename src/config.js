import Vue from 'vue';

const appConfig = require(`../config/config.${process.env.NODE_ENV}.js`).default;

Vue.prototype.$appConfig = appConfig;

export default appConfig;
