import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import store from '../store';

import Login from '../components/Login';
import LoginReturn from '../components/LoginReturn';
import Rent from '../components/Rent';

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/login', component: Login },
    { path: '/login/return', component: LoginReturn },
    { path: '/rent', component: Rent, meta: { requiresAuth: true }, props: (route) => {
      if (route.query && route.query.id) {
        return { bikeId: route.query.id }
      }
      return {};
    }},
    { path: '/b/:id', redirect: to => {
      const { params } = to;
      return { path: '/rent', query: { id: params.id } };
    }},
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
    try {
      store.dispatch("IS_AUTHENTICATED");
    } catch {}
    initialAuthTriggered = true;
  }
});

export default router;
