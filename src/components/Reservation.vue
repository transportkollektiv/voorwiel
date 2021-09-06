<template>
  <v-dialog v-model="show" max-width="400">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2" primary-title>
        {{ $t("message.reservation.title") }}
      </v-card-title>
      <v-card-actions>
        <v-form v-model="valid" ref="reservationForm">
          <v-container class="pb-0">
            <v-row class="pt-5">
              <v-col cols="12" md="12" class="py-0 pr-0">
                Start Zeit
                <date-time-picker-dialog
                  :placeholder="startPlaceholder"
                  @newDateTime="startDateTime=$event"
                ></date-time-picker-dialog>
              </v-col>
              <v-col cols="1" md="1" class="py-0 text-right"> </v-col>
            </v-row>
            <v-row class="pt-5">
              <v-col cols="12" md="12" class="py-0 pr-0">
                End Zeit
                <date-time-picker-dialog
                  :placeholder="endPlaceholder"
                  @newDateTime="endDateTime=$event"
                ></date-time-picker-dialog>
              </v-col>
            </v-row>
            <v-row class="pt-5">
              <v-col cols="12" md="12" class="py-0 pr-0">
                <v-select
                  :items="availableStations"
                  :label="$t('message.reservation.station')"
                  item-text="name"
                  item-value="station_id"
                  v-model="station"
                  required
                ></v-select>
              </v-col>
              <v-col cols="1" md="1" class="py-0 text-right">
              </v-col>
            </v-row>
            <v-row class="pt-5">
              <v-col cols="1" md="1" class="py-0 text-right">
                <v-btn
                  class="mt-2"
                  color="success"
                  :disabled="!valid"
                  :loading="loading"
                  @click="startReservation()"
                >
                  {{ $t("message.reservation.create") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import DateTimePickerDialog from "./DateTimePickerDialog.vue";
export default {
  components: { DateTimePickerDialog },
  data() {
    return {
      show: true,
      loading: false,
      valid: false,
      availableStations: [],
      station: null,
      startPlaceholder: "Startzeit",
      endPlaceholder: "Endzeit",
      startDateTime: "",
      endDateTime: "",
    };
  },
  computed: {
    ...mapState(['gbfs'])
  },
  methods: {
    startReservation() {
      let payload = {
          startDate: this.startDateTime,
          endDate: this.endDateTime,
          startStationId: this.station,
      }
      this.$store.dispatch("START_RESERVATION", payload).then(
          () => {
              this.$router.push("/");
          }
      )
    },
    fetchStations() {
      this.availableStations = this.$store.getters.getGBFSStationsWithDetails();
    }
  },
  mounted() {
    if (this.gbfs !== null) {
      this.fetchStations();
    }
  },
  watch: {
    show(current) {
      if (current === false) {
        this.$router.push("/");
      }
    },
  },
};
</script>
