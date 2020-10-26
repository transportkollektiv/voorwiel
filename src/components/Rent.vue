<template>
  <v-dialog v-model="show" max-width="400">
    <v-card>
      <v-form v-model="valid" ref="rentBikeForm" @submit.prevent="startRent">
        <v-container class="pb-0">
          <v-row v-if="rentError">
            <v-col col="12" md="12" class="py-0">
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
          <v-row class="pt-5">
            <v-col cols="6" md="6" class="py-0 pr-0">
              <v-text-field
                  type="text"
                  :label="$t('message.rent.bikenumber')"
                  v-model="bikenumber"
                  outlined
                  required
                  autofocus
                  :rules="bikenumberrules"
                  inputmode="numeric"
                  pattern="[0-9]*"
                ></v-text-field>
            </v-col>
            <v-col cols="6" md="6" class="py-0 text-right">
              <v-btn class="mt-2" color="success" v-bind:disabled="!valid" :loading="loading" @click="startRent">
                {{ $t('message.rent.rent') }}
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
          <v-list-item-title>{{ $t('message.rent.bikenumber') }}: {{rent.bike.bike_number}}</v-list-item-title>
          <v-list-item-subtitle v-if="rent.bike.lock_type">
            <RentLock :rent="rent" />
          </v-list-item-subtitle>
          <v-list-item-subtitle>{{ $t('message.rent.renting-for') }} <ticking-time :datetime="rent.rent_start" /></v-list-item-subtitle>
          <v-btn color="success" @click="endRent(rent.id)" v-bind:loading="loadingRents.includes(rent.id)">
            {{ $t('message.rent.finish-rent') }}
          </v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex';
  import { mdiLock, mdiLockOpenVariant } from '@mdi/js'
  import TickingTime from "./TickingTime.vue";
  import RentLock from "./RentLock.vue";

  export default {
    components: { TickingTime, RentLock },
    props: ['bikeId'],
    data() {
      return {
        show: true,
        valid: false,
        loading: false,
        bikenumber: '',
        rentError: '',
        loadingRents: [],

        bikenumberrules: [
          value => {
            const pattern = /\d+$/;
            if (value === '' || typeof value === 'undefined') return true;
            return pattern.test(value) || 'Please only numbers';
          },
        ],

        mdi: {
          lock: mdiLock,
          lockOpenVariant: mdiLockOpenVariant
        }
      }
    },
    computed: {
      ...mapState(['rents'])
    },
    methods: {
      startRent() {
        this.loading = true;
        this.rentError = '';
        this.$store.dispatch("START_RENT", this.bikenumber)
          .then(() => this.$refs.rentBikeForm.reset(),
                (err) => this.rentError = err)
          .finally(() => this.loading = false);
      },
      endRent(rentId) {
        this.rentError = '';
        this.loadingRents.push(rentId);
        this.$store.dispatch("END_RENT", rentId)
          .catch(err => {
            this.rentError = err;
            let index = this.loadingRents.indexOf(rentId);
            if (index >= 0) {
              this.loadingRents.splice(index, 1);
            }
          });
      }
    },
    mounted() {
      this.bikenumber = this.bikeId;
    },
    watch: {
      show(current) {
        if (current === false) {
          this.$router.push('/');
          if (this.$refs.rentBikeForm) {
            this.$refs.rentBikeForm.reset();
          }
          this.rentError = '';
        }
      }
    }
  };
</script>

<style>
  .rent-unlock-key {
    font-family: monospace;
    font-size: 20px;
    font-weight: bold;
  }
</style>
