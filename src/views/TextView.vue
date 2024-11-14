<template>
  <main
    class="hero is-widescreen"
    :class="{
      'rtl-align': !preferences.displayLeftToRight
    }"
  >
    <HeaderPage />
    <TranscribedText />
  </main>
</template>

<script setup lang="ts">
import HeaderPage from '@/components/HeaderPage/HeaderPage.vue'
import TranscribedText from '@/components/TranscribedText/TranscribedText.vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()
</script>
