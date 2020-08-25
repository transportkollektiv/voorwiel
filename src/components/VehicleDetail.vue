<template>
  <div id="attach-sheet">
    <v-bottom-sheet v-model="show" inset eager hide-overlay attach="#attach-sheet" transition="none">
      <v-sheet height="200px">
        <span v-if="!hasData">{{ id }}</span>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>
<script>
  // FIXME: handle gone data while displayed/refresh (works only with state?)
  // FIXME: handle gone data from begin (soft 404)
  import { mapState } from 'vuex';
  export default {
    props: ['id'],
    data() {
      return {
        show: true,
        routeUpdateHappened: false,
        hasData: false,
      }
    },
    computed: {
      ...mapState(['rents', 'gbfs'])
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
        }
      },
      rents(data) {
        console.log('new rents', data);
      },
      gbfs(data) {
        console.log('new gbfs', data);
      }
    }
  };
</script>
