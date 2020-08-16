import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import config from './config';

if (config.SENTRY_DSN) {
  Sentry.init({
    dsn: config.SENTRY_DSN,
    integrations: [new VueIntegration({attachProps: true, logErrors: true})],
  });
}
