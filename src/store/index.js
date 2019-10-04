import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const removeSearchFromUrl = (url) => {
  let a = document.createElement('a');
  a.href = url;
  a.search = '';
  return a.href;
};

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
  return new Promise(resolve => resolve({}))
}

const LS_AUTH_TOKEN_KEY = 'authToken';

export default new Vuex.Store({
  state: {
    authToken: null,
    user: undefined,
    rents: []
  },
  actions: {
    IS_AUTHENTICATED: function({ dispatch, getters }) {
      if (!getters.isAuthenticated) {
        return dispatch("LOAD_AUTH_TOKEN")
          .then(() => dispatch("GET_USER"));
      }
      return Promise.resolve();
    },
    GET_USER: function({ commit, state, getters }) {
      return new Promise((resolve, reject) => {
        if (!getters.isAuthenticated) { reject(); return; }
        axiosWithAuth.call(this, state)
          .get('/user')
          .then(
            response => {
              commit("SET_USER", { user: response.data });
              resolve();
            },
            err => {
              if (err.response && err.response.status == 401) {
                commit("CLEAR_USER");
              }
              reject();
            }
          )
      });
    },
    LOAD_AUTH_TOKEN: function({ commit }) {
      return new Promise((resolve, reject) => {
        if (location.search) {
          let params = new URLSearchParams(location.search);
          if (params.get('token')) {
            commit("SET_AUTH_TOKEN", params.get('token'));
            history.replaceState({}, '', removeSearchFromUrl(location.href));
            resolve();
            return;
          }
        }

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
      if (location.search) {
        let params = new URLSearchParams(location.search);
        if (params.get('token')) {
          window.location.search = "";
          return;
        }
      }
    },
    START_RENT: function({ dispatch }, bikeNumber) {
      return getCurrentPosition({
          timeout: 3000,
          enableHighAccuracy: true,
          maximumAge: 20000
        }).then((location) => {
        return dispatch("START_RENT_INTERNAL", bikeNumber, location);
      }).catch(() => {
        return dispatch("START_RENT_INTERNAL", bikeNumber);
      });
    },
    START_RENT_INTERNAL: function({ dispatch, state }, bikeNumber, location) {
      return new Promise((resolve, reject) => {
        let data = {bike_number: bikeNumber};
        if (location && location.coords && location.coords.accuracy < 20) {
          data['lat'] = location.coords.latitude;
          data['lng'] = location.coords.longitude;
        }
        axiosWithAuth.call(this, state)
          .post('/rent/start', data)
          .then(
            response => {
              dispatch("UPDATE_RENTS")
              resolve(response.data)
            },
            err => {
              if (err.response && err.response.data && err.response.data.error) {
                return reject(err.response.data.error);
              }
              if (err.response && err.response.data && err.response.data.detail) {
                return reject(err.response.data.detail);
              }
              reject(err)
            });
      });
    },
    END_RENT: function({ dispatch }, rentId) {
      return getCurrentPosition({
          timeout: 3000,
          enableHighAccuracy: true,
          maximumAge: 20000
        }).then((location) => {
        return dispatch("END_RENT_INTERNAL", rentId, location);
      }).catch(() => {
        return dispatch("END_RENT_INTERNAL", rentId);
      });
    },
    END_RENT_INTERNAL: function({ dispatch, state }, rentId, location) {
      return new Promise((resolve, reject) => {
        let data = {rent_id: rentId};
        if (location && location.coords && location.coords.accuracy < 20) {
          data['lat'] = location.coords.latitude;
          data['lng'] = location.coords.longitude;
        }
        axiosWithAuth.call(this, state)
          .post('/rent/finish', data)
          .then(
            response => {
              dispatch("UPDATE_RENTS")
              resolve(response.data)
            },
            err => {
              if (err.response && err.response.data && err.response.data.error) {
                return reject(err.response.data.error);
              }
              if (err.response && err.response.data && err.response.data.detail) {
                return reject(err.response.data.detail);
              }
              reject(err)
            });
      })
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
    }
  },
  getters: {
    isAuthenticated(state) {
      return !!state.authToken;
    }
  },
  modules: {},
});
