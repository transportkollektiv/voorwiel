<template>
    <v-dialog
        v-model="modal"
        width="500"
    >
        <template v-slot:activator="{ on, attrs }">
        <v-btn
            color="red"
            dark
            v-bind="attrs"
            v-on="on"
        >
            <v-icon color="white">{{mdi.cancel}}</v-icon>
        </v-btn>
        </template>

        <v-card>
            <v-card-title class="text-h5 grey lighten-2">
                Reservierung Löschen?
            </v-card-title>

            <v-card-text>
                Die Reservierung von {{formatDate(reservation.event.start)}} bis {{formatDate(reservation.event.end)}} 
                wirklich löschen?
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                color="red"
                dark
                @click="deleteReservation(reservation.id)"
                >
                Löschen
                </v-btn>
                <v-btn
                text
                @click="modal = false"
                >
                Abbrechen
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mdiCancel } from '@mdi/js'
export default {
    props: [ 'reservation' ],
    data() {
        return {
            modal: false,
        mdi: {
          cancel: mdiCancel
        }
        }
    },
    methods: {     
        deleteReservation(reservation_id) {
        this.$store.dispatch("DELETE_RESERVATION", reservation_id).then(
            () => {
            this.$emit('deleted', reservation_id)
            this.modal = false
            }
        )
        },
        formatDate(dateString) {
        if (!dateString) return null
        const date = new Date(dateString);
        return date.toLocaleString().slice(0, -3) + ' Uhr';
        },
    },
};
</script>