<template>
    <v-form v-model="valid">
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
                :rules="[v => !!v || 'Datum und Zeit notwendig!']"
                required
                clearable
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
                                v-if="modal"
                                v-model="time"
                                format="24hr"
                                :allowed-hours="allowedHours"
                                :allowed-minutes="allowedMinutes"
                                :min="minTime"
                                :max="maxTime"
                                @click:hour="updateHour"
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
                        @click="dialogStep = 1;">
                        Zurück
                    </v-btn>
                </v-stepper-content>
            </v-stepper>
        
        </v-dialog>
    </v-form>
</template>
<script>
export default {
    props: [ 'placeholder', 'minDate', 'vehicleTypeId', 'stationId' ],
    data() {
        return {
            valid: false,
            dialogStep: 1,
            date: null,
            time: null,
            modal: false,
            selectedDate: null,
            selectedTime: null,
            selectedHour: null,
            currentMonthYear: null,
            allowedDays: [],
            minTime: "00:00",
            maxTime: "23:59",
            rangeStart: "00:01",
            rangeEnd: "00:01",
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
            this.$emit('newDateTime', `${this.selectedDate}T${this.selectedTime}`)
            this.modal = false
            this.date = null
            this.time = null
            this.dialogStep = 1
        },

        resetForm() {
            this.selectedDate = null
            this.selectedTime = null
        },

        formatDateTime (date, time) {
            if (!date || !time) return null

            const [hour, minute] = time.split(':')
            const [year, month, day] = date.split('-')
            return `${day}.${month}.${year}, ${hour}:${minute} Uhr`
        },

        getAllowedDatesForMonth(year, month) {
            const params = { year: year, month: month, vehicleTypeId: this.vehicleTypeId, stationId: this.stationId}
            this.$store.dispatch("GET_ALLOWED_RESERVATION_DATES", params).then(
                (data) => {
                    this.allowedDays = data.allowedDays;
                }
            )
        },

        getAllowedTimesForDay() {
            if(this.date == null) {
                return
            }
            const params = { date: this.date, vehicleTypeId: this.vehicleTypeId, stationId: this.stationId}
            this.$store.dispatch("GET_ALLOWED_RESERVATION_TIMES", params).then(
                (data) => {
                    this.minTime = data.minTime;
                    this.maxTime = data.maxTime;
                    if ('forbiddenRange' in data) {
                        this.rangeStart = data.forbiddenRange.start
                        this.rangeEnd = data.forbiddenRange.end
                    }
                }
            )
        },

        updateHour(value) {
            if (value < 10) {
                this.selectedHour = `0${value}`
            } else {
                this.selectedHour = value
            }
        },

        allowedDates(val) {
            return this.allowedDays.includes(val)
        },

        allowedHours(value) {
            if (value < 10) {
                value = `0${value}`
            }
            let timeForStart = `${value}:00:00`
            let timeForEnd = `${value}:59:00`
            if (timeForStart >= this.rangeStart && timeForEnd <= this.rangeEnd) {
                return false
            }
            return true
        },

        allowedMinutes(val) {
            if (val % 5 != 0) {
                return false
            }
            let timeToCheck = `${this.selectedHour}:`
            if (val < 10) {
                timeToCheck = timeToCheck.concat(`0${val}:00`)
            } else {
                timeToCheck = timeToCheck.concat(`${val}:00`)
            }

            if (timeToCheck >= this.rangeStart && timeToCheck <= this.rangeEnd ) {
                return false
            } else {
                return true
            }
        }

    },
    watch: {
        currentMonthYear(val) {
            const yearMonth = val.split('-')
            this.getAllowedDatesForMonth(yearMonth[0], yearMonth[1])
        },
        valid (val) {
            this.$emit('formValid', val)
        }
    },
};
</script>
