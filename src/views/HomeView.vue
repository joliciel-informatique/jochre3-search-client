<template>
  <div
    :class="[
      !preferences.displayLeftToRight ? 'rtl-align' : '',
      preferences.interfaceStyle == 'old' ? 'scrollBody' : ''
    ]"
    :style="preferences.interfaceStyle == 'old' ? 'overflow: auto; max-height: 100vh' : ''"
  >
    <PreferencesSetup />
    <SearchPage v-model:image-modal="imageModal" />
    <Preferences />
    <LargeImage v-model:image-modal="imageModal" />
    <FixWord />
    <FixMetaData />
    <Notification />
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
</script>
