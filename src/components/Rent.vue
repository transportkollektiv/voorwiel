<template>
  <v-dialog v-model="dialog" max-width="400" style="display:none;">
    <template v-slot:activator="{ on }">
      <v-btn
        rounded
        x-large
        color="success"
        v-on="on"
      >
        <v-icon>mdi-bike</v-icon>&nbsp;<span>{{ buttonText }}</span>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Rent
      </v-card-title>
      <v-form v-model="valid" ref="rentBikeForm" @submit.prevent="startRent">
        <v-container class="py-0">
          <v-row v-if="rentError">
            <v-col col="12" md="12">
             <v-alert
                dense
                outlined
                type="error"
                class="my-0"
              >
                {{rentError}}
              </v-alert>
            </v-col>
          </v-row>
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
            <v-col cols="4" md="4" class="text-center">
              <v-btn class="mt-2" color="success" v-bind:disabled="!valid" @click="startRent">
                Unlock
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>

      <v-divider class="mx-4" v-if="rents"></v-divider>

      <v-list-item
        v-for="rent in rents"
        :key="rent.id"
      >
        <v-list-item-content>
          <v-list-item-title>Bike {{rent.bike.bike_number}}</v-list-item-title>
          <v-list-item-subtitle v-if="rent.bike.lock">Code: {{rent.bike.lock.unlock_key}}</v-list-item-subtitle>
          <v-list-item-subtitle>Start: {{rent.rent_start}}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn color="success" @click="endRent(rent.id)">Finish Rent</v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        dialog: false,
        valid: false,
        bikenumber: '',
        rentError: '',

        bikenumberrules: [
          value => {
            const pattern = /\d+$/;
            if (value === '' || typeof value === 'undefined') return true;
            return pattern.test(value) || 'Please only numbers';
          },
        ],
      }
    },
    computed: {
      buttonText() {
        return this.$store.state.rents.length === 0 ? 'Rent bike' : 'Rent or Return bike';
      },

      ...mapState(['rents'])
    },
    methods: {
      startRent() {
        // FIXME: error handling
        this.rentError = '';
        this.$store.dispatch("START_RENT", this.bikenumber).then(() => {
          this.$refs.rentBikeForm.reset()
        }).catch((err) => {
          this.rentError = err;
        });
      },
      endRent(rentId) {
        this.$store.dispatch("END_RENT", rentId);
      }
    },
    watch: {
      dialog() {
        this.$refs.rentBikeForm.reset()
        this.rentError = '';
      }
    }
  };
</script>
