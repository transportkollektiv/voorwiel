<template>
  <v-dialog v-model="show" max-width="450">
    <v-card>
      <v-form v-model="valid" ref="rentBikeForm" @submit.prevent="startRent">
        <v-container class="pb-0">
          <v-row v-if="rentError">
            <v-col col="12" md="12" class="py-0">
              <v-alert dense outlined type="error" class="my-0">
                {{ rentError }}
              </v-alert>
            </v-col>
          </v-row>
          <v-row class="pt-5">
            <v-col cols="6" md="6" class="py-0 pr-0">
              <v-text-field
                type="text"
                :label="$t('message.rent.bikenumber')"
                v-model="bikenumber"
                outlined
                required
                autofocus
                :rules="bikenumberrules"
                inputmode="numeric"
                pattern="[0-9]*"
              ></v-text-field>
            </v-col>
            <v-col cols="6" md="6" class="py-0 text-right">
              <v-btn
                class="mt-2"
                color="success"
                v-bind:disabled="!valid"
                :loading="loading"
                @click="startRent"
              >
                {{ $t("message.rent.rent") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>

      <v-divider class="mx-4" v-if="rents"></v-divider>

      <v-list-item v-for="rent in rents" :key="rent.id">
        <v-list-item-content>
          <v-list-item-title
            >{{ $t("message.rent.bikenumber") }}:
            {{ rent.bike.bike_number }}</v-list-item-title
          >
          <v-list-item-subtitle v-if="rent.bike.lock_type">
            <RentLock :rent="rent" />
          </v-list-item-subtitle>
          <v-list-item-subtitle
            >{{ $t("message.rent.renting-for") }}
            <ticking-time :datetime="rent.rent_start"
          /></v-list-item-subtitle>
          <v-row class="pt-5">
            <v-col cols="12" md="12" class="py-0 pr-0">
              <div id="app" class="dropdown">
                <label class="dropdownLabel" for="select-location">
                  {{ $t("message.rent.selected-location") }}:
                </label>
                <select
                  class="dropdown-item"
                  @change="changeReturnLocation($event, rent.id)"
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
          <v-row v-if="chosenReturnLocations[rent.id] == null">
            <v-col col="12" md="12" class="py-0">
              <v-alert dense outlined type="error" class="my-0">
                {{ $t("message.rent.no-location") }}
              </v-alert>
            </v-col>
          </v-row>
          <v-btn
            v-if="chosenReturnLocations[rent.id] != null"
            color="success"
            @click="endRent(rent.id)"
            v-bind:loading="loadingRents.includes(rent.id)"
          >
            {{ $t("message.rent.finish-rent") }}
          </v-btn>
          <!--
          <div>
            <ejs-dropdownbutton :items="items" iconCss="ddb-icons e-message"
              >Message</ejs-dropdownbutton
            >
            <ejs-dropdownbutton
              :items="items"
              iconCss="ddb-icons e-message"
              iconPosition="Top"
              >Message</ejs-dropdownbutton
            >
          </div>
          -->
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import { mdiLock, mdiLockOpenVariant } from "@mdi/js";
import TickingTime from "./TickingTime.vue";
import RentLock from "./RentLock.vue";

import axios from "axios";

//import Vue from "vue";
//import { DropDownButtonPlugin } from "@syncfusion/ej2-vue-splitbuttons";
//import { enableRipple } from "@syncfusion/ej2-base";

//enableRipple(true);
//Vue.use(DropDownButtonPlugin);

export default {
  components: { TickingTime, RentLock },
  props: ["bikeId"],
  data() {
    return {
      /*
      items: [
        {
          text: "Edit",
        },
        {
          text: "Delete",
        },
        {
          text: "Mark as Read",
        },
        {
          text: "Like Message",
        },
      ],
      */
      show: true,
      valid: false,
      loading: false,
      bikenumber: "",
      rentError: "",
      emptyStationError: "",
      loadingRents: [],

      bikenumberrules: [
        (value) => {
          const pattern = /\d+$/;
          if (value === "" || typeof value === "undefined") return true;
          return pattern.test(value) || "Please only numbers";
        },
      ],

      mdi: {
        lock: mdiLock,
        lockOpenVariant: mdiLockOpenVariant,
      },
      availableStations: [],
      // dictionary which associates rentids with their selected return location
      chosenReturnLocations: {},
    };
  },
  computed: {
    ...mapState(["rents"]),
  },
  created() {
    this.fetchStations();
  },
  methods: {
    startRent() {
      this.loading = true;
      this.rentError = "";
      this.$store
        .dispatch("START_RENT", this.bikenumber)
        .then(
          () => this.$refs.rentBikeForm.reset(),
          (err) => (this.rentError = err)
        )
        .finally(() => (this.loading = false));
    },
    endRent(rentId) {
      let coords = this.chosenReturnLocations[rentId];
      console.log(rentId);
      console.log(coords.lat);
      console.log(coords.lng);
      this.rentError = "";
      this.loadingRents.push(rentId);

      this.$store
        .dispatch("END_RENT", {
          rentId: rentId,
          lat: coords.lat,
          lng: coords.lng,
        })
        .then(() => {
          // set selected location to null if end_rent returned without error
          if (this.rentError === "") {
            delete this.chosenReturnLocations[rentId];
          }
        })
        .catch((err) => {
          this.rentError = err;
          let index = this.loadingRents.indexOf(rentId);
          if (index >= 0) {
            this.loadingRents.splice(index, 1);
          }
        });
    },
    changeReturnLocation(event, rentId) {
      let selectedStation =
        event.target.options[event.target.options.selectedIndex].text;

      for (var index in this.availableStations) {
        if (this.availableStations[index].name === selectedStation) {
          // END REMOVE
          this.chosenReturnLocations[rentId] = {
            lng: this.availableStations[index].location.lng,
            lat: this.availableStations[index].location.lat,
            location:
              event.target.options[event.target.options.selectedIndex].text,
          };
          break;
        }
      }
    },
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
  },
  mounted() {
    this.bikenumber = this.bikeId;
  },
  watch: {
    show(current) {
      if (current === false) {
        this.$router.push("/");
        if (this.$refs.rentBikeForm) {
          this.$refs.rentBikeForm.reset();
        }
        this.rentError = "";
      }
    },
  },
};
</script>

<style>
/*
@import "../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "../node_modules/@syncfusion/ej2-popups/styles/material.css";
@import "../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
@font-face {
  font-family: "e-db-icons";
  src: url(data:application/x-font-ttf;charset=utf-8;base64,AAEAAAAKAIAAAwAgT1MvMj0jSRoAAAEoAAAAVmNtYXDnFudgAAABkAAAADpnbHlmSrKTCAAAAdgAAAC4aGVhZBKtK8cAAADQAAAANmhoZWEHmQNtAAAArAAAACRobXR4D7gAAAAAAYAAAAAQbG9jYQB4ADoAAAHMAAAACm1heHABEAAYAAABCAAAACBuYW1lH00mDAAAApAAAAJJcG9zdIwkSr0AAATcAAAATQABAAADUv9qAFoEAAAA//4D6gABAAAAAAAAAAAAAAAAAAAABAABAAAAAQAAGc/PS18PPPUACwPoAAAAANfSc3wAAAAA19JzfAAAAAAD6gPqAAAACAACAAAAAAAAAAEAAAAEAAwAAgAAAAAAAgAAAAoACgAAAP8AAAAAAAAAAQPuAZAABQAAAnoCvAAAAIwCegK8AAAB4AAxAQIAAAIABQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUGZFZABA5wPnBQNS/2oAWgPqAJYAAAABAAAAAAAABAAAAAPoAAAD6AAAA+gAAAAAAAIAAAADAAAAFAADAAEAAAAUAAQAJgAAAAQABAABAADnBf//AADnA///AAAAAQAEAAAAAQACAAMAAAAAAAAAHAA6AFwAAAACAAAAAAPqA2UABgAKAAA3IREjCQEjBRcBIQID6AL+Dv4NAQEY3QG4/I+IAsL+GAHonroBcwAAAAIAAAAAA8YD6gAFAAoAADchESMJASUHCQImA6AD/jL+MQEEywGWAZb+agICX/4+AcLXsv6cAWQBZAAAAAEAAAAAA+oD6gALAAATCQEXCQE3CQEnCQECATP+zcIBMgEzwf7OATLB/s3+zgMp/s3+zsIBM/7NwgEyATPB/s4BMgAAAAASAN4AAQAAAAAAAAABAAAAAQAAAAAAAQAKAAEAAQAAAAAAAgAHAAsAAQAAAAAAAwAKABIAAQAAAAAABAAKABwAAQAAAAAABQALACYAAQAAAAAABgAKADEAAQAAAAAACgAsADsAAQAAAAAACwASAGcAAwABBAkAAAACAHkAAwABBAkAAQAUAHsAAwABBAkAAgAOAI8AAwABBAkAAwAUAJ0AAwABBAkABAAUALEAAwABBAkABQAWAMUAAwABBAkABgAUANsAAwABBAkACgBYAO8AAwABBAkACwAkAUcgZS1kYi1pY29uc1JlZ3VsYXJlLWRiLWljb25zZS1kYi1pY29uc1ZlcnNpb24gMS4wZS1kYi1pY29uc0ZvbnQgZ2VuZXJhdGVkIHVzaW5nIFN5bmNmdXNpb24gTWV0cm8gU3R1ZGlvd3d3LnN5bmNmdXNpb24uY29tACAAZQAtAGQAYgAtAGkAYwBvAG4AcwBSAGUAZwB1AGwAYQByAGUALQBkAGIALQBpAGMAbwBuAHMAZQAtAGQAYgAtAGkAYwBvAG4AcwBWAGUAcgBzAGkAbwBuACAAMQAuADAAZQAtAGQAYgAtAGkAYwBvAG4AcwBGAG8AbgB0ACAAZwBlAG4AZQByAGEAdABlAGQAIAB1AHMAaQBuAGcAIABTAHkAbgBjAGYAdQBzAGkAbwBuACAATQBlAHQAcgBvACAAUwB0AHUAZABpAG8AdwB3AHcALgBzAHkAbgBjAGYAdQBzAGkAbwBuAC4AYwBvAG0AAAAAAgAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAQIBAwEEAQUADG1lc3NhZ2UtbWFpbAtyZWFkLXVucmVhZAZkZWxldGUAAAAAAA==)
    format("truetype");
  font-weight: normal;
  font-style: normal;
}
.ddb-icons {
  font-family: "e-db-icons" !important;
  speak: none;
  font-size: 55px;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.e-message::before {
  content: "\e703";
}
*/
.rent-unlock-key {
  font-family: monospace;
  font-size: 20px;
  font-weight: bold;
}
.dropdown {
  font-family: monospace;
  font-size: 20px;
  font-weight: normal;
}
.dropdown-item{
  /*width: 100%;*/
  -webkit-appearance: auto;
  font-family: monospace;
  font-size: 18px;
  font-weight: normal;
  padding: 1.5%;
}
</style>
