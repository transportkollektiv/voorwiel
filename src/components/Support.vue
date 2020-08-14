<template>
  <v-dialog max-width="480" class="d-flex d-sm-flex d-md-none" eager v-model="show">
    <v-card>
      <v-card-title class="text-h5 grey lighten-2" primary-title>
        {{ $t('message.support.title') }}
      </v-card-title>
      <div ref="placeholder"></div>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'support',
    data: function() {
      return {
        show: true,
        type: this.$appConfig.SUPPORT_TYPE,
        url: this.$appConfig.SUPPORT_URL, // fixme, these should go elsewhere
        iframeEl: null,
      }
    },
    computed: {
      ...mapState(['user'])
    },
    methods: {
      listenForHeight() {
        const placeholder = this.$refs.placeholder;
        window.addEventListener('message', function (ev) {
          if (typeof ev.data !== 'object' || ev.data.type !== 'support-height') {
            return;
          }

          placeholder.style.height = `${ev.data.value}px`;
        }, false);
      },
      initIframe() {
        this.iframeEl = document.createElement('iframe');
        this.iframeEl.setAttribute('crossorigin', 'anonymous');
        this.iframeEl.setAttribute('frameborder', 0);
        this.iframeEl.setAttribute('style', 'width:100%; height:100%;');
        this.$refs.placeholder.appendChild(this.iframeEl);

        const iframeDoc = this.iframeEl.contentWindow.document;
        if (this.type === 'zammad') {
          let username = this.user ? this.user.username.replace(/['"]/g, '') : '';

          /* eslint-disable no-useless-escape */
          iframeDoc.open()
          .write(
            `
            <body style="box-sizing: border-box; margin: 0; padding: 1rem;">
              <script src="https://code.jquery.com/jquery-2.1.4.min.js"><\/script>
              <div id="f" style="padding-bottom: 1px;"></div>
              <script id="zammad_form_script" src="${this.url}/assets/form/form.js"><\/script>
              <script>
                const delay = (fn) => () => setTimeout(fn, 0);
                const getContentHeight = () => {
                  const scrollingElement = document.body;
                  const rect = scrollingElement.getBoundingClientRect();
                  const style = getComputedStyle(scrollingElement);
                  return rect.height + parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
                };
                const sendHeight = () => window.parent.postMessage({ type: 'support-height', value: getContentHeight() }, '*');
                new MutationObserver(delay(sendHeight)).observe(document.body, { subtree: true, childList: true });
                $('#f').ZammadForm({
                  messageTitle: 'Problem oder Verbesserung melden',
                  messageSubmit: 'Abschicken',
                  messageThankYou: 'Vielen Dank für die Meldung (#%s). Wir kümmern uns umgehend!',
                  showTitle: false,
                  attachmentSupport: true,
                  attributes: [
                    {
                      display: 'Name',
                      name: 'name',
                      tag: 'input',
                      type: 'text',
                      placeholder: 'Your Name',
                      defaultValue: '${username}',
                    },
                    {
                      display: 'Email',
                      name: 'email',
                      tag: 'input',
                      type: 'email',
                      placeholder: 'Your Email',
                    },
                    {
                      display: 'Message',
                      name: 'body',
                      tag: 'textarea',
                      placeholder: 'Your Message...',
                      defaultValue: '',
                      rows: 7,
                    },
                  ]
                });
                sendHeight();
                setTimeout(() => sendHeight(), 1000);
              <\/script>
            </body>
            `
          );
          /* eslint-enable no-useless-escape */
          iframeDoc.close();
        }
      },
    },
    mounted() {
      this.$nextTick(function () {
        this.listenForHeight();
        this.initIframe();
      });
    },
    watch: {
      show(current) {
        if (current === false) {
          this.$router.push('/');
        }
      }
    }
  };
</script>
