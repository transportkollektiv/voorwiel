<template>
  <div style="display: none">
    <slot v-if="ready"></slot>
  </div>
</template>

<script>
  import LGBFS from '@stadtulm/leaflet-gbfs';
  import { findRealParent } from 'vue2-leaflet';

  const props = {
    gbfsURL: {
      type: String,
      custom: true,
    },
    language: {
      type: String,
      custom: true,
      default: null
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
      this.mapObject = new LGBFS(this.$props);
      this.ready = true;
      this.parentContainer = findRealParent(this.$parent);
      this.parentContainer.addLayer(this);
      this.mapObject.on('error', (function(ev) {
        this.$emit('error', ev);
      }).bind(this));
    },
    beforeDestroy() {
      this.parentContainer.removeLayer(this);
    },
    methods: {
      update() {
        this.mapObject.update();
      }
    }
  };
</script>

<style>
@import "~@stadtulm/leaflet-gbfs/dist/L.GBFS.css";

.station-icon-inner {
  background: var(--v-primary-base);
  color: #333;
}
</style>
