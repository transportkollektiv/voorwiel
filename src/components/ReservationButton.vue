<template>
  <v-btn
    rounded
    x-large
    color="success"
    :to="{name:'reservationview'}"
  >
    <v-icon>{{ mdi.calendar }}</v-icon><span class="pl-2">{{ buttonText }}</span>
  </v-btn>
</template>

<script>
  import { mdiCalendar } from '@mdi/js'

  export default {
    data() {
      return {
        mdi: {
          calendar: mdiCalendar
        }
      }
    },
    computed: {
      buttonText() {
        // return 'this.$t('message.reservationbutton.reservation');'
        return 'Meine Reservierungen!'
      },
    },
  };
</script>
