<template>
  <PreferencesSetup />
  <main
    class="hero is-widescreen"
    :class="{ 'rtl-align': $i18n.locale === 'yi', yiddish: $i18n.locale === 'yi' }"
  >
    <HeaderPage />
    <SearchPage
      ref="searchPageRef"
      v-model:query="query"
      v-model:search-results="searchResults"
      v-model:total-hits="totalHits"
      v-model:page="page"
      v-model:wordModal="wordModal"
      v-model:metadataModal="metadataModal"
    />
    <!-- <ErrorNotification :error-modal /> -->
  </main>
  <FooterPage
    v-model:query="query"
    v-model:total-hits="totalHits"
    v-model:page="page"
    v-model:showing="showing"
    @newSearch="newSearch"
    @resetSearchResults="resetSearchResults"
    :search-results="searchResults"
  />
  <FixWord v-model:wordModal="wordModal" />
  <FixMetaData v-model:metadataModal="metadataModal" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import HeaderPage from '@/components/HeaderPage/HeaderPage.vue'
import SearchPage from '@/components/SearchPage/SearchPage.vue'
import FooterPage from '@/components/FooterPage/FooterPage.vue'
import ErrorNotification from '@/_components/Modals/ErrorNotification/ErrorNotification.vue'
import type { SearchResult } from '@/assets/interfacesExternals'
import PreferencesSetup from '@/_components/Modals/Preferences/PreferencesSetup.vue'
import FixMetaData from '@/_components/Modals/FixMetaData/FixMetaData.vue'
import FixWord from '@/_components/Modals/FixWord/FixWord.vue'
// import FixMetaData from '@/_components/Modals/FixMetaData/FixMetaData.vue'

// Props shared between SearchPage and FooterPage components
const page = ref(1)
const totalHits = ref(0)
const query = ref('')
const searchResults = ref<Array<SearchResult>>([])
const showing = ref(true)

// Props for modal boxes
const metadataModal = ref({ open: false, docRef: '', field: '', value: '' })
const wordModal = ref({ open: false, docRef: '', offset: '', snippet: '' })
const errorModal = ref({ open: false, docRef: null, field: null, value: null })
const searchPageRef = ref<InstanceType<typeof SearchPage>>()

// Methods exposed by SearchPage
const resetSearchResults = () => searchPageRef.value?.resetSearchResults()
const newSearch = () => searchPageRef.value?.newSearch()
</script>
