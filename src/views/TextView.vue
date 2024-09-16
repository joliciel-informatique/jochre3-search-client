<template>
  <main
    class="hero is-widescreen"
    :class="{ 'rtl-align': $i18n.locale === 'yi', yiddish: $i18n.locale === 'yi' }"
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
</script>
