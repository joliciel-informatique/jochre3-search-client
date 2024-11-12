<template>
  <div v-if="false" class="hero-head"></div>
</template>
<script setup lang="ts">
import { getCurrentInstance, onMounted } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import VueI18n from 'vue-i18n'

const preferences = usePreferencesStore()

onMounted(() => {
  preferences.loadFromCookies()

  const app = getCurrentInstance()
  const globalProperties = app?.appContext.config.globalProperties
  const i18n: VueI18n.VueI18n | undefined = globalProperties?.$i18n as VueI18n.VueI18n
  if (i18n) {
    const definedI18n = i18n as VueI18n.VueI18n
    definedI18n.locale = preferences.language
  }
})
</script>
