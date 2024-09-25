<template>
  <PreferencesSetup />
  <main
    class="hero is-widescreen"
    :class="{
      'rtl-align': !preferences.displayLeftToRight,
      yiddish: !preferences.displayLeftToRight
    }"
  >
    <HeaderPage />
    <SearchPage
      ref="searchPageRef"
      v-model:search-results="searchResults"
      v-model:total-hits="totalHits"
      v-model:page="page"
      v-model:image-modal="imageModal"
      v-model:word-modal="wordModal"
      v-model:metadata-modal="metadataModal"
      v-model:notification="notification"
    />
  </main>
  <FooterPage
    v-model:total-hits="totalHits"
    v-model:page="page"
    @newPage="newPage"
    @resetSearchResults="resetSearchResults"
    :search-results="searchResults"
  />
  <Preferences v-model:notification="notification" />
  <LargeImage v-model:image-modal="imageModal" />
  <FixWord v-model:word-modal="wordModal" v-model:notification="notification" />
  <FixMetaData v-model:metadata-modal="metadataModal" v-model:notification="notification" />
  <Notification v-model:notification="notification" />
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
const HeaderPage = defineAsyncComponent(() => import('@/components/HeaderPage/HeaderPage.vue'))
const SearchPage = defineAsyncComponent(() => import('@/components/SearchPage/SearchPage.vue'))
const FooterPage = defineAsyncComponent(() => import('@/components/FooterPage/FooterPage.vue'))
const LargeImage = defineAsyncComponent(
  () => import('@/_components/Modals/LargeImage/LargeImage.vue')
)
const FixMetaData = defineAsyncComponent(
  () => import('@/_components/Modals/FixMetaData/FixMetaData.vue')
)
const FixWord = defineAsyncComponent(() => import('@/_components/Modals/FixWord/FixWord.vue'))
const Notification = defineAsyncComponent(
  () => import('@/_components/Notifications/AppNotification/AppNotification.vue')
)
const PreferencesSetup = defineAsyncComponent(
  () => import('@/_components/Modals/Preferences/PreferencesSetup.vue')
)
const Preferences = defineAsyncComponent(
  () => import('@/_components/Modals/Preferences/PreferencesModal.vue')
)

import type { SearchResult } from '@/assets/interfacesExternals'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

// Props shared between SearchPage and FooterPage components
const page = ref(1)
const totalHits = ref()
const searchResults = ref<Array<SearchResult>>([])

// Props for modal boxes
const imageModal = ref({})
const metadataModal = ref({ field: 'author' })
const wordModal = ref({})
const notification = ref({})
const searchPageRef = ref<InstanceType<typeof SearchPage>>()

// Methods exposed by SearchPage
const resetSearchResults = () => searchPageRef.value?.resetSearchResults()
const newPage = () => searchPageRef.value?.newPage()
</script>
