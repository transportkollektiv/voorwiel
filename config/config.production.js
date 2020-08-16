var ENV = 'production';

var TITLE = "openbike.ulm.dev - bikesharing for employees of the City of Ulm";
var NAME = "OpenBike";
var SYSTEM_URL = "https://api.openbike.ulm.dev";
var API_ROOT = SYSTEM_URL + "/api";
var GBFS_URL = SYSTEM_URL + "/gbfs/gbfs.json";

var DEFAULT_LOCATION = [48.3984, 9.9908];
var DEFAULT_ZOOM = 15;

var I18N_MESSAGE_OVERRIDE = {
  "en": {
    "message": {
      "about": {
        "html": "An experimental <a href='https://github.com/stadtulm'>open source</a> bikesharing, currently testing with employees of the City of Ulm.<br /><b>Want to take part?</b> Drop us a line &rarr; <a href='mailto:openbike@ulm.dev'>openbike@ulm.dev</a>"
      }
    }
  },
  "de": {
    "message": {
      "app": {
        "unvalidated-message": "Sie können noch keine Fahrräder ausleihen, da ihr Account noch nicht freigeschalten wurde. Bitte <a href='mailto:openbike@ulm.dev'>senden Sie uns</a> Ihren rechts oben angezeigten Nutzernamen, um sich freischalten zu lassen."
      },
      "about": {
        "html": "Ein experimentelles <a href='https://github.com/stadtulm'>open source</a> Bikesharing im Test mit Beschäftigten der Stadt Ulm.<br /><b>Mitmachen?</b> Melde dich &rarr; <a href='mailto:openbike@ulm.dev'>openbike@ulm.dev</a>"
      }
    }
  }
};

var SUPPORT_TYPE = 'zammad';
var SUPPORT_URL = 'https://support.ulm.dev';

var SENTRY_DSN = '';

module.exports = { ENV, TITLE, NAME, API_ROOT, GBFS_URL, DEFAULT_LOCATION, DEFAULT_ZOOM, I18N_MESSAGE_OVERRIDE, SUPPORT_TYPE, SUPPORT_URL, SENTRY_DSN };
