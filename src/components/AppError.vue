<template>
  <v-snackbar v-model="show" bottom left>
    {{ message }}
    <v-btn text @click="show = false">
      {{ $t('message.apperror.close') }}
    </v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    data: () => ({
      show: false,
      message: ''
    }),
    created: function () {
      this.$store.watch(state => state.appError, () => {
        const message = this.$store.state.appError;
        if (message !== '') {
          this.show = true;
          this.message = this.$store.state.appError;
          this.$store.commit('SET_APPERROR', '');
        }
      });
    }
  };
</script>
