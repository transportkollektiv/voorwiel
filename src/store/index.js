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

const axiosWithAuth = (state) => {
  return axios.create({
    headers: { 'Authorization': `Token ${state.authToken}` }
  })
}

const LS_AUTH_TOKEN_KEY = 'authToken';

export default new Vuex.Store({
  state: {
    authToken: null,
    user: undefined,
    rents: []
  },
  actions: {
    GET_USER: function({ commit, state }) {
      if (!state.authToken) { return; }
      axiosWithAuth(state)
        .get(appConfig.AUTH_USER)
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
    LOGOUT: function({ commit }) {
      localStorage.removeItem(LS_AUTH_TOKEN_KEY);
      commit("CLEAR_USER");
      if (location.search) {
        let params = new URLSearchParams(location.search);
        if (params.get('token')) {
          window.location.search = "";
          return;
        }
      }
    },
    START_RENT: function({ dispatch, state }, bikeNumber) {
      return new Promise((resolve, reject) => {
        axiosWithAuth(state)
          .post(appConfig.API_ROOT + '/rent/start', {bike_number: bikeNumber})
          .then(
            response => {
              dispatch("UPDATE_RENTS")
              resolve()
            },
            err => {
              reject(err)
            });
      })
    },
    UPDATE_RENTS: function({ commit, state }) {
      axiosWithAuth(state)
        .get(appConfig.API_ROOT + '/rent/current')
        .then(response => {
          commit('SET_RENTS', response)
        })
    }
  },
  mutations: {
    CLEAR_USER: (state) => {
      state.authToken = null;
      state.user = undefined;
      state.rents = [];
    },
    SET_USER: (state, { user }) => {
      state.user = user;
    },
    SET_AUTH_TOKEN: (state, authToken) => {
      state.authToken = authToken;
      localStorage.setItem(LS_AUTH_TOKEN_KEY, authToken);
    },
    SET_RENTS: (state, rents) => {
      state.rents = rents;
    }
  },
  getters: {},
  modules: {},
});
