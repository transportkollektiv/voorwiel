<template>
  <div id="attach-sheet">
    <v-bottom-sheet v-model="show" inset eager hide-overlay attach="#attach-sheet" transition="none">
      <v-sheet height="180px">
        <v-card-title v-if="!hasData" class="pb-3">
          <v-skeleton-loader type="list-item" width="100%"></v-skeleton-loader>
        </v-card-title>

        <v-card-title v-if="hasData" class="pb-3">
          <span style="font-weight: normal;">{{ name }}</span>
        </v-card-title>

        <v-card-text>
          <ul class="vehicle-list">
            <li v-for="item in vehicleTypeCount" :key="item.id" :title="item.name">
              <v-icon size="16">{{ item.icon }}</v-icon>
               {{ item.count }}
            </li>
            <li v-if="parking">
              <v-avatar color="blue" size="24" tile>
                <v-icon color="white" size="16">{{ parkingIcon }}</v-icon>
              </v-avatar> {{ parking }}
            </li>
          </ul>
        </v-card-text>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
  // FIXME: handle gone data while displayed/refresh (works only with state?)
  // FIXME: handle gone data from begin (soft 404)
  import { mapState } from 'vuex';
  import {
    mdiBicycle,
    mdiBicycleBasket,
    mdiScooter,
    mdiCar,
    mdiMoped,
    mdiBus,
    // mdiFlash,
    mdiParking
  } from "@mdi/js";

  export default {
    props: ['id'],
    data() {
      return {
        show: true,
        routeUpdateHappened: false,
        hasData: false,
        station: undefined,
        station_status: undefined,
        vehicle_types: undefined,
        parkingIcon: mdiParking
      }
    },
    computed: {
      name() {
        if (typeof this.station === "undefined") return "";
        return this.station.name;
      },
      parking() {
        if (typeof this.station === "undefined") return "";
        if (typeof this.station_status !== "undefined" && typeof this.station_status.num_docks_available !== "undefined") {
          return this.station_status.num_docks_available;
        }
        return this.station.capacity;
      },
      vehicleTypeCount() {
        let typeCount = {};
        if (typeof this.station_status === "undefined") return [];
        for (let v of this.station_status.vehicles) {
          if (typeof typeCount[v.vehicle_type_id] === "undefined") {
            typeCount[v.vehicle_type_id] = { id: v.vehicle_type_id, count: 0 };
            let type = this.vehicle_types.find((vt) => vt.vehicle_type_id == v.vehicle_type_id);
            if (typeof type !== "undefined") {
              typeCount[v.vehicle_type_id].name = type.name;
              typeCount[v.vehicle_type_id].icon = this.iconForVehicleType(type);
            }
          }
          typeCount[v.vehicle_type_id].count += 1;
        }

        // FIXME if vehicle_docks_available -> define maximum

        return Object.values(typeCount);
      },
      ...mapState(['rents', 'gbfs'])
    },
    methods: {
      loadDetailFromGbfs() {
        this.hasData = false;

        let station = this.$store.getters.getGBFSStationWithDetails(this.id);
        if (station !== null) {
          this.hasData = true;
          console.log(station);
          this.station = station.station;
          this.station_status = station.station_status;
          this.vehicle_types = station.vehicle_types;
        } else {
          this.hasData = false;
        }
      },
      iconForVehicleType(type) {
        if (typeof type === "undefined") return mdiBicycle;
        if (type.form_factor === "bike") {
          if (type.name.toLowerCase().includes("cargo")) return mdiBicycleBasket;
          else return mdiBicycle;
        }
        if (type.form_factor === "scooter") return mdiScooter;
        if (type.form_factor === "car") return mdiCar;
        if (type.form_factor === "moped") return mdiMoped;
        if (type.form_factor === "other") return mdiBus;
        return mdiBicycle;
      },
    },
    mounted() {
      if (this.gbfs !== null) {
        this.loadDetailFromGbfs();
      }
    },
    watch: {
      show(current) {
        if (current === false && this.routeUpdateHappened) {
          // from detail view of one station to another
          this.routeUpdateHappened = false;
          this.$nextTick(() => {
            this.show = true;
          });
        } else if (current === false && !this.routeUpdateHappened) {
          // closing because of click on background
          this.$router.push('/');
        }
      },
      $route(to) {
        // displaying another station
        if (to.name == 'station') {
          this.routeUpdateHappened = true;
          this.loadDetailFromGbfs();
        }
      },
      rents(data) {
        console.log('new rents', data);
      },
      gbfs(data) {
        console.log('new gbfs', data);
        this.loadDetailFromGbfs();
      }
    }
  };
</script>

<style>
  .v-avatar .v-icon {
    border-radius: 0;
  }

  ul.vehicle-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
  }
  .vehicle-list li {
    margin-right: 1em;
  }
</style>
