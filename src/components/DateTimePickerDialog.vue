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
                v-bind="attrs"
                v-on="on"
                :disabled="stationId == null || vehicleTypeId == null"
                :label="placeholder"
                :rules="[v => !!v || 'Datum und Zeit notwendig!']"
                required
                readonly
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
                                :max="computedMaxDate"
                                :picker-date.sync="currentMonthYear"
                                :allowed-dates="allowedDates"
                            ></v-date-picker>
                        </v-row>
                    </template>

                    <v-btn
                        :disabled="!date"
                        color="primary"
                        @click="dialogStep = 2; getForbiddenTimesForDay()"
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
                                :max="computedMaxTime"
                                :allowed-hours="allowedHours"
                                :allowed-minutes="allowedMinutes"
                                @click:hour="updateHour"
                            ></v-time-picker>
                        </v-row>
                    </template>

                    <v-btn
                        :disabled="!time"
                        color="primary"
                        @click="closeDialog"
                    >
                        Weiter
                    </v-btn>
                    <v-btn
                        text
                        @click="dialogStep = 1; time=null">
                        Zurück
                    </v-btn>
                </v-stepper-content>
            </v-stepper>
        </v-dialog>
    </v-form>
</template>
<script>
export default {
    props: [ 'placeholder', 'minDate', 'maxDate', 'vehicleTypeId', 'stationId' ],
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
            forbiddenRanges: [],
        }
    },
    computed: {
        computedDateTimeFormatted() {
            return this.formatDateTime(this.selectedDate, this.selectedTime)
        },
        computedMaxDate() {
            return (this.maxDate) ? this.maxDate.split('T')[0] : null
        },
        computedMaxTime() {
            if (this.maxDate) {
                const dateTime = this.maxDate.split('T')
                return (this.date === dateTime[0]) ? dateTime[1] : null
            }
            return null
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

        getForbiddenTimesForDay() {
            const params = { date: this.date, vehicleTypeId: this.vehicleTypeId, stationId: this.stationId}
            this.$store.dispatch("GET_FORBIDDEN_RESERVATION_TIMES", params).then(
                (data) => {
                    this.forbiddenRanges = data;
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
            for (let index in this.forbiddenRanges) {
                if (timeForStart >= this.forbiddenRanges[index].start && timeForEnd <= this.forbiddenRanges[index].end) {
                    return false
                }
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

            for (let index in this.forbiddenRanges) {
              if (timeToCheck >= this.forbiddenRanges[index].start && timeToCheck <= this.forbiddenRanges[index].end) {
                return false
              }
            }
            return true
        }

    },
    watch: {
        currentMonthYear(val) {
            const yearMonth = val.split('-')
            this.getAllowedDatesForMonth(yearMonth[0], yearMonth[1])
        },
        valid (val) {
            this.$emit('formValid', val)
        },
        modal (val) {
            if(!val) {
                this.dialogStep = 1
            }
        }
    },
};
</script>
