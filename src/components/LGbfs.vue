<template>
  <div style="display: none">
    <slot v-if="ready"></slot>
  </div>
</template>

<script>
  import L from 'leaflet';
  import 'leaflet-gbfs';
  import { findRealParent } from 'vue2-leaflet';

  const props = {
    gbfsURL: {
      type: String,
      custom: true,
    },
    language: {
      type: String,
      custom: true,
      default: 'en'
    },
    interval: {
      type: Number,
      custom: true,
      default: 60 * 1000
    },
    onlyRunWhenAdded: {
      type: Boolean,
      custom: true,
      default: false
    },
    bikeMarkerColor: {
      type: String,
      custom: true,
      default: 'rgb(87, 162, 255)'
    },
    bikeMarkerBgColor: {
      type: String,
      custom: true,
      default: 'white'
    },
    showStationPopup: {
      type: Boolean,
      custom: true,
      default: true
    },
    showBikePopup: {
      type: Boolean,
      custom: true,
      default: true
    },
  };

  export default {
    name: 'l-gbfs',
    props,
    data: () => ({
      ready: false
    }),
    mounted() {
      this.mapObject = new L.GBFS(this.$props);
      this.ready = true;
      this.parentContainer = findRealParent(this.$parent);
      this.parentContainer.addLayer(this);
    },
    beforeDestroy() {
      this.parentContainer.removeLayer(this);
    },
  };
</script>
