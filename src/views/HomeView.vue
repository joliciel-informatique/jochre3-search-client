<template>
  <PreferencesSetup />
  <main
    class="container hero is-fullheight is-fluid"
    :class="{ 'rtl-align': $i18n.locale === 'yi', yiddish: $i18n.locale === 'yi' }"
  >
    <PageHeader />
    <Search />
    <PageFooter />
    <ErrorNotification />
    <!-- <LoaderOverlay /> -->
    
  </main>
</template>

<script setup lang="ts">
import PreferencesSetup from '@/_components/Modals/Preferences/PreferencesSetup.vue'
import Search from '../components/SearchPage/SearchPage.vue'
import PageHeader from '../components/PageHeader.vue'
import PageFooter from '../components/PageFooter.vue'
// import FixWord from '@/_components/Modals/FixWord/FixWord.vue'
// import FixMetadata from '@/_components/Modals/FixMetaData/FixMetaData.vue'
import ErrorNotification from '@/_components/Modals/ErrorNotification/ErrorNotification.vue'

// import LoaderOverlay from '@/components/LoaderOverlay.vue
</script>