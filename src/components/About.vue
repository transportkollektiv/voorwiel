<template>
  <v-card>
    <v-card-text class="mt-n1 d-none d-sm-none d-md-flex">
      An experimental open source bike sharing stack for cccamp19.<br />
      <b><a href="https://events.ccc.de/camp/2019/wiki/Projects:Bikesharing">Help wanted!</a></b>
      Find and chat with us in the <a href="https://map.events.ccc.de/#19/53.03153/13.30907">Open Village</a> or call <a href="tel:2453">BIKE (2453)</a>.
    </v-card-text>

    <v-card-actions class="d-flex d-sm-flex d-md-none">
      <v-dialog v-model="dialog" max-width="400" style="z-index: 9999;">
        <template v-slot:activator="{ on }">
          <v-btn text color="red lighten-2" dark v-on="on">
            <span class="hidden-xs-only">About</span>
            <v-icon right>mdi-information-outline</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            About
          </v-card-title>

          <v-card-text>
            An experimental open source bike sharing stack for cccamp19.
            <b><a href="https://events.ccc.de/camp/2019/wiki/Projects:Bikesharing">Help wanted!</a></b>
            Find and chat with us in the <a href="https://map.events.ccc.de/#19/53.03153/13.30907">Open Village</a> or call <a href="tel:2453">BIKE (2453)</a>.
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    data: () => ({
      dialog: false
    })
  };
</script>
