<template>
  <main
    class="hero is-widescreen"
    :class="{
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
const HeaderPage = () => import('@/components/HeaderPage/HeaderPage.vue')
const TranscribedText = () => import('@/components/TranscribedText/TranscribedText.vue')
const FooterPage = () => import('@/components/FooterPage/FooterPage.vue')
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()
</script>
