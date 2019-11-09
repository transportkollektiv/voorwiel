<script>
  export default {
    created() {
      this.pullToken();
    },
    render() {
      return '';
    },
    methods: {
      pullToken() {
        let params = new URLSearchParams(location.search);
        let token = params.get('token');
        if (token) {
          let a = this.$store.dispatch('AUTHENTICATE', token);
          let redir = sessionStorage.getItem('redirect');
          if (redir) {
            sessionStorage.removeItem('redirect');
            a.then(() => {
              this.$router.replace({ path: redir });
            });
            return;
          }
        }

        this.$router.replace({ path: '/' });
      }
    }
  };
</script>
