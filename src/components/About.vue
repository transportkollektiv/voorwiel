<template>
  <div class="d-flex align-center">
    <div class="d-none d-sm-none d-md-inline">
      An experimental open source bike sharing stack for cccamp19.<br />
      <b><a href="https://events.ccc.de/camp/2019/wiki/Projects:Bikesharing">Help wanted!</a></b>
      Find and chat with us in the <a href="https://map.events.ccc.de/#19/53.03153/13.30907">Open Village</a> or call <a href="tel:2453">BIKE (2453)</a>.
    </div>

    <v-dialog v-model="dialog" max-width="400" class="d-flex d-sm-flex d-md-none">
      <template v-slot:activator="{ on }">
        <v-btn text color="red lighten-2" dark v-on="on" class="about-toolbar-btn d-flex d-sm-flex d-md-none">
          <span class="hidden-xs-only">About</span>
          <v-icon right>mdi-information-outline</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          About
        </v-card-title>

        <v-card-text>
          <p class="mt-4 mb-0">
            An experimental open source bike sharing stack for cccamp19.
            <b><a href="https://events.ccc.de/camp/2019/wiki/Projects:Bikesharing">Help wanted!</a></b>
            Find and chat with us in the <a href="https://map.events.ccc.de/#19/53.03153/13.30907">Open Village</a> or call <a href="tel:2453">BIKE (2453)</a>.
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  export default {
    data: () => ({
      dialog: false
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
