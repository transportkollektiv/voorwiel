<template>
  <div id="attach-sheet">
    <v-bottom-sheet v-model="show" inset eager hide-overlay attach="#attach-sheet" transition="none">
      <v-sheet height="160px">
        <v-card-title v-if="!hasData" class="pb-3">
          <v-skeleton-loader type="list-item-avatar" width="100%"></v-skeleton-loader>
        </v-card-title>

        <v-card-title v-if="hasData" class="pb-3">
          <v-avatar color="primary" size="48" v-if="!electric">
            <v-icon size="32">{{ icon }}</v-icon>
          </v-avatar>

          <v-badge v-if="electric" bordered overlap color="yellow">
            <template v-slot:badge>
              <v-icon size="12">{{ iconFlash }}</v-icon>
            </template>
            <v-avatar color="primary" size="48">
              <v-icon size="32">{{ icon }}</v-icon>
            </v-avatar>
          </v-badge>

          <span style="font-weight: normal;" class="ms-4">{{ description }}</span>

          <div class="range text-body-2" v-if="hasRange">
            <v-icon size="24">{{ batteryIcon }}</v-icon>
            {{ range }}
          </div>
        </v-card-title>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import * as convert from 'convert-units';
  import {
    mdiBicycle,
    mdiBicycleBasket,
    mdiScooter,
    mdiCar,
    mdiMoped,
    mdiBus,
    mdiFlash,
    mdiBatteryHigh,
    mdiBatteryMedium,
    mdiBatteryLow,
    mdiBatteryOutline,
    mdiBatteryUnknown
  } from "@mdi/js";

  export default {
    props: ['id'],
    data() {
      return {
        show: true,
        routeUpdateHappened: false,
        hasData: false,
        iconFlash: mdiFlash,
        bike: undefined,
        vehicle_type: undefined
      }
    },
    computed: {
      icon() {
        if (typeof this.vehicle_type === "undefined") return mdiBicycle;
        if (this.vehicle_type.form_factor === "bike") {
          if (this.vehicle_type.name.toLowerCase().includes("cargo")) return mdiBicycleBasket;
          else return mdiBicycle;
        }
        if (this.vehicle_type.form_factor === "scooter") return mdiScooter;
        if (this.vehicle_type.form_factor === "car") return mdiCar;
        if (this.vehicle_type.form_factor === "moped") return mdiMoped;
        if (this.vehicle_type.form_factor === "other") return mdiBus;
        return mdiBicycle;
      },
      batteryIcon() {
        if (typeof this.vehicle_type === "undefined") return mdiBatteryUnknown;
        if (typeof this.vehicle_type.max_range_meters === "undefined" || this.vehicle_type.max_range_meters == 0) return mdiBatteryUnknown;
        let currentCharge = this.bike.current_range_meters / this.vehicle_type.max_range_meters;
        if (currentCharge >= 0.66) return mdiBatteryHigh;
        if (currentCharge >= 0.33) return mdiBatteryMedium;
        if (currentCharge >= 0.1) return mdiBatteryLow;
        return mdiBatteryOutline;
      },
      hasRange() {
        if (typeof this.bike.current_range_meters === "undefined") return false;
        if (typeof this.vehicle_type === "undefined") return false;
        if (typeof this.vehicle_type.max_range_meters === "undefined" || this.vehicle_type.max_range_meters == 0) return false;
        return true;
      },
      range() {
        if (!this.hasRange) return "?";

        if (this.bike.current_range_meters <= 0) return this.$t('message.detail.no-range');

        let range = convert(this.bike.current_range_meters).from('m').toBest();
        return this.$t('message.detail.range', {value: range.val, unit: range.unit});
      },
      description() {
        if (typeof this.vehicle_type === "undefined") return "";
        return this.vehicle_type.name;
      },
      electric() {
        if (typeof this.vehicle_type === "undefined") return false;
        if (this.vehicle_type.propulsion_type === "electric" ||
          this.vehicle_type.propulsion_type === "electric_assist") {
          return true;
        }
        return false;
      },
      ...mapState(['gbfs'])
    },
    methods: {
      loadDetailFromGbfs() {
        this.hasData = false;

        let bike = this.$store.getters.getGBFSBikeWithDetails(this.id);
        if (bike !== null) {
          this.hasData = true;
          this.bike = bike.bike;
          this.vehicle_type = bike.vehicle_type;
        } else {
          this.hasData = false;
        }
      }
    },
    mounted() {
      if (this.gbfs !== null) {
        this.loadDetailFromGbfs();
      }
    },
    watch: {
      show(current) {
        if (current === false && this.routeUpdateHappened) {
          // from detail view of one vehicle to another
          this.routeUpdateHappened = false;
          this.$nextTick(() => {
            this.show = true;
          });
        } else if (current === false && !this.routeUpdateHappened) {
          // closing because of click on background
          this.$router.push('/');
        }
      },
      $route(to) {
        // displaying another vehicle
        if (to.name == 'vehicle') {
          this.routeUpdateHappened = true;
          this.loadDetailFromGbfs();
        }
      },
      gbfs() {
        this.loadDetailFromGbfs();
      }
    }
  };
</script>

<style>
  .v-avatar .v-icon {
    border-radius: 0;
  }
  .range {
    flex: 1 1 auto;
    font-weight: normal;
    text-align: right;
  }
</style>
