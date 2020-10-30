<template>
  <div>
    <template v-if="rent.bike.lock_type === 'CL'">
      {{ $t('message.rent.unlockcode') }}:
      <span class="rent-unlock-key" >{{ unlock_key }}</span>
      <v-progress-circular indeterminate size="16" width="2" v-if="loading"></v-progress-circular>
    </template>
    <template v-else-if="rent.bike.lock_type === 'EL'">
      <v-btn color="accent" rounded outlined elevation="0" @click="unlock()" v-bind:loading="loading">
        <v-icon>{{ mdi.lockOpenVariant }}</v-icon>&nbsp;
        <span>{{ $t('message.rent.unlock') }}</span>
      </v-btn>
    </template>
    <template v-else>
      <small>{{ $t('message.lock.not-supported') }}</small>
    </template>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { mdiLock, mdiLockOpenVariant } from '@mdi/js'

  export default {
    props: ['rent'],
    data() {
      return {
        loading: false,
        error: '',
        mdi: {
          lock: mdiLock,
          lockOpenVariant: mdiLockOpenVariant
        }
      }
    },
    computed: mapState({
      unlock_key(state) {
        if (this.rent.bike.lock_type != 'CL') return '';
        let lock = state.lock[this.rent.id];
        if (!lock) return '';
        return lock.unlock_key;
      },
    }),
    mounted() {
      if (this.rent.bike.lock_type == 'CL') {
        this.unlock();
      }
    },
    methods: {
      unlock() {
        this.loading = true;
        this.$store.dispatch("RENT_UNLOCK", this.rent.id)
          .then(() => { /* nothing */ },
                (err) => this.error = err)
          .finally(() => this.loading = false);
      },
    },
  };
</script>

<style>
  .rent-unlock-key {
    font-family: monospace;
    font-size: 20px;
    font-weight: bold;
  }
</style>
