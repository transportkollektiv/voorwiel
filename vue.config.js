const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const config = require('./src/config.js');

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: config.TITLE,
      config: config
    },
  },

  pwa: {
    name: config.NAME,
    themeColor: '#99d420',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      // maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/mstile-144x144.png'
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  },

  configureWebpack: {
    resolve: {
      alias: {
        'leaflet$': 'leaflet/dist/leaflet-src.esm.js'
      }
    }
  },

  chainWebpack: config => {
    config
      .plugin('FaviconsWebpackPlugin')
      .use(FaviconsWebpackPlugin, [{
        logo: './src/assets/icon.png',
        prefix: 'img/icons/',
        inject: false,
        devMode: 'webapp',
        favicons: {
          icons: {
            appleStartup: false,
            coast: false,
            yandex: false
          }
        }
      }]);
  }
};
