import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import appConfig from '../../config/config.default';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authToken: null,
    user: undefined,
  },
  actions: {
    GET_USER: function({ commit }) {
      if (!this.state.authToken) { return; }
      axios
        .get(appConfig.AUTH_USER, { headers: { 'Authorization': `Token ${this.state.authToken}` }})
        .then(
          response => {
            commit("SET_USER", { user: response.data });
          },
          err => {
            if (err.response && err.response.status == 401) {
              commit("SET_USER", { user: {} });
            }
          }
        )
    },
    LOAD_AUTH_TOKEN: function({ commit }) {
      if (location.search) {
        let params = new URLSearchParams(location.search);
        if (params.get('token')) {
          commit("SET_AUTH_TOKEN", params.get('token'));
          return;
        }
      }

      let authToken = localStorage.getItem("auth");
      if (authToken !== null) {
        commit("SET_AUTH_TOKEN", authToken);
      }
    }
  },
  mutations: {
    SET_USER: (state, { user }) => {
      state.user = user;
    },
    SET_AUTH_TOKEN: (state, authToken) => {
      state.authToken = authToken;
      localStorage.setItem("authToken", authToken);
    }
  },
  getters: {},
  modules: {},
});