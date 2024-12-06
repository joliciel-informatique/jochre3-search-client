<template>
  <div v-if="false" class="hero-head"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const preferences = usePreferencesStore()

onMounted(() => {
  preferences.loadFromCookies()
  i18n.locale.value = preferences.language
})
</script>
