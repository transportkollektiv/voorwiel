let config;
  config = require(`../config/config.${process.env.NODE_ENV}.js`).default;
export default config;
