let env = process.env.VOORWIEL_ENV || process.env.NODE_ENV;
let config = require(`../config/config.${env}.js`);
module.exports = config;
