var TITLE = "dev.bike - rent a bike on the #cccamp19, a radforschung.org project";
var SYSTEM_URL = "http://lvh.me:8000";
var API_ROOT = SYSTEM_URL + "/api";
var GBFS_URL = SYSTEM_URL + "/gbfs/gbfs.json";

var AUTH_PROVIDER = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'mdi-twitter',
    url: SYSTEM_URL + "/auth/twitter/login/",
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'mdi-github-circle',
    url: SYSTEM_URL + "/auth/github/login/",
  },
  {
    id: 'stackexchange',
    name: 'StackOverflow',
    icon: 'mdi-stack-overflow',
    url: SYSTEM_URL + "/auth/stackexchange/login/",
  },
  {
    id: 'fragdenstaat',
    name: 'FragDenStaat.de',
    iconFile: "./src/assets/fds-icon.png",
    url: SYSTEM_URL + "/auth/fragdenstaat/login/",
  },
  {
    id: 'eventphone',
    name: 'Eventphone',
    iconFile: "./src/assets/ephone.svg",
    url: SYSTEM_URL + "/auth/eventphone/login/",
  },
];

var DEFAULT_LOCATION = [48.3984, 9.9908];
var DEFAULT_ZOOM = 15;

export default {TITLE, SYSTEM_URL, API_ROOT, GBFS_URL, AUTH_PROVIDER, DEFAULT_LOCATION, DEFAULT_ZOOM};
