var ENV = 'development';

var TITLE = "dev.bike - experimental bikesharing with an open source stack";
var NAME = "dev.bike";
var SYSTEM_URL = "http://localhost:8000";
var API_ROOT = SYSTEM_URL + "/api";
var GBFS_URL = SYSTEM_URL + "/gbfs/gbfs.json";

var DEFAULT_LOCATION = [53.5823813, 9.7137465];
var DEFAULT_ZOOM = 15;

var TRACKER_AVAILABLE = false;

var I18N_MESSAGE_OVERRIDE = {};

var SUPPORT_TYPE;
var SUPPORT_URL;

var SENTRY_DSN = '';

module.exports = { ENV, TITLE, NAME, API_ROOT, GBFS_URL, DEFAULT_LOCATION, DEFAULT_ZOOM, I18N_MESSAGE_OVERRIDE, SUPPORT_TYPE, SUPPORT_URL, SENTRY_DSN, TRACKER_AVAILABLE };
