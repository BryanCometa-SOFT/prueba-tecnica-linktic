import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      // Las rutas se agregarán por feature
    ],
  },

  // Ruta 404 - siempre debe ir al final
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/core/pages/ErrorNotFound.vue'),
  },
];

export default routes;
