<template>
  <v-container class="root-container">
    <v-row class="pt-5">
      <v-col cols="12" md="12" class="py-0 pr-0">
        <div id="app" class="dropdown">
          <label class="dropdownLabel" for="select-location">
            {{ $t("message.rent.selected-location") }}:
          </label>
          <select
            class="dropdown-item"
            @change="changeReturnLocation($event, rentId)"
            @click="fetchStations()"
          >
            <option value="" selected disabled>
              {{ $t("message.rent.choose-locations") }}
            </option>
            <option
              v-for="station in availableStations"
              :value="station.station_id"
              :key="station.station_id"
            >
              {{ station.name }}
            </option>
          </select>
          <br /><br />
        </div>
      </v-col>
    </v-row>
    <v-row v-if="chosenReturnLocation == null">
      <v-col col="12" md="12" class="py-0">
        <v-alert dense outlined type="error" class="my-0">
          {{ $t("message.rent.no-location") }}
        </v-alert>
      </v-col>
    </v-row>
    <v-btn
      v-if="chosenReturnLocation != null"
      color="success"
      @click="endRent(rentId)"
    >
      {{ $t("message.rent.finish-rent") }}
    </v-btn>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: "rent-selectable-return-location",
    // type check values passed to rentId
    props: {rentId: Number},
    data() {
      return {
        availableStations: [],
        chosenReturnLocation: null,
      };
    },
    computed: {
    ...mapState(['gbfs'])
    },
    methods: {
      fetchStations() {
          this.availableStations = this.$store.getters.getGBFSStationsWithDetails();
      },
      changeReturnLocation(event) {
        let selectedStation = this.availableStations.find((s) => s.station_id == event.target.value);
        this.chosenReturnLocation = {
          lon: selectedStation.lon,
          lat: selectedStation.lat,
        };
      },
      endRent(rentId) {
        let coords = {
          lat: this.chosenReturnLocation["lat"],
          lon: this.chosenReturnLocation["lon"],
        };

        this.$store
          .dispatch("END_RENT_NO_TRACKER", { rentId: rentId, lat: coords.lat, lon: coords.lon })
          .then(() => {
            // set selected location to null if end_rent returned without error
            if (this.rentError === "") {
              this.chosenReturnLocation = null;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
    mounted() {
      if (this.gbfs !== null) {
        this.fetchStations();
      }
    },
    beforeDestroy() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    },
  };
</script>

<style scoped>
.root-container {
  padding: 0px;
}
</style>
