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
                <v-menu left bottom v-if="user">
                  <template v-slot:activator="{ on }">
                    <v-btn text v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                      {{user.username}}
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item @click="logout()">
                      <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-app-bar>

        <v-content>
            <gbfs-view url="" />
            <Rent v-if="user" />
        </v-content>
    </v-app>
</template>

<script>
  import Login from './components/Login';
  import About from './components/About';
  import GbfsView from './components/GbfsView';
  import Rent from './components/Rent';

  export default {
    name: 'App',
    components: {About, Login, GbfsView, Rent},
    data: () => ({
    }),
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    methods: {
      logout() {
        this.$store.dispatch("LOGOUT");
      }
    },
    mounted () {
      this.$store.dispatch("LOAD_AUTH_TOKEN");

      this.$store.dispatch("GET_USER")
      /*
      this.$nextTick(() => {
        // this.$refs.myMap.mapObject.ANY_LEAFLET_MAP_METHOD();
      });
       */
    }
  };
</script>
