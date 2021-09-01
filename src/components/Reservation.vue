<template>
  <v-dialog v-model="show" max-width="400">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2" primary-title>
        {{ $t("message.reservation.title") }}
      </v-card-title>
      <v-card-actions>
        <v-form v-model="valid" ref="reservationForm" @submit.prevent="startRent">
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
                <v-text-field
                  type="text"
                  :label="$t('message.reservation.station')"
                  v-model="station"
                  outlined
                  required
                  autofocus
                  inputmode="text"
                  pattern="[0-9a-zA-Z]*"
                ></v-text-field>
              </v-col>
              <v-col cols="1" md="1" class="py-0 text-right">
              </v-col>
            </v-row>
            <v-row class="pt-5">
              <v-col cols="1" md="1" class="py-0 text-right">
                <v-btn
                  class="mt-2"
                  color="success"
                  v-bind:disabled="!valid"
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
import DateTimePickerDialog from "./DateTimePickerDialog.vue";
export default {
  components: { DateTimePickerDialog },
  data() {
    return {
      show: true,
      loading: false,
      valid: false,
      endTime: "",
      station: "",
      startPlaceholder: "Startzeit",
      endPlaceholder: "Endzeit",
      startDateTime: "",
      endDateTime: "",
    };
  },
  methods: {
    startReservation() {
      let payload = {
          startDate: this.startDateTime[0],
          startTime: this.startDateTime[1],
          endDate: this.endDateTime[0],
          endTime: this.endDateTime[1],
          startStationId: this.station
      }
      this.$store.dispatch("START_RESERVATION", payload).then(
          () => {
              this.$router.push("/");
          }
      )
    },
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
