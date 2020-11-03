import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import store from '../store';

import Login from '../components/Login';
import LoginReturn from '../components/LoginReturn';
import Rent from '../components/Rent';
import Support from '../components/Support';
import VehicleDetail from '../components/VehicleDetail';
import StationDetail from '../components/StationDetail';

const NoOpComponent = Vue.component('no-op', {
  functional: true,
  render () { return null; }
});

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: NoOpComponent },
    { path: '/login', name: 'login', component: Login },
    { path: '/login/return', component: LoginReturn },
    { path: '/rent', name: 'rent', component: Rent, meta: { requiresAuth: true }, props: (route) => {
      if (route.query && route.query.id) {
        return { bikeId: route.query.id }
      }
      return {};
    }},
    { path: '/b/:id', redirect: to => {
      const { params } = to;
      return { path: '/rent', query: { id: params.id } };
    }},
    { path: '/v/:id', name: 'vehicle', component: VehicleDetail, props: true },
    { path: '/s/:id', name: 'station', component: StationDetail, props: true },
    { path: '/support', name: 'support', component: Support },
    { path: '*', redirect: '/' }
  ],
});

var initialAuthTriggered = false;

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  initialAuthTriggered = true;
  store.dispatch("IS_AUTHENTICATED")
    .then(() => {
      next()
    })
    .catch(() => {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        }
      })
    });
});

router.onReady(() => {
  if (!initialAuthTriggered) {
    store.dispatch("IS_AUTHENTICATED").catch(() => {});
    initialAuthTriggered = true;
  }
});

export default router;
