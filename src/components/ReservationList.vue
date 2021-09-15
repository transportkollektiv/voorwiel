<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2" primary-title>
        Deine Reservierungen
      </v-card-title>
      <v-card-actions>
        <v-container>
          <v-row justify="end">
            <reservation
            @newReservation="addReservation($event)"/>
          </v-row>
          <v-list-item v-for="reservation in reservations" :key="reservation.id">
            <v-list-item-content>
              <v-divider class="mx-4"/>
              <v-container>
                <v-row>
                  <v-col cols="10">
                    <v-container>
                      <v-row>
                        <v-col>Start: {{formatDate(reservation.event.start)}}</v-col>
                        <v-col>Ort: {{reservation.start_location.station_name}}</v-col>
                      </v-row>
                      <v-row>
                        <v-col>Ende: {{formatDate(reservation.event.end)}}</v-col>
                        <v-col v-if="reservation.bike">
                          Fahrradnummer: {{reservation.bike.bike_number}}
                          <RentLock :rent="createMockUpRent(reservation)" />
                          </v-col>
                      </v-row>
                    </v-container>
                  </v-col>
                  <v-col cols="1" align-self=center>
                    <reservation-delete-dialog
                      :reservation="reservation"
                      @deleted="getReservations()"/>
                  </v-col>
                </v-row>
              </v-container>
            </v-list-item-content>
          </v-list-item>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Reservation from "./Reservation.vue";
import ReservationDeleteDialog from "./ReservationDeleteDialog.vue";
import RentLock from "./RentLock.vue";

export default {
  components: { Reservation, ReservationDeleteDialog, RentLock },
  data() {
    return {
      show: true,
      deldialog: false,
      reservations: [],
    };
  },
  methods: {
    getReservations() {
      this.$store.dispatch("GET_RESERVATIONS").then(
          (data) => {
              this.reservations = this.filterReservations(data)
          }
      )
    },
    addReservation(reservation) {
      this.reservations.push(reservation)
      this.reservations.sort((a,b) => this.compareReservations(a,b))
    },
    formatDate(dateString) {
      if (!dateString) return null
      const date = new Date(dateString)
      return date.toLocaleString().slice(0, -3) + ' Uhr'
    },
    filterReservations(reservationList) {
      const today = Date.now()
      let relevantReservation = []
      for (let i = 0; i < reservationList.length; i++) {
        let elementTime = (new Date (reservationList[i].event.end)).getTime()
        if (elementTime > today) {
          relevantReservation.push(reservationList[i])
        }
      }
      return relevantReservation.sort((a,b) => this.compareReservations(a,b))
    },
    compareReservations(a, b) {
      const aTime = (new Date (a.event.start)).getTime()
      const bTime = (new Date (b.event.start)).getTime()
      return aTime - bTime
    },

    createMockUpRent(reservation) {
      return {
        id: reservation.rent,
        bike: reservation.bike
      }
    }

  },
  mounted() {
    this.getReservations();
  },
  watch: {
    show(current) {
        if (current === false) {
          this.$router.push('/')
        }
      },
  }
};
</script>
