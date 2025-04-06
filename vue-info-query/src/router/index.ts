import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import api from '../services/api'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const debugMode = localStorage.getItem('debugMode') === 'true'
  
  if (to.meta.requiresAuth && !token && !debugMode) {
    next('/login')
  } else if (to.path === '/login' && (token || debugMode)) {
    next('/')
  } else {
    next()
  }
})

export default router
