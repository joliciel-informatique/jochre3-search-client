<template><div v-if="false" class="hero-body"></div></template>
<script setup lang="ts">
import { getCurrentInstance, onMounted } from 'vue'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { useCookies } from 'vue3-cookies'
import VueI18n from 'vue-i18n'

const keycloak = useKeycloakStore().keycloak
const { cookies } = useCookies()

const preferences = usePreferencesStore()

interface Preferences {
  language: string
  resultsPerPage: number
  snippetsPerResult: number
}

onMounted(() => {
  const app = getCurrentInstance()
  const authenticated = keycloak?.authenticated ?? false

  console.log(`Authenticated? ${authenticated}`)
  if (!authenticated) {
    const myPreferences = cookies.get('preferences') as unknown as Preferences
    if (myPreferences) {
      console.log(`Found preferences cookie: ${JSON.stringify(myPreferences)}`)

      preferences.language = myPreferences.language
      preferences.resultsPerPage = myPreferences.resultsPerPage
      preferences.snippetsPerResult = myPreferences.snippetsPerResult

      const globalProperties = app?.appContext.config.globalProperties
      const i18n: VueI18n.VueI18n | undefined = globalProperties?.$i18n as VueI18n.VueI18n
      if (i18n) {
        const definedI18n = i18n as VueI18n.VueI18n
        definedI18n.locale = preferences.language
      }
    } else {
      console.log('No preferences cookie')
    }
  }
})
</script>