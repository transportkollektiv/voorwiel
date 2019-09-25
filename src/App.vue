<template>
    <v-app>
        <v-app-bar app dark>
            <v-app-bar-nav-icon>
                <img src="@/assets/logo.png" height="48" />
            </v-app-bar-nav-icon>

            <v-toolbar-title class="d-none d-md-flex">dev.bike</v-toolbar-title>

            <div class="flex-grow-1"></div>

            <v-toolbar-items>
                <About />
                <Login v-if="!user" />
                <span v-show="user">{{user}}</span>
            </v-toolbar-items>
        </v-app-bar>

        <v-content>
            <l-map >
                <l-tile-layer :url="url" :attribution="attribution" />
            </l-map>

            <gbfs-view url="" />
        </v-content>
    </v-app>
</template>

<script>
  import { latLng } from "leaflet";
  import { mapState } from "vuex";
  import Login from './components/Login';
  import About from './components/About';

  export default {
    name: 'App',
    components: {About, Login},
    data: () => ({
      zoom: 16,
      center: latLng(53.03134, 13.30776),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      mapOptions: {
        zoomSnap: 0.5
      },
    }),
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    methods: {
      auth() {

      }
    },
    mounted () {
      this.$store.dispatch("LOAD_AUTH_TOKEN");

      if (location.search) {
        let params = new URLSearchParams(location.search);
        this.$store.dispatch("SET_AUTH_TOKEN", params.get('token'));
      }

      this.$store.dispatch("GET_USER")
      /*
      this.$nextTick(() => {
        // this.$refs.myMap.mapObject.ANY_LEAFLET_MAP_METHOD();
      });
       */
    }
  };
</script>
