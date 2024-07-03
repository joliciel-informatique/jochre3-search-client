<template>
  <PreferencesSetup />
  <main
    class="container hero is-fullheight is-fluid"
    :class="{ 'rtl-align': $i18n.locale === 'yi', yiddish: $i18n.locale === 'yi' }"
  >
    <Header />
    <Search />
    <FixWord />
    <!-- <FixMetadata /> -->
    <Footer />
  </main>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import PreferencesSetup from '../components/PreferencesSetup.vue'
import Search from '../components/Search.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import FixWord from '@/_components/Modals/FixWord.vue'
import FixMetadata from '@/_components/Modals/FixMetadata.vue'
// import FixWordModal from '@/components/FixWordModal.vue'

// const fixWordVisible = ref<boolean>(false)



</script>