<template>
  <l-map :zoom="zoom" :center="center" style="z-index: 0;">
    <l-tile-layer :url="url" :attribution="attribution" />
    <l-gbfs :gbfsURL="gbfsURL"
            :bikeMarkerColor="this.$vuetify.theme.currentTheme.primary"
            :showStationPopup="false"
            :showBikePopup="false"
            ref="gbfsLayer"
            v-on:error="handleGBFSError"
            v-on:data="handleGBFSData"
            v-on:bikeClick="handleBikeClick"
            v-on:stationClick="handleStationClick" />
    <l-locate-control :options="locateOptions" />
  </l-map>
</template>

<script>
  import { mapState } from 'vuex';
  import { latLng } from "leaflet";
  import { LMap, LTileLayer } from 'vue2-leaflet';
  import LGbfs from "./LGbfs.vue";
  import LLocateControl from 'vue2-leaflet-locatecontrol'

  export default {
    name: 'GbfsView',
    components: {
      LMap,
      LTileLayer,
      LGbfs,
      LLocateControl,
    },
    computed: {
      ...mapState(['rents'])
    },
    data() {
      return {
        zoom: this.$appConfig.DEFAULT_ZOOM,
        center: latLng.apply(null, this.$appConfig.DEFAULT_LOCATION),
        url: "https://osm-demo-{s}.wheregroup.com/tiles/1.0.0/osm/webmercator/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Tiles by <a href="https://wheregroup.com/">WhereGroup</a>',
        gbfsURL: this.$appConfig.GBFS_URL,
        locateOptions: {
          icon: "mdi mdi-near-me",
          iconLoading: "mdi mdi-loading mdi-spin"
        }
      }
    },
    watch: {
      rents() {
        if (this.$refs.gbfsLayer) {
          this.$refs.gbfsLayer.update();
        }
      }
    },
    methods: {
      handleGBFSError() {
        this.$store.commit('SET_APPERROR', this.$t('message.gbfsview.error'));
      },
      handleGBFSData(d) {
        this.$store.commit('SET_GBFS', d);
      },
      handleBikeClick(d) {
        this.$router.push('/v/' + d.bike.bike_id)
      },
      handleStationClick(d) {
        this.$router.push('/s/' + d.station.station_id)
      }
    }
  };
</script>

<style>
.mdi {  display: inline-block; line-height: 30px; }

.mdi:before {
  content: '';
  width: 16px;
  height: 16px;
  display: inline-block;
  font: normal normal normal 24px/1 sans-serif;
  font-size: inherit;
  text-rendering: auto;
  line-height: inherit;
  background-size: contain;
}

/* this is weird and contains our primary color. but it seems that we don't have access to the variable in scss here, so we couln't construct the string */
/* another method would be to overwrite l.control.locates createButtonCallback and inject the svg there, but, well ¯\_(ツ)_/¯  */
.mdi-near-me:before {
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M21,3L3,10.53V11.5L9.84,14.16L12.5,21H13.46L21,3Z' fill='%2399d420' /%3E%3C/svg%3E");
}

.mdi-near-me:hover:before {
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M21,3L3,10.53V11.5L9.84,14.16L12.5,21H13.46L21,3Z' fill='black' /%3E%3C/svg%3E");
}

.leaflet-control-locate.active .mdi-near-me:before {
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M21,3L3,10.53V11.5L9.84,14.16L12.5,21H13.46L21,3Z' fill='%232074b6' /%3E%3C/svg%3E");
}

.leaflet-control-locate.active.following .mdi-near-me:before {
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M21,3L3,10.53V11.5L9.84,14.16L12.5,21H13.46L21,3Z' fill='%23fc8428' /%3E%3C/svg%3E");
}

.mdi-loading:before {
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z' /%3E%3C/svg%3E");
}

@-webkit-keyframes mdi-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}
@keyframes mdi-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}
.mdi-spin:before {-webkit-animation:mdi-spin 2s infinite linear;animation:mdi-spin 2s infinite linear}
</style>
