import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

fetch(import.meta.env.BASE_URL + 'config.json')
  .then((response) => {
    return response.json()
  })
  .then((config) => {
    for (const key in config) {
      app.provide(key, config[key])
    }
    app.mount('#app')
  })
