<template>
  <div
    :class="{
      'rtl-align': !preferences.displayLeftToRight
    }"
    style="overflow: auto; max-height: 100vh"
  >
    <PreferencesSetup />
    <HeaderPage />
    <!-- <UserOptions /> -->
    <TranscribedText />
    <Preferences />
    <Notification />
  </div>
</template>

<script setup lang="ts">
import HeaderPage from '@/components/HeaderPage/HeaderPage.vue'
import TranscribedText from '@/components/TranscribedText/TranscribedText.vue'
import Notification from '@/_components/Notifications/AppNotification/AppNotification.vue'
import UserOptions from '@/components/SearchPage/UserOptions/UserOptions.vue'
import PreferencesSetup from '@/_components/Modals/Preferences/PreferencesSetup.vue'
import Preferences from '@/_components/Modals/Preferences/PreferencesModal.vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()
</script>
