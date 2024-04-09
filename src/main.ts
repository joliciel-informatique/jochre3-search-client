import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia, type Pinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import Keycloak, { type KeycloakConfig, type KeycloakInitOptions } from 'keycloak-js'
import { useKeycloakStore } from '@/stores/KeycloakStore'

import en from './i18n/locales/en.json'
import yi from './i18n/locales/yi.json'
import keycloakParams from './security/keycloak.json'
import config from './config/config.json'

const messages = {
  en: en,
  yi: yi
}

const i18n = createI18n({
  legacy: false,
  locale: 'yi',
  fallbackLocale: 'en',
  messages
})

const pinia: Pinia = createPinia()

const app = createApp(App)
const renderApp = () => app

app.use(router)
app.use(i18n)
app.use(pinia)

app.provide('apiUrl', config.apiUrl)

const keycloakConfig: KeycloakConfig = {
  url: keycloakParams['auth-server-url'],
  realm: keycloakParams.realm,
  clientId: keycloakParams.resource
}

const keycloak = new Keycloak(keycloakConfig)
const keycloakStore = useKeycloakStore()
keycloakStore.keycloak = keycloak

const initOptions: KeycloakInitOptions = {
  onLoad: 'login-required'
}

keycloak
  .init(initOptions)
  .then((auth) => {
    if (!auth) {
      console.warn('Authentication failed')
    } else {
      console.log('Authenticated')
      app.mount('#app')
    }

    //Token Refresh
    setInterval(() => {
      keycloak
        .updateToken(70)
        .then((refreshed) => {
          if (refreshed) {
            console.log('Token refreshed')
          } else {
            console.warn('Token not refreshed')
          }
        })
        .catch(() => {
          console.error('Failed to refresh token')
        })
    }, 6000)
  })
  .catch(() => console.error('Authentication failed'))
