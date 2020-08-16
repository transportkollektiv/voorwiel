<template>
  <div class="d-flex align-center">
    <div class="d-none d-sm-none d-md-inline px-4" v-html="$t('message.about.html')"></div>

    <v-dialog v-model="dialog" max-width="400" class="d-flex d-sm-flex d-md-none">
      <template v-slot:activator="{ on }">
        <v-btn text color="red lighten-2" dark v-on="on" class="about-toolbar-btn d-flex d-sm-flex d-md-none">
          <span class="hidden-xs-only">{{ $t('message.about.title') }}</span>
          <v-icon right>{{ mdi.informationOutline }}</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2" primary-title>
          {{ $t('message.about.title') }}
        </v-card-title>

        <v-card-text>
          <p class="mt-4 mb-0" v-html="$t('message.about.html')"></p>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import { mdiInformationOutline } from '@mdi/js'

  export default {
    data: () => ({
      dialog: false,
      mdi: {
        informationOutline: mdiInformationOutline
      }
    })
  };
</script>

<style>
  .about-toolbar-btn {
    border-radius: 0;
    height: 100% !important;
    max-height: none;
  }
</style>
