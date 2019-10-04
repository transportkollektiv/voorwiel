<template>
  <l-map :zoom="zoom" :center="center" style="z-index: 0;">
    <l-tile-layer :url="url" :attribution="attribution" />
    <l-gbfs :gbfsURL="gbfsURL" ref="gbfsLayer" />
    <v-locatecontrol :options="locateOptions" />
  </l-map>
</template>

<script>
  import { mapState } from 'vuex';
  import { latLng } from "leaflet";
  import LGbfs from "./LGbfs.vue";
  import Vue2LeafletLocatecontrol from 'vue2-leaflet-locatecontrol/Vue2LeafletLocatecontrol'


  export default {
    name: 'gbfs-view',
    components: {
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
        url: "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png",
        attribution: '<a href="https://foundation.wikimedia.org/wiki/Maps_Terms_of_Use">Wikimedia Maps</a> | &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
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
    }
  };
</script>
