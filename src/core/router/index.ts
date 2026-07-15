import { defineRouter } from '#q-app';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';

// Configura el router con historial y guard de navegación
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

  // Redirige al login si la ruta requiere auth y no hay token
  Router.beforeEach((to) => {
    const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);
    const token = localStorage.getItem('token');

    if (requiresAuth && !token) {
      return { name: 'login' };
    }
    if (to.name === 'login' && token) {
      return '/';
    }
  });

  return Router;
});
