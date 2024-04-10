<script setup lang="ts">
import Search from '../components/Search.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
</script>

<template>
  <main
    class="container hero is-fullheight"
    :class="{ 'rtl-align': $i18n.locale === 'yi', yiddish: $i18n.locale === 'yi' }"
  >
    <Header />
    <Search />
    <Footer />
  </main>
</template>
