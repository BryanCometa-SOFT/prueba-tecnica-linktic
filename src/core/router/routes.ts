const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/views/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/core/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'payment-methods',
        component: () => import('@/features/payment-methods/views/PaymentMethodsPage.vue'),
      },
    ],
  },
  { path: '/:catchAll(.*)*', component: () => import('@/core/pages/ErrorNotFound.vue') },
];

export default routes;
