<template>
  <v-dialog v-model="show" max-width="400">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2" primary-title>
        {{ $t("message.login.login-with") }}
      </v-card-title>
      <v-card-actions>
        <v-form v-model="valid" ref="reservationForm" @submit.prevent="startRent">
          <v-container class="pb-0">
            <v-row class="pt-5">
              <v-col cols="12" md="12" class="py-0 pr-0">
                <v-text-field
                  type="text"
                  :label="$t('message.login.username')"
                  v-model="startTime"
                  outlined
                  required
                  autofocus
                  inputmode="text"
                  pattern="[0-9a-zA-Z]*"
                ></v-text-field>
              </v-col>
              <v-col cols="1" md="1" class="py-0 text-right"> </v-col>
            </v-row>
            <v-row class="pt-5">
              <v-col cols="12" md="12" class="py-0 pr-0">
                <v-text-field
                  type="password"
                  :label="$t('message.login.password')"
                  v-model="endTime"
                  outlined
                  required
                  autofocus
                  inputmode="text"
                  pattern="[0-9a-zA-Z]*"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="pt-5">
              <v-col cols="12" md="12" class="py-0 pr-0">
                <v-text-field
                  type="text"
                  :label="$t('Station')"
                  v-model="station"
                  outlined
                  required
                  autofocus
                  inputmode="text"
                  pattern="[0-9a-zA-Z]*"
                ></v-text-field>
              </v-col>
              <v-col cols="1" md="1" class="py-0 text-right"> </v-col>
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
                  {{ $t("message.app.login") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          
        </v-form>
         
      </v-card-actions>
    </v-card>
    <v-container v-if ="wrongPW" color: red>
  <h4 v-if ="wrongPW"> {{$t('message.login.failed-login')}} </h4>
             </v-container>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      wrongPW: false,
      show: true,
      loading: false,
      valid: false,
      startTime: "",
      endTime: "",
      station: "",
    };
  },
  methods: {
    startReservation() {
        let payload = {
            startDate: this.startTime,
            endDate: this.endTime,
            startStationId: this.station
        }
        this.$store.dispatch("START_RESERVATION", payload).then(
            () => {
                this.$router.push("/");
            }
        )},
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
