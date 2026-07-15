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
      { path: '', name: 'home', component: () => import('@/core/pages/HomePage.vue') },
    ],
  },
  { path: '/:catchAll(.*)*', component: () => import('@/core/pages/ErrorNotFound.vue') },
]

export default routes
