<script setup lang="ts">
import { getCurrentInstance, onMounted } from 'vue'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { useCookies } from 'vue3-cookies'
import VueI18n from 'vue-i18n'

const keycloak = useKeycloakStore().keycloak
const { cookies } = useCookies()

const preferences = usePreferencesStore()

onMounted(() => {
  const app = getCurrentInstance()
  const authenticated = keycloak?.authenticated ?? false

  console.log(`Authenticated? ${authenticated}`)
  if (!authenticated) {
    const myPreferences = cookies.get('preferences')
    if (myPreferences) {
      console.log(`Found preferences cookie: ${JSON.stringify(myPreferences)}`)

      preferences.language = myPreferences.language
      preferences.resultsPerPage = myPreferences.resultsPerPage
      preferences.snippetsPerResult = myPreferences.snippetsPerResult

      const globalProperties = app?.appContext.config.globalProperties
      const i18n: VueI18n.VueI18n = globalProperties?.$i18n
      if (i18n) {
        i18n.locale = preferences.language
      }
    } else {
      console.log('No preferences cookie')
    }
  }
})
</script>

<template><div v-if="false"></div></template>
