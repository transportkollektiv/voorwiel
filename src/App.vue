<template>
  <v-app>
    <v-app-bar app dark flat>
      <v-app-bar-nav-icon>
        <img src="@/assets/logo.png" height="48" />
      </v-app-bar-nav-icon>

      <v-toolbar-title class="d-none d-sm-flex">{{name}}</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-toolbar-items>
        <About />

        <v-btn text color="red lighten-2" dark v-if="!user" to="login">
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
      <v-alert
        v-if="user && !user.can_rent_bike"
        border="bottom"
        colored-border
        type="warning"
        dense
        class="mb-0"
      >
        You can't rent bikes because you haven't been validated yet. Please contact us so you can start riding a bike right away.
      </v-alert>

      <gbfs-view url="" />
      <router-view></router-view>
      <div class="rent-buttonarea">
        <v-btn rounded x-large color="success" v-if="!user" to="login">
          <v-icon>mdi-login</v-icon>&nbsp;<span>Login</span>
        </v-btn>
        <Rent v-if="user" />
      </div>
    </v-content>
  </v-app>
</template>

<script>
  import About from './components/About';
  import GbfsView from './components/GbfsView';
  import Rent from './components/Rent';

  export default {
    name: 'App',
    components: {About, GbfsView, Rent},
    data: function() {
      return {
        name: this.$appConfig.NAME
      }
    },
    computed: {
      user() {
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
      this.$store.dispatch("GET_USER");
      this.$store.dispatch("UPDATE_RENTS");
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
