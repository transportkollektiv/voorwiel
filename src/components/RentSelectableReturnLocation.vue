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
              :value="station.id"
              :key="station.id"
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
import axios from "axios";

export default {
  name: "rent-selectable-return-location",
  // type check values passed to rentId
  props: { rentId: Number },
  data() {
    return {
      availableStations: [],
      chosenReturnLocation: null,
    };
  },
  methods: {
    fetchStations() {
      let url = this.$appConfig.API_ROOT + "/stations/locations";
      axios
        .get(url)
        .then((response) => response.data)
        .then((data) => {
          this.availableStations = data;
        })
        .catch((error) => {
          console.log(error);
          if (error.response) {
            // TODO check response from server ... maybe give user a visual queue when the request failed
          }
        });
    },
    changeReturnLocation(event) {
      let selectedStation = event.target.options[event.target.options.selectedIndex].text;

      for (var index in this.availableStations) {
        if (this.availableStations[index].name === selectedStation) {
          this.chosenReturnLocation = {
            lng: this.availableStations[index].location.lng,
            lat: this.availableStations[index].location.lat,
            location: event.target.options[event.target.options.selectedIndex].text,
          };
          break;
        }
      }
    },
    endRent(rentId) {
      let coords = {
        lat: this.chosenReturnLocation["lat"],
        lng: this.chosenReturnLocation["lng"],
      };

this.$store
        .dispatch("END_RENT_NO_TRACKER", { rentId: rentId, lat: coords.lat, lng: coords.lng })
        .then(() => {
          // set selected location to null if end_rent returned without error
          if (this.rentError === "") {
            this.chosenReturnLocation = null;
          }
        })
        .catch((err) => {
          // TODO do sth useful with the error
          console.log(err);
        });
    },
  },
  created() {
    this.fetchStations();
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
