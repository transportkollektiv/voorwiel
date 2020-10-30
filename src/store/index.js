import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import config from '../config';

Vue.use(Vuex);

const axiosWithAuth = function (state) {
  return axios.create({
    baseURL: config.API_ROOT,
    headers: { 'Authorization': `Token ${state.authToken}` }
  })
}

const getCurrentPosition = (options) => {
  if (navigator.geolocation) {
    return new Promise(
      (resolve, reject) => {
        let timeout = options.timeout || 5000;
        let rejected = false;
        let pt = setTimeout(() => { rejected = true; reject(); }, timeout);
        navigator.geolocation.getCurrentPosition(
          (pos) => { clearTimeout(pt); if (!rejected) resolve(pos); },
          (err) => { clearTimeout(pt); if (!rejected) reject(err); },
          options);
      }
    )
  }
  return Promise.reject();
}

const unpackErrorMessage = (err) => {
  if (err.response && err.response.data && err.response.data.error) {
    throw err.response.data.error;
  }
  if (err.response && err.response.data && err.response.data.detail) {
    throw err.response.data.detail;
  }
  if (err.response && err.response.data && err.response.data.message) {
    throw err.response.data.message;
  }
  throw err;
};

const LS_AUTH_TOKEN_KEY = 'authToken';

export default new Vuex.Store({
  state: {
    authToken: null,
    user: undefined,
    rents: [],
    appError: '',
    gbfs: null,
    lock: {},
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
      commit("CLEAR_USER");
    },
    START_RENT: async function({ dispatch, state }, bikeNumber) {
      let location;
      try {
        location = await getCurrentPosition({ timeout: 3000, enableHighAccuracy: true, maximumAge: 20000 });
      } catch (_ignore) { /* */ }

      let data = { bike: bikeNumber };
      if (location && location.coords && location.coords.accuracy < 20) {
        data['lat'] = location.coords.latitude;
        data['lng'] = location.coords.longitude;
      }

      try {
        let response = await axiosWithAuth.call(this, state).post('/rent', data);
        dispatch("UPDATE_RENTS");
        return response.data;
      } catch (err) {
        throw unpackErrorMessage(err);
      }
    },
    END_RENT: async function({ dispatch, commit, state }, rentId) {
      let location;
      try {
        location = await getCurrentPosition({ timeout: 3000, enableHighAccuracy: true, maximumAge: 20000 });
      } catch(_ignore) { /* */ }

      let data = {};
      if (location && location.coords && location.coords.accuracy < 50) {
        data['lat'] = location.coords.latitude;
        data['lng'] = location.coords.longitude;
      }

      try {
        let finish_url = state.rents.find((el) => el.id == rentId).finish_url;
        let response = await axiosWithAuth.call(this, state).post(finish_url, data);
        dispatch("UPDATE_RENTS");
        commit("REMOVE_LOCK", rentId);
        return response.data;
      } catch (err) {
        throw unpackErrorMessage(err);
      }
    },
    UPDATE_RENTS: function({ commit, state, getters }) {
      if (!getters.isAuthenticated) { return; }
      axiosWithAuth.call(this, state)
        .get('/rent')
        .then(response => {
          commit('SET_RENTS', response.data)
        })
    },
    RENT_UNLOCK: async function({ commit, state }, rentId) {
      try {
        let unlock_url = state.rents.find((el) => el.id == rentId).unlock_url;
        let response = await axiosWithAuth.call(this, state).post(unlock_url);
        if (response.data.success) {
          commit("SET_LOCK", { rentId: rentId, data: response.data.data });
          return response.data.data;
        } else {
          throw { response };
        }
      } catch (err) {
        throw unpackErrorMessage(err);
      }
    }
  },
  mutations: {
    CLEAR_USER: (state) => {
      state.authToken = null;
      state.user = undefined;
      state.rents = [];
      state.lock = [];
      localStorage.removeItem(LS_AUTH_TOKEN_KEY);
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
    SET_LOCK: (state, { rentId, data }) => {
      Vue.set(state.lock, rentId, data);
    },
    REMOVE_LOCK: (state, rentId) => {
      if (Object.prototype.hasOwnProperty.call(state.lock, rentId)) {
        delete state.lock[rentId];
      }
    },
    SET_APPERROR: (state, message) => {
      state.appError = message;
    },
    SET_GBFS: (state, data) => {
      state.gbfs = data;
    }
  },
  getters: {
    isAuthenticated(state) {
      return !!state.authToken;
    },
    getGBFSBikeWithDetails: (state) => (id) => {
      let bike = state.gbfs.freeBikeStatus.data.bikes.find((b) => b.bike_id == id);
      if (typeof bike === "undefined") return null;
      if (typeof bike.vehicle_type_id !== "undefined" && typeof state.gbfs.vehicleTypes !== "undefined") {
        let vehicle_type = state.gbfs.vehicleTypes.data.vehicle_types.find((vt) => vt.vehicle_type_id == bike.vehicle_type_id);
        return {bike, vehicle_type};
      }
      return {bike};
    },
    getGBFSStationWithDetails: (state) => (id) => {
      let station = state.gbfs.stations.data.stations.find((s) => s.station_id == id);
      if (typeof station === "undefined") return null;
      let station_status = state.gbfs.stationStatus.data.stations.find((s) => s.station_id == station.station_id);
      if (typeof station_status !== "undefined") {
        if (typeof station_status.vehicle_docks_available !== "undefined" ||
            typeof station_status.vehicles.find((v) => typeof v.vehicle_type_id !== "undefined") !== "undefined") {
          let vehicle_types = state.gbfs.vehicleTypes.data.vehicle_types;
          return {station, station_status, vehicle_types};
        }
        return {station, station_status};
      }
      return {station};
    }
  },
  modules: {},
});
