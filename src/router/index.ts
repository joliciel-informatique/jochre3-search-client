import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TextView from '../views/TextView.vue'
import UndoView from '../views/UndoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/text/:docRef/page/:page',
      component: TextView
    },
    {
      path: '/undo/:id',
      component: UndoView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    }
  ]
})

export default router
