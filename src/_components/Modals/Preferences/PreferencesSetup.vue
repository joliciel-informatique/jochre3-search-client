<template>
  <div v-if="false" class="hero-head"></div>
</template>
<script setup lang="ts">
import { getCurrentInstance, onMounted } from 'vue'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { useCookies } from '@vueuse/integrations/useCookies'
import VueI18n from 'vue-i18n'

const keycloak = useKeycloakStore().keycloak
const cookies = useCookies(['locale', 'resultsPerPage', 'snippetsPerResult'])

const preferences = usePreferencesStore()

onMounted(() => {
  const app = getCurrentInstance()
  const authenticated = keycloak?.authenticated ?? false

  if (!authenticated) {
    console.log(`Not authenticated. Getting preferences from cookie.`)
    const language = cookies.get('locale').value as string
    const resultsPerPage = cookies.get('resultsPerPage').value as number
    const snippetsPerResult = cookies.get('snippetsPerResult').value as number

    if (language) {
      preferences.language = language
    }
    if (resultsPerPage) {
      preferences.resultsPerPage = resultsPerPage
    }
    if (snippetsPerResult) {
      preferences.snippetsPerResult = snippetsPerResult
    }

    const globalProperties = app?.appContext.config.globalProperties
    const i18n: VueI18n.VueI18n | undefined = globalProperties?.$i18n as VueI18n.VueI18n
    if (i18n) {
      const definedI18n = i18n as VueI18n.VueI18n
      definedI18n.locale = preferences.language
    }
  } else {
    console.log(`Authenticated. No need for preferences cookie.`)
  }
})
</script>
