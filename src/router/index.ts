import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TextView from '../views/TextView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/text/:docRef/page/:page',
      component: TextView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    }
  ]
})

export default router
