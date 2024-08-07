<template>
  <PreferencesSetup />
  <main
    class="hero is-widescreen"
    :class="{ 'rtl-align': $i18n.locale === 'yi', yiddish: $i18n.locale === 'yi' }"
  >
    <PageHeader />
    <SearchPage />
    <!-- <FixMetaData /> -->
  </main>
</template>

<script setup lang="ts">
import PreferencesSetup from '@/_components/Modals/Preferences/PreferencesSetup.vue'
import SearchPage from '../components/SearchPage/SearchPage.vue'
import PageHeader from '../components/PageHeader.vue'
import ErrorNotification from '@/_components/Modals/ErrorNotification/ErrorNotification.vue'
// import FixMetaData from '@/_components/Modals/FixMetaData/FixMetaData.vue'

// import LoaderOverlay from '@/components/LoaderOverlay.vue
</script>
