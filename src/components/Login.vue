<template>
  <v-dialog v-model="show" max-width="400">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2" primary-title>
        {{ $t('message.login.login-with') }}
      </v-card-title>

      <v-card-actions>
        <v-list width="100%">
          <div v-if="loading" class="loading">
            <v-skeleton-loader boilerplate tile type="list-item@3"></v-skeleton-loader>
          </div>
          <v-list-item v-for="provider in providers" :key="provider.id">
            <v-list-item-content>
              <v-btn :color="provider.color" block @click.native="authenticate(provider)">
                {{ provider.name }}
                <!-- <v-icon v-if="provider.icon" right dark>{{ provider.icon }}</v-icon> -->
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data() {
      return {
        show: true,
        loading: false,
        providers: []
      }
    },
    created() {
      this.fetchProviders();
    },
    methods: {
      authenticate(provider) {
        let params = new URLSearchParams(location.search);
        if (params.get('redirect')) {
          sessionStorage.setItem('redirect', params.get('redirect'));
        }
        location.href = provider.auth_url;
      },
      fetchProviders() {
        this.loading = true;
        let url = this.$appConfig.API_ROOT + '/config/loginproviders';
        fetch(url)
          .then(r => r.json())
          .then(data => {
            this.providers = data;
            this.loading = false;
          })
          .catch(() => {
            this.$store.commit('SET_APPERROR', this.$t('message.login.configerror'));
          });
      }
    },
    watch: {
      show(current) {
        if (current === false) {
          this.$router.push('/');
        }
      }
    }
  };
</script>
