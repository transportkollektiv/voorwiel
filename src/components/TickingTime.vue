<template>
  <time :datetime="datetime">{{tick}}</time>
</template>

<script>
  const leadingZero = (num) => `0${num}`.slice(-2);

  export default {
    name: 'ticking-time',
    props: ['datetime'],
    data() {
      return {
        now: Date.now()
      }
    },
    computed: {
      tick() {
        if (!this.now) return;

        let startDate = new Date(this.datetime);
        let diff = Math.floor((this.now - startDate.getTime())/1000);
        let hours = Math.max(0, Math.floor(diff / 3600));
        let minutes = Math.max(0, Math.floor((diff - hours*3600)/60));
        let seconds = Math.max(0, diff - (hours*3600 + minutes*60));
        return `${leadingZero(hours)}:${leadingZero(minutes)}:${leadingZero(seconds)}`;
      }
    },
    mounted() {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(() => {
        this.now = Date.now();
      }, 1000)
    },
    beforeDestroy() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    }
  };
</script>
