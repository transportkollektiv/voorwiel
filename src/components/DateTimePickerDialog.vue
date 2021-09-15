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
                            :min="minDate"
                            :picker-date.sync="currentMonthYear"
                            :allowed-dates="allowedDates"
                        ></v-date-picker>
                    </v-row>
                </template>

                <v-btn
                    color="primary"
                    @click="dialogStep = 2; getAllowedTimesForDay()"
                >
                    Weiter
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
                            :allowed-minutes="allowedMinutes"
                            :min="minTime"
                            :max="maxTime"
                        ></v-time-picker>
                    </v-row>
                </template>

                <v-btn
                    color="primary"
                    @click="closeDialog"
                >
                    Weiter
                </v-btn>
                <v-btn 
                    text
                    @click="dialogStep = 1">
                    Zurück
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
            currentMonthYear: null,
            allowedDays: [],
            minTime: "00:00",
            maxTime: "20:40",
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

        getAllowedDatesForMonth(year, month) {
            const params = { year: year, month: month}
            this.$store.dispatch("GET_ALLOWED_RESERVATION_DATES", params).then(
                (data) => {
                    this.allowedDays = data.allowedDays;
                }
            )
        },

        getAllowedTimesForDay() {
            this.$store.dispatch("GET_ALLOWED_RESERVATION_TIMES", this.date).then(
                (data) => {
                    this.minTime = data.minTime;
                    this.maxTime = data.maxTime;
                }
            )
        },

        allowedDates(val) {
            return this.allowedDays.includes(val)
        },

        allowedMinutes: v => v % 5 === 0,

    },
    watch: {
        currentMonthYear(val) {
            const yearMonth = val.split('-')
            this.getAllowedDatesForMonth(yearMonth[0], yearMonth[1])
        }
    }
};
</script>