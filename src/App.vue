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

                <v-btn text color="red lighten-2" dark v-if="!user" @click.stop="showLogin">
                  <span class="hidden-xs-only">Login</span>
                  <v-icon right>mdi-login</v-icon>
                </v-btn>

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
            <Login v-if="!user" />
            <div class="rent-buttonarea">
              <v-btn
                rounded
                x-large
                color="success"
                v-if="!user"
                @click.stop="showLogin"
              >
                <v-icon>mdi-login</v-icon>&nbsp;<span>Login</span>
              </v-btn>
              <Rent v-if="user" />
            </div>
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
      },
      showLogin() {
        this.$root.$emit('showLogin');
      }
    },
    mounted () {
      this.$store.dispatch("LOAD_AUTH_TOKEN");
      this.$store.dispatch("GET_USER");
      this.$store.dispatch("UPDATE_RENTS");
      /*
      this.$nextTick(() => {
        // this.$refs.myMap.mapObject.ANY_LEAFLET_MAP_METHOD();
      });
       */
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
