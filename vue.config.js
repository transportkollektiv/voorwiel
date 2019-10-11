const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  pwa: {
    name: 'openbike',
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
    }
  },

  configureWebpack: {
    plugins: [
      new FaviconsWebpackPlugin({
        logo: './src/assets/icon.png',
        prefix: 'img/icons/',
        inject: false,
        favicons: {
          icons: {
            appleStartup: false,
            coast: false,
            yandex: false
          }
        }
      })
    ]
  }
};
