<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { setToken, setPreferences } from '@/assets/fetchMethods'
import { getCurrentInstance } from 'vue'
import { setLocale } from '@/assets/appState'
import VueI18n from 'vue-i18n'

const app = getCurrentInstance()
const globalProperties = app?.appContext.config.globalProperties
const i18n: VueI18n.VueI18n | undefined = globalProperties?.$i18n as VueI18n.VueI18n

setLocale(i18n?.locale)
console.log(`Setting token to ${useKeycloakStore().keycloak?.token}`)
setToken(useKeycloakStore().keycloak?.token)
setPreferences(usePreferencesStore())

// Reload when back button pushed
window.onpopstate = function () {
  location.reload()
}
</script>
