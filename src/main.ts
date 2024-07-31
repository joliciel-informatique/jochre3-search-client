import './assets/main.scss'
import 'animate.css'

import { createApp } from 'vue'
import mitt from 'mitt'
import App from './App.vue'
import router from './router'
import { createPinia, type Pinia } from 'pinia'
import { createI18n, type I18n } from 'vue-i18n'
import axios from 'axios'
import { AxiosError } from 'axios'
import Keycloak, { type KeycloakConfig, type KeycloakInitOptions } from 'keycloak-js'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { globalCookiesConfig } from 'vue3-cookies'

import en from './i18n/locales/en.json'
import yi from './i18n/locales/yi.json'
import keycloakParams from './security/keycloak.json'
import { mergeDeep } from './assets/deepMerge'

import SearchPage from './components/SearchPage/SearchPage.vue'
// import FixWordModal from './_components/Modals/FixWord/FixWord.vue'
// import FixMetadataModal from './_components/Modals/FixMetaData/FixMetadata.vue'
import { fetchData, setURL } from './assets/fetchMethods'
import FixWord from './_components/Modals/FixWord/FixWord.vue'
import FixMetadata from './_components/Modals/FixMetaData/FixMetaData.vue'
import { setErrorMessage } from './_components/Modals/ErrorNotification/ErrorNotification.vue'
// import OCRInterfaces from './assets/interfacesExternals'

const messages = {
  en: en,
  yi: yi
}

const customizedMessages = {}

const pinia: Pinia = createPinia()

const app = createApp(App)

const eventBus = mitt()

app.use(router)
app.use(pinia)

app
  // .component('OCRInterfaces', OCRInterfaces)
  .component('SearchPage', SearchPage)
  .component('FixWordModal', FixWord)
  .component('FixMetadataModal', FixMetadata)

console.log('Starting up')

fetch(import.meta.env.BASE_URL + `conf/config.json?date=${Date.now()}`)
  .then((response) => response.json())
  .then((config) => {
    mergeDeep(customizedMessages, messages, config)

    console.log('found config')
    const apiUrl = config['api-url'] ?? 'http://localhost:4242'

    setURL(apiUrl)

    app.provide('apiUrl', apiUrl)
    app.provide('eventBus', eventBus)
    app.provide('fetchData', fetchData)

    const keycloakConfig: KeycloakConfig = {
      url: config.keycloak?.url ?? keycloakParams['auth-server-url'],
      realm: config.keycloak?.realm ?? keycloakParams.realm,
      clientId: keycloakParams.resource
    }

    const keycloak = new Keycloak(keycloakConfig)
    const keycloakStore = useKeycloakStore()
    keycloakStore.keycloak = keycloak

    const preferencesStore = usePreferencesStore()

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
          locale: preferencesStore.language,
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
              } else {
                console.warn('Token not refreshed')
              }
            })
            .catch(() => {
              console.error('Failed to refresh token')
            })
        }, 6000)

        // After login, load the user preferences from the database
        interface UserPreferences {
          language: string
          resultsPerPage: number
          snippetsPerResult: number
        }

        // return fetchData('preferences/user', 'get')
        // .then((response) => response.json()
        // .then(({ data }) => {
        //   preferencesStore.language = (data.language) ? data.language : null
        //   preferencesStore.resultsPerPage = (data.resultsPerPage) ? data.resultsPerPage : null
        //   preferencesStore.snippetsPerResult = (data.snippetsPerResult) ? data.snippetsPerResult : null
        //   return createI18n({
        //     legacy: false,
        //     locale: preferencesStore.language,
        //     fallbackLocale: 'en',
        //     messages: customizedMessages
        //   })
        // }))
        // .catch((error) => {
        //   const msg = new Error(`Failed to get user preferences: ${error.message}`)
        //   setErrorMessage(msg)
        // })

        const i18n = axios
          .get<UserPreferences>(`${apiUrl}/preferences/user`, {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${keycloak?.token}`
            }
          })
          .then((response) => {
            const language = response.data.language
            if (language) {
              preferencesStore.language = language
            }
            const resultsPerPage = response.data.resultsPerPage
            if (resultsPerPage) {
              preferencesStore.resultsPerPage = resultsPerPage
            }
            const snippetsPerResult = response.data.snippetsPerResult
            if (snippetsPerResult) {
              preferencesStore.snippetsPerResult = snippetsPerResult
            }
            const i18n = createI18n({
              legacy: false,
              locale: preferencesStore.language,
              fallbackLocale: 'en',
              messages: customizedMessages
            })
            return i18n
          })
          .catch((reason: AxiosError) => {
            if (reason.response?.status === 404) {
              console.log('No preferences for user')
              const i18n = createI18n({
                legacy: false,
                locale: preferencesStore.language,
                fallbackLocale: 'en',
                messages: customizedMessages
              })
              return i18n
            } else {
              const msg = new Error(`Failed to get user preferences: ${reason}`)
              setErrorMessage(msg)

              // Don't mount the app
              // console.error(reason.message)
              // throw reason

              const i18n = createI18n({
                legacy: false,
                locale: 'en',
                fallbackLocale: 'en',
                messages: customizedMessages
              })
              return i18n
            }
          })
        return i18n
      }
    })

    globalCookiesConfig({
      expireTimes: '30d'
    })

    myI18n.then((i18nResolved) => {
      app.use(i18nResolved)
      app.mount('#app')
    })
  })
