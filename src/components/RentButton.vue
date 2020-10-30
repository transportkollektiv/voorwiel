<template>
  <v-btn
    rounded
    x-large
    color="success"
    :to="{name:'rent'}"
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
        return this.rents.length === 0 ? this.$t('message.rentbutton.rent-bike') : this.$t('message.rentbutton.rent-or-return-bike');
      },

      ...mapState(['rents'])
    },
  };
</script>
