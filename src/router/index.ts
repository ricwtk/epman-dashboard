import { createRouter, createWebHashHistory } from 'vue-router'
import SchoolListView from '../views/SchoolListView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },{
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true }
  }, {
    path: '/user-admin',
    name: 'useradmin',
    component: () => import('../views/UserAdminView.vue'),
    meta: { requiresAuth: true }
  },{
    path: '/school',
    name: 'schoollist',
    component: SchoolListView,
    meta: { requiresAuth: true }
  },{
    path: '/school/:code',
    name: 'school',
    component: () => import('../views/SchoolView.vue'),
    props: true,
    meta: { requiresAuth: true }
  },{
    path: '/course',
    name: 'courselist',
    component: () => import('../views/CourseListView.vue'),
    meta: { requiresAuth: true }
  },{
    path: '/course/:code',
    name: 'course',
    component: () => import('../views/CourseView.vue'),
    props: true,
    meta: { requiresAuth: true }
  },{
    path: '/programme',
    name: 'programmelist',
    component: () => import('../views/ProgrammeListView.vue'),
    meta: { requiresAuth: true }
  },{
    path: '/programme/:code',
    name: 'programme',
    component: () => import('../views/ProgrammeView.vue'),
    props: true,
    meta: { requiresAuth: true }
  }],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 3. Ensure Firebase has checked auth state before making decisions
  if (!authStore.isReady) {
    await authStore.init();
  }

  // 4. Check if the route requires auth and if user is logged in
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    next('/');
  } else if (to.path === '/' && authStore.isAuthenticated) {
    // Redirect logged-in users away from /login to /dashboard
    next('/school');
  } else {
    // Allow access
    next();
  }
});

export default router
