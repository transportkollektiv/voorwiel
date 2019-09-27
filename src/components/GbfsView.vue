<template>
  <l-map :zoom="zoom" :center="center">
    <l-tile-layer :url="url" :attribution="attribution" />
    <l-gbfs :gbfsURL="gbfsURL" />
  </l-map>
</template>

<script>
  import { latLng } from "leaflet";
  import LGbfs from "./LGbfs.vue";

  export default {
    name: 'gbfs-view',
    components: {LGbfs},
    data() {
      return {
      zoom: this.$appConfig.DEFAULT_ZOOM,
      center: latLng.apply(null, this.$appConfig.DEFAULT_LOCATION),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      gbfsURL: this.$appConfig.GBFS_URL,
      mapOptions: {
        zoomSnap: 0.5
      }
    }
  },

  };
</script>
