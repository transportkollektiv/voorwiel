
<template>
  <v-dialog v-model="show" max-width="500">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2" primary-title>
        {{ $t("message.login.login-with") }}
      </v-card-title>
      <v-card-actions>
        <v-form v-model="valid" ref="rentBikeForm" @submit.prevent="startRent">
          <v-container class="pb-0">
            <v-row class="pt-5">
              <v-col cols="12" md="12" class="py-0 pr-0">
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
              <v-col cols="1" md="1" class="py-0 text-right"> </v-col>
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
                <v-btn
                  class="mt-2"
                  color="success"
                  v-bind:disabled="!valid"
                  :loading="loading"
                  @click="authenticate()"
                >
                  {{ $t("message.app.login") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          
        </v-form>
         
      </v-card-actions>
    </v-card>
    <v-container v-if ="wrongPW" test color: red>
      <h2 > {{$t('message.login.failed-login') }} </h2>
    </v-container>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      wrongPW: false,
      show: true,
      loading: false,
      valid: false,
      username: "",
      password: "",
    };
  },
  methods: {
    authenticate() {
      let params = new URLSearchParams(location.search);
      if (params.get("redirect")) {
        sessionStorage.setItem("redirect", params.get("redirect"));
      }
      try {
        let auth_url = this.$appConfig.API_ROOT + "/auth/token";

        axios
          .post(auth_url, {
            username: this.username,
            password: this.password,
          })
          .then((response) => {
            location.href = "/login/return/?token=" + response.data.token;
          })
          .catch((error) => {
            if (error.response) {
              this.wrongPW = true;
            }
          });
      } catch (err) {
        console.err("Error im zweiten Catch: \n" + err);
      }
    },
  },
  watch: {
    show(current) {
      if (current === false) {
        this.$router.push("/");
      }
    },
  },
};
</script>
