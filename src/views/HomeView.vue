<template>
  <div
    :class="{
      'rtl-align': !preferences.displayLeftToRight
    }"
  >
    <PreferencesSetup />
    <SearchPage
      v-model:image-modal="imageModal"
      v-model:word-modal="wordModal"
      v-model:metadata-modal="metadataModal"
      v-model:notification="notification"
    />
    <Preferences v-model:notification="notification" />
    <LargeImage v-model:image-modal="imageModal" />
    <FixWord v-model:word-modal="wordModal" v-model:notification="notification" />
    <FixMetaData v-model:metadata-modal="metadataModal" v-model:notification="notification" />
    <Notification v-model:notification="notification" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchPage from '@/components/SearchPage/SearchPage.vue'
import LargeImage from '@/_components/Modals/LargeImage/LargeImage.vue'
import FixMetaData from '@/_components/Modals/FixMetaData/FixMetaData.vue'
import FixWord from '@/_components/Modals/FixWord/FixWord.vue'
import Notification from '@/_components/Notifications/AppNotification/AppNotification.vue'
import PreferencesSetup from '@/_components/Modals/Preferences/PreferencesSetup.vue'
import Preferences from '@/_components/Modals/Preferences/PreferencesModal.vue'

import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

// Props for modal boxes
const imageModal = ref({})
const metadataModal = ref({ field: 'author' })
const wordModal = ref({})
const notification = ref({})
</script>
