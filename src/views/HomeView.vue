<template>
  <PreferencesSetup />
  <main
    class="is-widescreen"
    :class="{
      'rtl-align': !preferences.displayLeftToRight
    }"
  >
    <SearchPage
      v-model:search-results="searchResults"
      v-model:total-hits="totalHits"
      v-model:page="page"
      v-model:image-modal="imageModal"
      v-model:word-modal="wordModal"
      v-model:metadata-modal="metadataModal"
      v-model:notification="notification"
      v-model:simple-keyboard="simpleKeyboard"
    />
  </main>
  <FooterPage v-model:total-hits="totalHits" />
  <Preferences v-model:notification="notification" />
  <LargeImage v-model:image-modal="imageModal" />
  <FixWord
    v-model:word-modal="wordModal"
    v-model:notification="notification"
    v-model:simple-keyboard="simpleKeyboard"
  />
  <FixMetaData
    v-model:metadata-modal="metadataModal"
    v-model:notification="notification"
    v-model:simple-keyboard="simpleKeyboard"
  />
  <Notification v-model:notification="notification" />
  <SimpleKeyboard v-model:simple-keyboard="simpleKeyboard" />
</template>

<script setup lang="ts">
import { ref, shallowReactive } from 'vue'
import HeaderPage from '@/components/HeaderPage/HeaderPage.vue'
import SearchPage from '@/components/SearchPage/SearchPage.vue'
import FooterPage from '@/components/FooterPage/FooterPage.vue'
import type { SearchResult } from '@/assets/interfacesExternals'
import LargeImage from '@/_components/Modals/LargeImage/LargeImage.vue'
import FixMetaData from '@/_components/Modals/FixMetaData/FixMetaData.vue'
import FixWord from '@/_components/Modals/FixWord/FixWord.vue'
import Notification from '@/_components/Notifications/AppNotification/AppNotification.vue'
import PreferencesSetup from '@/_components/Modals/Preferences/PreferencesSetup.vue'
import Preferences from '@/_components/Modals/Preferences/PreferencesModal.vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import SimpleKeyboard from '@/_components/SimpleKeyboard/SimpleKeyboard.vue'

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
// const searchPageRef = ref<InstanceType<typeof SearchPage>>()
const simpleKeyboard = shallowReactive({ show: false, attachTo: '', ref: null })

// Methods exposed by SearchPage
// const resetSearchResults = () => searchPageRef.value?.resetSearchResults()
// const newPage = () => searchPageRef.value?.newPage()
</script>
