import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', component: () => import('../views/HomeView.vue') },
  { path: '/login', component: () => import('../views/LoginView.vue') },
  { path: '/register', component: () => import('../views/RegisterView.vue') },
  { 
    path: '/buy', 
    component: () => import('../views/BuyTicketView.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/my-tickets', 
    component: () => import('../views/MyTicketsView.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/ticket/:id', 
    component: () => import('../views/TicketDetailView.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin', 
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  if (authStore.loading) {
    await authStore.fetchMe();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next('/');
  } else {
    next();
  }
});

export default router;
