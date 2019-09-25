<template>
  <v-dialog v-model="dialog" max-width="400" style="z-index: 9999;">
    <template v-slot:activator="{ on }">
      <v-btn text color="red lighten-2" dark v-on="on">
        <span class="hidden-xs-only">Login</span>
        <v-icon right>mdi-login</v-icon>
      </v-btn>
    </template>

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
        dialog: false,
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
    }
  };
</script>
