<script setup lang="ts">
import TranscribedText from '../components/TranscribedText.vue'
import Header from '../components/PageHeader.vue'
import Footer from '../components/PageFooter.vue'
</script>

<template>
  <main
    class="container hero is-fullheight"
    :class="{ 'rtl-align': $i18n.locale === 'yi', yiddish: $i18n.locale === 'yi' }"
  >
    <Header />
    <TranscribedText />
    <Footer />
  </main>
</template>
