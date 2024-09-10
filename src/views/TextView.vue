<script setup lang="ts">
import TranscribedText from '../components/TranscribedText.vue'
import Header from '@/components/HeaderPage/HeaderPage.vue'
// import FooterDefault from '2/components/SearchPage/Footer/FooterDefault/FooterDefault.vue'
</script>

<template>
  <main
    class="container hero is-fullheight"
    :class="{ 'rtl-align': $i18n.locale === 'yi', yiddish: $i18n.locale === 'yi' }"
  >
    <Header />
    <TranscribedText />
    <!-- <FooterDefault /> -->
  </main>
</template>
