import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CourseView from '../views/CourseView.vue'
import ProgrammeView from '../views/ProgrammeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'home',
    component: HomeView,
  },{
    path: '/course',
    name: 'courselist',
    component: () => import('../views/CourseListView.vue'),
  },{
    path: '/course/:code',
    name: 'course',
    component: () => import('../views/CourseView.vue'),
    props: true,
  },{
    path: '/programme',
    name: 'programmelist',
    component: () => import('../views/ProgrammeListView.vue'),
  },{
    path: '/programme/:code',
    name: 'programme',
    component: () => import('../views/ProgrammeView.vue'),
    props: true
  }],
})

export default router
