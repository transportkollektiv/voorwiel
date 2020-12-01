<template>
  <v-app>
    <v-app-bar app dark flat>
      <v-toolbar-title class="d-none">{{name}}</v-toolbar-title>

      <img :src="logoUrl" height="48" :title="name" />

      <div class="flex-grow-1"></div>

      <v-toolbar-items>
        <About />

        <v-btn text dark v-if="!user" :to="{name: 'login'}" color="success">
          <span class="hidden-xs-only">{{ $t('message.app.login') }}</span>
          <v-icon right>{{ mdi.login }}</v-icon>
        </v-btn>

        <v-menu left bottom v-if="user">
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">
              <v-icon>{{ mdi.dotsVertical }}</v-icon>
              {{user.username}}
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="logout()">
              <v-list-item-title>{{ $t('message.app.logout') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <v-alert
        v-if="user && !user.can_rent_bike"
        border="bottom"
        colored-border
        type="warning"
        dense
        class="mb-0"
        v-html="$t('message.app.unvalidated-message')"
      />
      <gbfs-view />
      <router-view></router-view>
      <div class="rent-buttonarea">
        <v-btn fab dark x-small v-if="hasSupport" :to="{name: 'support'}" color="red" class="support-button">
          <v-icon>{{ mdi.helpCircleOutline }}</v-icon>
        </v-btn>
        <v-btn rounded x-large color="success" class="login-button" v-if="!user" :to="{name: 'login'}">
          <v-icon>{{ mdi.login }}</v-icon>&nbsp;<span>{{ $t('message.app.login') }}</span>
        </v-btn>
        <RentButton v-if="user" class="rent-button" />
      </div>
      <AppError />
    </v-main>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex';
  import { mdiLogin, mdiDotsVertical, mdiHelpCircleOutline } from '@mdi/js'
  import About from './components/About';
  import GbfsView from './components/GbfsView';
  import RentButton from './components/RentButton';
  import AppError from './components/AppError';

  const blank = (v) => !(typeof v !== 'undefined' && v !== '');

  export default {
    name: 'App',
    components: {About, GbfsView, RentButton, AppError},
    data: function() {
      return {
        name: this.$appConfig.NAME,
        hasSupport: !blank(this.$appConfig.SUPPORT_URL),
        mdi: {
          login: mdiLogin,
          dotsVertical: mdiDotsVertical,
          helpCircleOutline: mdiHelpCircleOutline
        }
      }
    },
    computed: {
      logoUrl() {
        let env = this.$appConfig.ENV;
        return require('@/assets/logo' + (env != 'production' ? '.' + env : '') + '.png');
      },
      ...mapState(['user'])
    },
    methods: {
      logout() {
        
        this.$store.dispatch("LOGOUT");
      }
    },
    watch: {
      user() {
        this.$store.dispatch("UPDATE_RENTS");
      }
    }
  };
</script>


<style>
  .support-button,
  .rent-button,
  .login-button {
    position: fixed;
    bottom: 2rem;
    text-align: center;
  }
  /* bad hack, goes away when we restructure the navigation */
  #attach-sheet + .rent-buttonarea .rent-button,
  #attach-sheet + .rent-buttonarea .login-button {
    z-index: 300;
  }
  .rent-button,
  .login-button {
    left: 50%;
    transform: translateX(-50%);
  }
  .support-button {
    left: 1rem;
  }
</style>
