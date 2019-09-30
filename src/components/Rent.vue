<template>
  <v-dialog v-model="dialog" max-width="400" style="display:none;">
    <template v-slot:activator="{ on }">
      <div class="rent-buttonarea">
        <v-btn
          rounded
          x-large
          color="success"
          class="v-btn--example"
          v-on="on"
        >
          <v-icon>mdi-bike</v-icon>&nbsp;<span>Rent bike</span>
        </v-btn>
      </div>
    </template>

    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Rent
      </v-card-title>

      <v-card-text>
        <span>...</span>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialog: false,
      }
    },
    methods: {
    }
  };
</script>

<style>
  .rent-buttonarea {
    position: fixed;
    bottom: 2rem;
    text-align: center;
    z-index: 500; /* leaflet-pane has 400 */
    width: 100%;
  }
  .rent-button {
    position: static;
  }
</style>
