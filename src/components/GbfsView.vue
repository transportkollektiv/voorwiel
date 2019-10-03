<template>
  <l-map :zoom="zoom" :center="center" style="z-index: 0;">
    <l-tile-layer :url="url" :attribution="attribution" />
    <l-gbfs :gbfsURL="gbfsURL" ref="gbfsLayer" />
  </l-map>
</template>

<script>
  import { mapState } from 'vuex';
  import { latLng } from "leaflet";
  import LGbfs from "./LGbfs.vue";

  export default {
    name: 'gbfs-view',
    components: {LGbfs},
    computed: {
      ...mapState(['rents'])
    },
    data() {
      return {
        zoom: this.$appConfig.DEFAULT_ZOOM,
        center: latLng.apply(null, this.$appConfig.DEFAULT_LOCATION),
        url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        gbfsURL: this.$appConfig.GBFS_URL,
      }
    },
    watch: {
      rents() {
        this.$refs.gbfsLayer.update();
      }
    }
  };
</script>
