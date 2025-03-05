<template>
  <div
    :class="[
      !preferences.displayLeftToRight ? 'rtl-align' : '',
      preferences.interfaceStyle == 'old' ? 'scrollBody' : ''
    ]"
    :style="preferences.interfaceStyle === 'old' ? 'overflow:auto; max-height:100vh' : ''"
  >
    <RouterView />
  </div>
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
const preferences = usePreferencesStore()
const globalProperties = app?.appContext.config.globalProperties
const i18n: VueI18n.VueI18n | undefined = globalProperties?.$i18n as VueI18n.VueI18n
const translate: ((key: string) => string) | undefined = globalProperties?.$t

setLocale(i18n?.locale)
setToken(useKeycloakStore().keycloak?.token)
setPreferences(usePreferencesStore())

if (translate) {
  document.title = translate('meta.title')

  const metaElement = document.head.querySelector('meta[name="description"]')
  if (metaElement && metaElement instanceof HTMLMetaElement) {
    metaElement.content = translate('meta.description')
  }
}

// Reload when back button pushed
window.onpopstate = function () {
  location.reload()
}
</script>
