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
          <v-row class="pt-5">
            <v-col cols="6" md="6" class="py-0 pr-0">
              <div id="app">
                <select class="form-control" @change="changeReturnLocation($event)">
                  <option value="" selected disabled>Choose</option>
                  <option v-for="station in availableStations" :value="station.id" :key="station.id">{{ station.name }}</option>
                </select>
                <br><br>
                <p v-if="selectedStation != null" ><span>Selected return location: {{ selectedStation  }}</span></p>
                <p v-else><span>Please select a return location</span></p>
              </div>
            </v-col>
          </v-row>
          <v-btn v-if="selectedStation != null" color="success" @click="endRent(rent.id)" v-bind:loading="loadingRents.includes(rent.id)">
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


  //TODO delete later
  import Vue from 'vue'
  import axios from 'axios';

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
        },
        availableStations :[],
        selectedStation : null,
        lng: null,
        lat: null
      }
    },
    computed: {
      ...mapState(['rents'])
    },
    created() {
      this.fetchStations();
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
        Vue.prototype.$returnLng = this.lng
        Vue.prototype.$returnLat = this.lat
        
        this.$store.dispatch("END_RENT", rentId)
          .catch(err => {
            this.rentError = err;
            let index = this.loadingRents.indexOf(rentId);
            if (index >= 0) {
              this.loadingRents.splice(index, 1);
            }
          });

        // check if end rent returned without an error if so, reset the choosen location and station to null
        if (this.rentError === '')
        {
          this.selectedStation = null
          this.lng = null
          this.lat = null
        }
      },
      changeReturnLocation (event) {
        this.selectedStation = event.target.options[event.target.options.selectedIndex].text
    
        for (var  index in this.availableStations) 
        {
          if (this.availableStations[index].name === this.selectedStation)
          {
            this.lng = this.availableStations[index].location.lng;
            this.lat = this.availableStations[index].location.lat;
            break;
          }
        }
      }, 
      fetchStations() {
        
        let url = this.$appConfig.API_ROOT + '/stations/locations';
        axios.get(url)
        .then( response => response.data)
        .then( data => {
          console.log(data)
          this.availableStations = data
        })          
        .catch( (error) => {
          console.log("Error ", error)
          // TODO check response from server ...  if error disable bike renting
          }
        )
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
