<template>
  <div
    :class="{
      'rtl-align': !preferences.displayLeftToRight
    }"
  >
    <header id="topbar" class="is-flex is-flex-direction-column-reverse">
      <PreferencesSetup />
      <HeaderPage />
      <nav class="is-flex is-flex-direction-column navbar" id="navbar" role="navigation">
        <div class="navbar-brand is-flex is-flex-direction-row is-justify-content-space-between">
          <UserOptions />
        </div>
      </nav>
    </header>
    <main class="hero is-widescreen">
      <TranscribedText v-model:notification="notification" />
      <Notification v-model:notification="notification" />
      <Preferences v-model:notification="notification" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderPage from '@/components/HeaderPage/HeaderPage.vue'
import TranscribedText from '@/components/TranscribedText/TranscribedText.vue'
import Notification from '@/_components/Notifications/AppNotification/AppNotification.vue'
import UserOptions from '@/components/SearchPage/UserOptions/UserOptions.vue'
import PreferencesSetup from '@/_components/Modals/Preferences/PreferencesSetup.vue'
import Preferences from '@/_components/Modals/Preferences/PreferencesModal.vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()
const notification = ref({})
</script>
