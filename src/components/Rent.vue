<template>
  <v-dialog v-model="show" max-width="400">
    <v-card>
      <v-card-title class="title" primary-title>
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
                  autofocus
                  :rules="bikenumberrules"
                ></v-text-field>
            </v-col>
            <v-col cols="4" md="4" class="text-center">
              <v-btn class="mt-2" color="success" v-bind:disabled="!valid" :loading="loading" @click="startRent">
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
          <v-list-item-subtitle>Renting for <ticking-time :datetime="rent.rent_start" /></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn color="success" @click="endRent(rent.id)">Finish Rent</v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex';
  import TickingTime from "./TickingTime.vue";

  export default {
    components: {TickingTime},
    data() {
      return {
        show: true,
        valid: false,
        loading: false,
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
        return this.rents.length === 0 ? 'Rent bike' : 'Rent or Return bike';
      },

      ...mapState(['rents'])
    },
    methods: {
      startRent() {
        this.loading = true;
        this.rentError = '';
        this.$store.dispatch("START_RENT", this.bikenumber).then(() => {
          this.$refs.rentBikeForm.reset()
          this.loading = false;
        }).catch((err) => {
          this.rentError = err;
          this.loading = false;
        });
      },
      endRent(rentId) {
        this.rentError = '';
        this.$store.dispatch("END_RENT", rentId).catch(err => {
          this.rentError = err;
        });
      }
    },
    watch: {
      show(current) {
        if (current === false) {
          this.$router.push('/');
        }
        if (this.$refs.rentBikeForm) {
          this.$refs.rentBikeForm.reset();
        }
        this.rentError = '';
      }
    }
  };
</script>
