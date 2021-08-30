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
                <v-menu
                    v-model="menu1"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="400px"
                    min-width="auto"
                    >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                        v-model="computedStartDateFormatted"
                        :label="$t('message.reservation.startDate')"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="startDate"
                        no-title
                        @input="menu1 = false"
                    ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="1" md="1" class="py-0 text-right"> </v-col>
            </v-row>
            <v-row class="pt-5">
              <v-col cols="12" md="12" class="py-0 pr-0">
                <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="400px"
                    min-width="auto"
                    >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                        v-model="computedEndDateFormatted"
                        :label="$t('message.reservation.endDate')"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="endDate"
                        no-title
                        @input="menu2 = false"
                    ></v-date-picker>
                </v-menu>
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
import { DateTimePickerDialog } from "./DateTimePickerDialog.vue";
export default {
  data() {
    return {
      show: true,
      loading: false,
      valid: false,
      startTime: "",
      endTime: "",
      station: "",
      startDate: null,
      endDate: null,
      startDateFormatted: null,
      endDateFormatted: null,
      menu1: false,
      menu2: false,
    };
  },
  computed: {
      computedStartDateFormatted() {
          return this.formatDate(this.startDate)
      },
      computedEndDateFormatted() {
          return this.formatDate(this.endDate)
      }
  },
  methods: {
    startReservation() {
        let payload = {
            startDate: this.startDate,
            endDate: this.endTime,
            startStationId: this.station
        }
        this.$store.dispatch("START_RESERVATION", payload).then(
            () => {
                this.$router.push("/");
            }
        )},

    formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}.${month}.${year}`
    },
  },
  watch: {
    show(current) {
      if (current === false) {
        this.$router.push("/");
      }
    },
    date () {
        this.startDateFormatted = this.formatDate(this.startDate)
        this.endDateFormatted = this.formatDate(this.endDate)
    },
  },
};
</script>
