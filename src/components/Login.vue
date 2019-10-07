<template>
  <v-dialog v-model="show" max-width="400">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        {{ $t('message.login.login-with') }}
      </v-card-title>

      <v-card-actions>
        <v-list width="100%">
          <v-list-item v-for="provider in providers" :key="provider.id">
            <v-list-item-content>
              <v-btn :color="provider.color" block @click.native="authenticate(provider)">
                {{ provider.name }}
                <v-icon v-if="provider.icon" right dark>{{ provider.icon }}</v-icon>
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
        providers: this.$appConfig.AUTH_PROVIDER
      }
    },
    methods: {
      authenticate(provider) {
        location.href = provider.url;
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
