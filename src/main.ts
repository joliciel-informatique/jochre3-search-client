import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia, type Pinia } from 'pinia'
import { createI18n, type I18n } from 'vue-i18n'
import Keycloak, { type KeycloakConfig, type KeycloakInitOptions } from 'keycloak-js'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { globalCookiesConfig } from 'vue3-cookies'
import directives from './directives/'
import Vue3TouchEvents, { type Vue3TouchEventsOptions } from 'vue3-touch-events'
import cookieConsentConfig from './assets/cookieConsentConfig'

import en from './i18n/locales/en.json'
import yi from './i18n/locales/yi.json'
import keycloakParams from './security/keycloak.json'
import { mergeDeep } from './assets/deepMerge'

import { fetchData, setURL, setToken } from './assets/fetchMethods'

import './styles/main.scss'
import CookieConsentVue from './plugins/CookieConsentVue'
import AuthorDropdown from './_components/AuthorDropdown/AuthorDropdown.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Adding FontAwesomeIcon as global component
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import SimpleKeyboard from './_components/SimpleKeyboard/SimpleKeyboard.vue'
library.add(fas) // Adding all FAS icons

const messages = {
  en: en,
  yi: yi
}

// if (App && App.compilerOptions) App.compilerOptions.whitespace = 'preserve'

const customizedMessages = {}

const pinia: Pinia = createPinia()

const app = createApp(App)
app.config.compilerOptions.whitespace = 'preserve'

directives(app)

app.use(router)
app.use(pinia)
app.use<Vue3TouchEventsOptions>(Vue3TouchEvents, {})
app.use(CookieConsentVue, cookieConsentConfig)

// app.component('SearchPage', SearchPage)
app.component('author-dropdown', AuthorDropdown)
app.component('simple-key', SimpleKeyboard)
app.component('font-awesome-icon', FontAwesomeIcon)

console.log('Starting up')

fetch(import.meta.env.BASE_URL + `conf/config.json?date=${Date.now()}`)
  .then((response) => response.json())
  .then((config) => {
    mergeDeep(customizedMessages, messages, config)

    console.log('found config')
    const apiUrl = config['api-url'] ?? 'http://localhost:4242'

    setURL(apiUrl)

    app.provide('apiUrl', apiUrl)
    app.provide('fetchData', fetchData)

    const keycloakConfig: KeycloakConfig = {
      url: config.keycloak?.url ?? keycloakParams['auth-server-url'],
      realm: config.keycloak?.realm ?? keycloakParams.realm,
      clientId: keycloakParams.resource
    }

    const keycloak = new Keycloak(keycloakConfig)
    const keycloakStore = useKeycloakStore()
    keycloakStore.keycloak = keycloak

    const preferences = usePreferencesStore()

    const loginRequired: boolean = config['login-required'] ?? false
    console.warn(`Login required: ${loginRequired}`)

    const initOptions: KeycloakInitOptions = {
      // onLoad: 'login-required' will force login. 'check-sso' will check login.
      onLoad: loginRequired ? 'login-required' : 'check-sso'
    }

    const myI18n: Promise<I18n<any>> = keycloak.init(initOptions).then((auth) => {
      if (!auth) {
        console.warn('Not authenticated')

        if (loginRequired) {
          console.error('Login required but not authenticated')
          throw new Error('Login required but not authenticated')
        }

        const i18n = createI18n({
          legacy: false,
          locale: preferences.language,
          fallbackLocale: 'en',
          messages: customizedMessages
        })
        const i18nPromise = Promise.resolve(i18n)
        return i18nPromise
      } else {
        console.log('Authenticated')

        // Setup token refresh
        setInterval(() => {
          keycloak
            .updateToken(70)
            .then((refreshed) => {
              if (refreshed) {
                console.log('Token refreshed')
                setToken(keycloak.token)
              } else {
                console.warn('Token not refreshed')
              }
            })
            .catch(() => {
              console.error('Failed to refresh token')
            })
        }, 6000)

        setToken(keycloak.token)

        const i18n = preferences
          .load()
          .then((language) => {
            const i18n = createI18n({
              legacy: false,
              locale: language,
              fallbackLocale: 'en',
              messages: customizedMessages
            })
            return i18n
          })
          .catch((error) => {
            const i18n = createI18n({
              legacy: false,
              locale: preferences.language,
              fallbackLocale: 'en',
              messages: customizedMessages
            })
            return i18n
          })
        return i18n
      }
    })

    globalCookiesConfig({
      expireTimes: '30d'
    })

    myI18n
      .then((i18nResolved) => {
        app.use(i18nResolved)
        app.mount('#app')
      })
      .catch((error) => {
        console.error(error)
      })
  })
