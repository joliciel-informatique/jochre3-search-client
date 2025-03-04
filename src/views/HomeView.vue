<template>
  <div
    :class="[!preferences.displayLeftToRight ? 'rtl-align' : '']"
    :style="preferences.interfaceStyle === 'old' ? 'overflow:auto' : ''"
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
import { ref, defineAsyncComponent } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const SearchPage = defineAsyncComponent(() => import('@/components/SearchPage/SearchPage.vue'))
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

const preferences = usePreferencesStore()

// Props for modal boxes
const imageModal = ref({})
const metadataModal = ref({ field: 'author' })
const wordModal = ref({})
const notification = ref({})
</script>
