import { createRouter, createWebHistory } from 'vue-router'
import SchoolListView from '../views/SchoolListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'schoollist',
    component: SchoolListView,
  },{
    path: '/school',
    name: 'schoollist',
    component: SchoolListView,
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
