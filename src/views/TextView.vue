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
  <!-- <FooterPage /> -->
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const HeaderPage = defineAsyncComponent(() => import('@/components/HeaderPage/HeaderPage.vue'))
const FooterPage = defineAsyncComponent(() => import('@/components/FooterPage/FooterPage.vue'))
const TranscribedText = defineAsyncComponent(
  () => import('@/components/TranscribedText/TranscribedText.vue')
)

import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()
</script>
