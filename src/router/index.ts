import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TextView from '../views/TextView.vue'
import UndoView from '../views/UndoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/text/:docRef/page/:page',
      name: 'transcribed-view',
      component: TextView
    },
    {
      path: '/undo/:id',
      name: 'undo-view',
      component: UndoView
    },
    {
      path: '/',
      name: 'home-view',
      component: HomeView
    }
  ]
})

// This will prevent navigation to unregistered routes
router.beforeEach(async (to, from, next) => {
  const routeNames = router.getRoutes().map((route) => route.name)
  return to.name && routeNames.includes(to.name) ? next() : next('/')
})

export default router
