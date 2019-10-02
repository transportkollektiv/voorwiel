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
          <v-icon>mdi-bike</v-icon>&nbsp;<span>{{ buttonText }}</span>
        </v-btn>
      </div>
    </template>

    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Rent
      </v-card-title>

      <v-card-text>

        <v-form v-model="valid" ref="rentBikeForm">
          <v-container>
            <v-row>
              <v-col cols="8" md="8">
                <v-text-field
                    type="number"
                    label="Bike Number"
                    v-model="bikenumber"
                    outlined
                    required
                    :rules="bikenumberrules"
                  ></v-text-field>
              </v-col>
              <v-col cols="4" md="4">
                <v-btn color="success" v-bind:disabled="!valid" @click="startRent">
                  Unlock
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialog: false,
        valid: false,
        bikenumber: '',

        bikenumberrules: [
          value => !!value || 'Required.',
          value => {
            const pattern = /\d+$/
            return pattern.test(value) || 'Please only numbers'
          },
        ],
      }
    },
    computed: {
      buttonText() {
        return this.$store.state.rents.length === 0 ? 'Rent bike' : 'Rent or Return bike';
      }
    },
    methods: {
      startRent() {
        // FIXME: error handling
        this.$store.dispatch("START_RENT", this.bikenumber).then(() => {
          this.$refs.rentBikeForm.reset()
        });
      }
    }
  };
</script>

<style>
  .rent-buttonarea {
    position: fixed;
    bottom: 2rem;
    text-align: center;
    z-index: 200;
    width: 100%;
  }
  .rent-button {
    position: static;
  }
</style>
