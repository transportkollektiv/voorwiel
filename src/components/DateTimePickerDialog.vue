<template>
    <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="date"
        width="400px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="computedDateTimeFormatted"
            :placeholder="placeholder"
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
                
                <template>
                    <v-row justify="center">
                        <v-date-picker
                            v-model="date"
                        ></v-date-picker>
                    </v-row>
                </template>

                <v-btn
                    color="primary"
                    @click="dialogStep = 2"
                >
                    Continue
                </v-btn>
                
            </v-stepper-content>

            <v-stepper-step
                :complete="dialogStep > 2"
                step="2">
                Zeit auswählen
            </v-stepper-step>
            <v-stepper-content step="2">
                
                <template>
                    <v-row justify="center">
                        <v-time-picker
                            v-model="time"
                            format="24hr"
                        ></v-time-picker>
                    </v-row>
                </template>

                <v-btn
                    color="primary"
                    @click="closeDialog"
                >
                    Continue
                </v-btn>
                <v-btn 
                    text
                    @click="dialogStep = 1">
                    Back
                </v-btn>
            </v-stepper-content>
        </v-stepper>
    </v-dialog>
</template>
<script>
export default {
    props: [ 'placeholder', 'minDate' ],
    data() {
        return {
            dialogStep: 1,
            date: null,
            time: null,
            modal: false,
            selectedDate: null,
            selectedTime: null,
            dateTimeFormatted: "test",
        }
    },
    computed: {
        computedDateTimeFormatted() {
            return this.formatDateTime(this.selectedDate, this.selectedTime)
        }
    },
    methods: {
        closeDialog() {
            this.selectedDate = this.date
            this.selectedTime = this.time
            this.modal = false
            this.$emit('newDateTime', `${this.selectedDate}T${this.selectedTime}`)
            this.dialogStep = 1
        },

        formatDateTime (date, time) {
            if (!date || !time) return null

            const [hour, minute] = time.split(':')
            const [year, month, day] = date.split('-')
            return `${day}.${month}.${year}, ${hour}:${minute} Uhr`
        },
    },
};
</script>