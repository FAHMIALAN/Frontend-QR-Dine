import { createRouter, createWebHistory } from 'vue-router';
import MenuPage from '../views/MenuPage.vue';
import CartPage from '../views/CartPage.vue';
import CheckoutPage from '../views/CheckoutPage.vue';
import OrderStatus from '../views/OrderStatus.vue';
import UploadPayment from '../views/UploadPayment.vue';
import LoginPage from '../views/LoginPage.vue';
import AdminPage from '../views/admin/AdminPage.vue';

const routes = [
  { path: '/', component: MenuPage },
  { path: '/cart', component: CartPage },
  { path: '/checkout', component: CheckoutPage },
  { path: '/status', component: OrderStatus },
  { path: '/upload-payment', component: UploadPayment },
  { path: '/login', component: LoginPage, meta: { requiresGuest: true } },
  { 
    path: '/admin', 
    component: AdminPage, 
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !token) {
    // Redirect to login if user is not authenticated and tries to access a protected route
    next('/login');
  } else if (to.meta.requiresGuest && token) {
    // Redirect to admin if user is already authenticated and tries to access login page
    next('/admin');
  } else {
    next();
  }
});

export default router;
