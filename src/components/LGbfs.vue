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
    }
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

<style>
  .bike-icon {
    background-image: url('../assets/bike_icon.png');
  }

  .station-icon-inner {
    background: white;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    border-radius: 10px;
    font-weight: bold;
    position: relative;
    top: 3px;
    left: 3px;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
  }

  .station-icon-ring {
    width: 26px;
    height: 26px;
    border-radius: 13px;
  }

  .station-icon-empty {
    background: white;
    color: silver;
  }
</style>