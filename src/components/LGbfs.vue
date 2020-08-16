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
.station-icon-inner {
  background: var(--v-primary-base);
  color: #333;
  width: 26px;
  height: 26px;
  text-align: center;
  line-height: 26px;
  border-radius: 13px;
  font-weight: bold;
  position: relative;
  top: 3px;
  left: 3px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
}

.station-icon-ring {
  width: 32px;
  height: 32px;
  border-radius: 16px;
}
</style>
