<template>
    <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="date"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            label="Picker in dialog"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-stepper
            v-model="dialogStep"
            vertical
        >
            <v-stepper-step
                :complete="dialogStep > 1"
                step="1">
                Datum auswählen
            </v-stepper-step>
            <v-stepper-content step="1">
                DatePicker stuff

                <v-btn
                    color="primary"
                    @click="dialogStep = 2"
                >
                    Continue
                </v-btn>
                <v-btn text>
                    Cancel
                </v-btn>
            </v-stepper-content>

            <v-stepper-step
                :complete="dialogStep > 2"
                step="2">
                Zeit auswählen
            </v-stepper-step>
            <v-stepper-content step="2">
                TimePicker stuff

                <v-btn
                    color="primary"
                    @click="dialogStep = 3"
                >
                    Continue
                </v-btn>
                <v-btn text>
                    Cancel
                </v-btn>
            </v-stepper-content>
        </v-stepper>
        <!--  -->
    </v-dialog>
</template>
<script>
export default {
    data() {
        return {
            dialogStep: 1,
            date: null,
            time: null,
            menu: false,
            modal: false,
            menu2: false,
        }
    }
}
</script>