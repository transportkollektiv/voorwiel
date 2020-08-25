<template>
  <div id="attach-sheet">
    <v-bottom-sheet v-model="show" inset eager hide-overlay attach="#attach-sheet" transition="none">
      <v-sheet height="200px">
        <v-skeleton-loader type="avatar" v-if="!hasData"></v-skeleton-loader>
        <span v-if="!hasData">{{ id }}</span>
        <v-skeleton-loader type="list-item-three-line, card-heading" v-if="!hasData"></v-skeleton-loader>

        <v-card-title v-if="hasData" class="pb-3">
          <v-avatar color="primary" size="48" v-if="!electric">
            <v-icon size="32">{{ icon }}</v-icon>
          </v-avatar>

          <v-badge v-if="electric" bordered overlap color="yellow">
            <template v-slot:badge>
              <v-icon size="12">{{ iconFlash }}</v-icon>
            </template>
            <v-avatar color="primary" size="48">
              <v-icon size="32">{{ icon }}</v-icon>
            </v-avatar>
          </v-badge>

          <span style="font-weight: normal;" class="ms-4">{{ id }}</span>
        </v-card-title>
        <v-card-subtitle class="ms-16">
          {{ description }}
        </v-card-subtitle>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
  // FIXME: handle gone data while displayed/refresh (works only with state?)
  // FIXME: handle gone data from begin (soft 404)
  import { mapState } from 'vuex';
  import { mdiBicycle, mdiBicycleBasket, mdiScooter, mdiCar, mdiMoped, mdiBus, mdiFlash } from '@mdi/js'

  export default {
    props: ['id'],
    data() {
      return {
        show: true,
        routeUpdateHappened: false,
        hasData: false,
        iconFlash: mdiFlash,
        bike: undefined,
        vehicle_type: undefined
      }
    },
    computed: {
      icon() {
        if (typeof this.vehicle_type === "undefined") return mdiBicycle;
        if (this.vehicle_type.form_factor === "bike") {
          if (this.vehicle_type.name.toLowerCase().includes("cargo")) return mdiBicycleBasket;
          else return mdiBicycle;
        }
        if (this.vehicle_type.form_factor === "scooter") return mdiScooter;
        if (this.vehicle_type.form_factor === "car") return mdiCar;
        if (this.vehicle_type.form_factor === "moped") return mdiMoped;
        if (this.vehicle_type.form_factor === "other") return mdiBus;
        return mdiBicycle;
      },
      description() {
        if (typeof this.vehicle_type === "undefined") return "";
        return this.vehicle_type.name;
      },
      electric() {
        if (typeof this.vehicle_type === "undefined") return false;
        if (this.vehicle_type.propulsion_type === "electric" ||
          this.vehicle_type.propulsion_type === "electric_assist") {
          return true;
        }
        return false;
      },
      ...mapState(['rents', 'gbfs'])
    },
    methods: {
      loadDetailFromGbfs() {
        this.hasData = false;

        let bike = this.$store.getters.getGBFSBikeWithDetails(this.id);
        if (bike !== null) {
          this.hasData = true;
          this.bike = bike.bike;
          this.vehicle_type = bike.vehicle_type;
        } else {
          this.hasData = false;
        }
      }
    },
    mounted() {
      if (this.gbfs !== null) {
        this.loadDetailFromGbfs();
      }
    },
    watch: {
      show(current) {
        if (current === false && this.routeUpdateHappened) {
          // from detail view of one vehicle to another
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
        // displaying another vehicle
        if (to.name == 'vehicle') {
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
</style>
