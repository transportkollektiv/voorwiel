import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const axiosWithAuth = function (state) {
  let appConfig = this._vm.$appConfig;
  return axios.create({
    baseURL: appConfig.API_ROOT,
    headers: { 'Authorization': `Token ${state.authToken}` }
  })
}

const getCurrentPosition = (options) => {
  if (navigator.geolocation) {
    return new Promise(
      (resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options)
    )
  }
  return Promise.resolve();
}

const unpackErrorMessage = (err) => {
  if (err.response && err.response.data && err.response.data.error) {
    throw err.response.data.error;
  }
  if (err.response && err.response.data && err.response.data.detail) {
    throw err.response.data.detail;
  }
  throw err;
};

const LS_AUTH_TOKEN_KEY = 'authToken';

export default new Vuex.Store({
  state: {
    authToken: null,
    user: undefined,
    rents: [],
    appError: ''
  },
  actions: {
    AUTHENTICATE: function({ commit, dispatch }, authToken) {
      commit("SET_AUTH_TOKEN", authToken);
      return dispatch("GET_USER");
    },
    IS_AUTHENTICATED: function({ dispatch, getters }) {
      if (!getters.isAuthenticated) {
        return dispatch("LOAD_AUTH_TOKEN")
          .then(() => dispatch("GET_USER"));
      }
      return Promise.resolve();
    },
    GET_USER: function({ commit, state, getters }) {
      if (!getters.isAuthenticated) { return Promise.reject(); }
      return axiosWithAuth.call(this, state)
        .get('/user')
        .then(
          response => {
            commit("SET_USER", { user: response.data });
          },
          err => {
            if (err.response && err.response.status == 401) {
              commit("CLEAR_USER");
              return Promise.reject()
            }
          }
        );
    },
    LOAD_AUTH_TOKEN: function({ commit }) {
      return new Promise((resolve, reject) => {
        let authToken = localStorage.getItem(LS_AUTH_TOKEN_KEY);
        if (authToken !== null) {
          commit("SET_AUTH_TOKEN", authToken);
          resolve();
          return;
        }

        reject();
      });
    },
    LOGOUT: function({ commit }) {
      localStorage.removeItem(LS_AUTH_TOKEN_KEY);
      commit("CLEAR_USER");
    },
    START_RENT: function({ dispatch }, bikeNumber) {
      return getCurrentPosition({
          timeout: 3000,
          enableHighAccuracy: true,
          maximumAge: 20000
        }).then(
          (location) => dispatch("START_RENT_INTERNAL", bikeNumber, location),
          () => dispatch("START_RENT_INTERNAL", bikeNumber)
        );
    },
    START_RENT_INTERNAL: function({ dispatch, state }, bikeNumber, location) {
      let data = {bike_number: bikeNumber};
      if (location && location.coords && location.coords.accuracy < 20) {
        data['lat'] = location.coords.latitude;
        data['lng'] = location.coords.longitude;
      }
      return axiosWithAuth.call(this, state)
        .post('/rent/start', data)
        .then(
          response => {
            dispatch("UPDATE_RENTS")
            return response.data;
          },
          err => unpackErrorMessage(err)
        );
    },
    END_RENT: function({ dispatch }, rentId) {
      return getCurrentPosition({
          timeout: 3000,
          enableHighAccuracy: true,
          maximumAge: 20000
        }).then(
          (location) => dispatch("END_RENT_INTERNAL", rentId, location),
          () => dispatch("END_RENT_INTERNAL", rentId)
        );
    },
    END_RENT_INTERNAL: function({ dispatch, state }, rentId, location) {
      let data = {rent_id: rentId};
      if (location && location.coords && location.coords.accuracy < 20) {
        data['lat'] = location.coords.latitude;
        data['lng'] = location.coords.longitude;
      }
      return axiosWithAuth.call(this, state)
        .post('/rent/finish', data)
        .then(
          response => {
            dispatch("UPDATE_RENTS")
            return response.data;
          },
          err => unpackErrorMessage(err)
        );
    },
    UPDATE_RENTS: function({ commit, state, getters }) {
      if (!getters.isAuthenticated) { return; }
      axiosWithAuth.call(this, state)
        .get('/rent/current')
        .then(response => {
          commit('SET_RENTS', response.data)
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
    },
    SET_APPERROR: (state, message) => {
      state.appError = message;
    }
  },
  getters: {
    isAuthenticated(state) {
      return !!state.authToken;
    }
  },
  modules: {},
});
