import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import appConfig from '../../config/config.default';

Vue.use(Vuex);

const removeSearchFromUrl = (url) => {
  let a = document.createElement('a');
  a.href = url;
  a.search = '';
  return a.href;
};

const LS_AUTH_TOKEN_KEY = 'authToken';

export default new Vuex.Store({
  state: {
    authToken: null,
    user: undefined,
  },
  actions: {
    GET_USER: function({ commit, state }) {
      if (!state.authToken) { return; }
      axios
        .get(appConfig.AUTH_USER, { headers: { 'Authorization': `Token ${state.authToken}` }})
        .then(
          response => {
            commit("SET_USER", { user: response.data });
          },
          err => {
            if (err.response && err.response.status == 401) {
              commit("CLEAR_USER");
            }
          }
        )
    },
    LOAD_AUTH_TOKEN: function({ commit }) {
      if (location.search) {
        let params = new URLSearchParams(location.search);
        if (params.get('token')) {
          commit("SET_AUTH_TOKEN", params.get('token'));
          history.replaceState({}, '', removeSearchFromUrl(location.href));
          return;
        }
      }

      let authToken = localStorage.getItem(LS_AUTH_TOKEN_KEY);
      if (authToken !== null) {
        commit("SET_AUTH_TOKEN", authToken);
      }
    },
    LOGOUT: function() {
      localStorage.removeItem(LS_AUTH_TOKEN_KEY);
      if (location.search) {
        let params = new URLSearchParams(location.search);
        if (params.get('token')) {
          window.location.search = "";
          return;
        }
      }
      location.reload();
    }
  },
  mutations: {
    CLEAR_USER: (state) => {
      state.user = {};
    },
    SET_USER: (state, { user }) => {
      state.user = user;
    },
    SET_AUTH_TOKEN: (state, authToken) => {
      state.authToken = authToken;
      localStorage.setItem(LS_AUTH_TOKEN_KEY, authToken);
    }
  },
  getters: {},
  modules: {},
});
