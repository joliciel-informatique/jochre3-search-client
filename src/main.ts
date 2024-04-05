import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    message: {
      hello: 'hello world'
    }
  },
  yi: {
    message: {
      hello: 'שלום־עליכם װעלט'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'yi',
  fallbackLocale: 'en',
  messages
})

const app = createApp(App)

app.use(router)
app.use(i18n)

fetch(import.meta.env.BASE_URL + 'config.json')
  .then((response) => response.json())
  .then((config) => {
    for (const key in config) {
      app.provide(key, config[key])
    }
    app.mount('#app')
  })
