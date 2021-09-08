<template>
  <v-btn
    rounded
    x-medium
    color="success"
    :to="{name:'reservation'}"
  >
    <v-icon>{{ mdi.bike }}</v-icon><span class="pl-2">{{ buttonText }}</span>
  </v-btn>
</template>

<script>
  import { mapState } from 'vuex';
  import { mdiBike } from '@mdi/js'

  export default {
    data() {
      return {
        mdi: {
          bike: mdiBike
        }
      }
    },
    computed: {
      buttonText() {
        return this.$t('message.reservationbutton.reservation');
      },

      ...mapState(['reservation'])
    },
  };
</script>
