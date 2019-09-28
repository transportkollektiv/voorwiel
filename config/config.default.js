var TITLE = "dev.bike - rent a bike on the #cccamp19, a radforschung.org project"
var SYSTEM_URL = "http://lvh.me:8000"
var API_ROOT = SYSTEM_URL + "/api"
var GBFS_URL = SYSTEM_URL + "/gbfs/gbfs.json"
var AUTH_USER = API_ROOT + "/user"
var AUTH_LOGIN = SYSTEM_URL + "/auth/{provider}/login/"

var AUTH_PROVIDER = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'mdi-twitter',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'mdi-github-circle',
  },
  {
    id: 'stackexchange',
    name: 'StackOverflow',
    icon: 'mdi-stack-overflow',
  },
  {
    id: 'fragdenstaat',
    name: 'FragDenStaat.de',
    iconFile: "./src/assets/fds-icon.png",
  },
  {
    id: 'eventphone',
    name: 'Eventphone',
    iconFile: "./src/assets/ephone.svg",
  },
]

var DEFAULT_LOCATION = [48.3984, 9.9908]
var DEFAULT_ZOOM = 15

module.exports = {TITLE, SYSTEM_URL, API_ROOT, GBFS_URL, AUTH_USER, AUTH_LOGIN, AUTH_PROVIDER, DEFAULT_LOCATION, DEFAULT_ZOOM}
