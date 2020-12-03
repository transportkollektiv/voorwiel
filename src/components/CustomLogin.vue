
<template>
  <v-dialog v-model="show" max-width="400">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2" primary-title>
        {{ $t('message.login.login-with') }}
      </v-card-title>
      <v-card-actions>

<v-form v-model="valid" ref="rentBikeForm" @submit.prevent="startRent">
        <v-container class="pb-0">
          <v-row class="pt-5">
            <v-col cols="12" md="6" class="py-0 pr-0">
              <v-text-field
                  type="text"
                  :label="$t('message.login.username')"
                  v-model="username"
                  outlined
                  required
                  autofocus
                  inputmode="text"
                  pattern="[0-9a-zA-Z]*"
                ></v-text-field>
            </v-col>
            <v-col cols="1" md="1" class="py-0 text-right">
            </v-col>
          </v-row> 
          <v-row class="pt-5">
            <v-col cols="12" md="12" class="py-0 pr-0">
              <v-text-field
                  type="password"
                  :label="$t('message.login.password')"
                  v-model="password"
                  outlined
                  required
                  autofocus
                  inputmode="text"
                  pattern="[0-9a-zA-Z]*"
                ></v-text-field>
            </v-col>
          </v-row>
            <v-row class="pt-5">
            <v-col cols="6" md="6" class="py-0 text-right">
              <v-btn class="mt-2" color="success" v-bind:disabled="
              !valid" :loading="loading" @click="authenticate()">
                {{ "Login" }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>

          
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

  export default {
    data() {
      return {
        show: true,
        loading: false,
        valid: false,
        username: '',
        password: ''
      }
    },
    methods: {
      authenticate() {        
        let params = new URLSearchParams(location.search);
        console.log(params)
        if (params.get('redirect')) {
          sessionStorage.setItem('redirect', params.get('redirect'));
        }
      try {
        // TODO relative path
        let auth_url = "http://localhost:8000/api-token-auth/";
        
        axios.post( auth_url, {
          username : this.username,
          password : this.password
        })
        .then( (response) => {
          location.href = "/login/return/?token=" + response.data.token 
        })          
        .catch( 
          console.log("Error")
          // TODO Fehlerbehandlung einfügen
        )
      } catch (err) {
        console.err("Error: \n" + err)
      }
      },
    },
    watch: {
      show(current) {
        if (current === false) {
          this.$router.push('/');
        }
      }
    }
  };
</script>
