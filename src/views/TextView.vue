<template>
  <main
    :class="{
      hero: true,
      'is-widescreen': true,
      'rtl-align': !preferences.displayLeftToRight,
      yiddish: !preferences.displayLeftToRight
    }"
  >
    <HeaderPage />
    <TranscribedText />
  </main>
  <FooterPage />
</template>

<script setup lang="ts">
import HeaderPage from '@/components/HeaderPage/HeaderPage.vue'
import TranscribedText from '@/components/TranscribedText/TranscribedText.vue'
import FooterPage from '@/components/FooterPage/FooterPage.vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()
</script>
