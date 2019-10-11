import '@mdi/font/css/materialdesignicons.css';

import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: { iconfont: 'mdi' },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#99d420',
        success: '#99d420',
      },
    },
  },
});
