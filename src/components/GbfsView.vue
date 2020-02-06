<template>
  <l-map :zoom="zoom" :center="center" style="z-index: 0;">
    <l-tile-layer :url="url" :attribution="attribution" />
    <l-gbfs :gbfsURL="gbfsURL" :bikeMarkerColor="this.$vuetify.theme.currentTheme.primary" ref="gbfsLayer" v-on:error="handleGBFSError" />
    <v-locatecontrol :options="locateOptions" />
  </l-map>
</template>

<script>
  import { mapState } from 'vuex';
  import { latLng } from "leaflet";
  import { LMap, LTileLayer } from 'vue2-leaflet';
  import LGbfs from "./LGbfs.vue";
  import Vue2LeafletLocatecontrol from 'vue2-leaflet-locatecontrol/Vue2LeafletLocatecontrol'

  export default {
    name: 'gbfs-view',
    components: {
      'l-map': LMap,
      'l-tile-layer': LTileLayer,
      'l-gbfs': LGbfs,
      'v-locatecontrol': Vue2LeafletLocatecontrol,
    },
    computed: {
      ...mapState(['rents'])
    },
    data() {
      return {
        zoom: this.$appConfig.DEFAULT_ZOOM,
        center: latLng.apply(null, this.$appConfig.DEFAULT_LOCATION),
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
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
      }
    }
  };
</script>

<style>
.station-icon-inner {
  background: var(--v-primary-base);
  color: #333;
}
</style>
