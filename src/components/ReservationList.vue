<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2" primary-title>
        Deine Reservierungen
      </v-card-title>
      <v-card-actions>
        <v-container>
          <v-row justify="end">
            <reservation/>
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
                        <v-col>Fahrrad: {{reservation.bike}}</v-col>
                      </v-row>
                    </v-container>
                  </v-col>
                  <v-col cols="1" align-self=center>
                    <reservation-delete-dialog
                      :reservation="reservation"
                      @deleted="deleteFromList($event)"/>
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
export default {
  components: { Reservation, ReservationDeleteDialog },
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
    formatDate(dateString) {
      if (!dateString) return null
      const date = new Date(dateString)
      return date.toLocaleString().slice(0, -3) + ' Uhr'
    },
    deleteFromList(reservation_id) {
      let index = null
      for (let i = 0; i < this.reservations; i++) {
        if(this.reservations[i].id == reservation_id) {
          index = i
          break
        }
      }
      if (index) this.reservations.splice(index,1)
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
      return relevantReservation.sort((a,b) => this.compare(a,b))
    },
    compare(a, b) {
      const aTime = (new Date (a.event.start)).getTime()
      const bTime = (new Date (b.event.start)).getTime()
      return aTime - bTime
    },

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
