<script setup lang="ts">
import Search from '../components/Search.vue'
import Header from '../components/Header.vue'
</script>

<template>
  <main
    class="container"
    :class="{ 'rtl-align': $i18n.locale === 'yi', yiddish: $i18n.locale === 'yi' }"
  >
    <Header />
    <Search />
  </main>
</template>
