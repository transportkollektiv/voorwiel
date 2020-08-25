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

  // generator for:
  // this.mapObject.on('stationClick', (ev) => this.$emit('stationClick', { station: ev.station, status: ev.status }));
  const forwardEvent = (mapObject, c, name, params) => {
    mapObject.on(name, (ev) => {
      let data = {};
      for (var p of params) {
        data[p] = ev[p];
      }
      c.$emit(name, data);
    });
  };

  export default {
    name: 'LGbfs',
    props,
    mounted() {
      this.mapObject = new LGBFS(this.$props);
      this.parentContainer = findRealParent(this.$parent);
      this.parentContainer.addLayer(this);
      this.mapObject.on('error', (ev) => this.$emit('error', ev));
      forwardEvent(this.mapObject, this, 'data', ['stations', 'stationStatus', 'freeBikeStatus', 'vehicleTypes']);
      forwardEvent(this.mapObject, this, 'bikeClick', ['bike']);
      forwardEvent(this.mapObject, this, 'stationClick', ['station', 'status']);
    },
    beforeDestroy() {
      this.parentContainer.removeLayer(this);
    },
    methods: {
      update() {
        if (!this.mapObject.isUpdating()) {
          this.mapObject.update();
        }
      }
    },
    render() {
      return null;
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
