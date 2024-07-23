<template>
  <RouterView />
</template>

<script setup lang="ts">
  import { RouterView, useRoute } from 'vue-router'
  import { useKeycloakStore } from '@/stores/KeycloakStore'
  import { usePreferencesStore } from '@/stores/PreferencesStore'
  import { setToken, setPreferences, authenticated} from '@/assets/fetchMethods'
  import { watch, getCurrentInstance } from 'vue'
  import { setLocale } from '@/assets/appState'
  import { updateHistory } from './components/SearchPage/SearchPage-variables'
  import { defineSearchParams } from './components/SearchPage/SearchPage-methods'
  import { sortBy } from './components/SearchPage/SearchPage-variables'
  import VueI18n from 'vue-i18n'

  const route = useRoute()

  const app = getCurrentInstance()
  const globalProperties = app?.appContext.config.globalProperties
  const i18n: VueI18n.VueI18n | undefined = globalProperties?.$i18n as VueI18n.VueI18n
  
  setLocale(i18n?.locale)
  setToken(useKeycloakStore().keycloak?.token)
  setPreferences(usePreferencesStore())

  watch(updateHistory, (newUpdate) => newUpdate ? updateUrl() : null)

  const updateUrl = () => {
    // console.log('saving history')
    const params = new URLSearchParams(defineSearchParams())
    params.append('sort', sortBy.value.trim())
    const url = route.path + '?' + params.toString()
    history.pushState({}, '', url)
    console.log(history.state)
  }

// Reload when back button pushed
window.onpopstate = function () {
  location.reload()
}
</script>

<style lang="scss">
@import '@/assets/main.scss';
</style>
