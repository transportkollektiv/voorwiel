<template>
  <v-dialog v-model="show" max-width="400" style="z-index: 9999;">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Login With
      </v-card-title>

      <v-card-actions>
        <v-list width="100%">
          <v-list-item v-for="provider in providers" :key="provider.id">
            <v-list-item-content>
              <v-btn :color="provider.color" block @click.native="authenticate(provider)">
                {{ provider.label }}
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
        show: false,
        providers: this.$appConfig.AUTH_PROVIDER.map((el) => {
          return {
            label: el.name,
            id: el.id,
            icon: el.icon,
          }
        })
      }
    },
    methods: {
      authenticate(provider) {
        let url = this.$appConfig.AUTH_LOGIN.replace(/\{provider\}/, provider.id);
        location.href = url;
      }
    },
    mounted() {
      this.$root.$on('showLogin', () => {
        this.show = true;
      })
    }
  };
</script>
