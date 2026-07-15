import { defineRouter } from '#q-app';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  });

  // Guard de navegacion para proteger rutas
  // Redirige al login si no hay sesion activa
  Router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);
    const token = localStorage.getItem('token');

    if (requiresAuth && !token) {
      next({ name: 'login' });
    } else if (to.name === 'login' && token) {
      next('/');
    } else {
      next();
    }
  });

  return Router;
});
