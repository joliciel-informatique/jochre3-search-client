<script setup lang="ts">
import { ref } from 'vue'
import Search from '../components/Search.vue'
import PreferencesModal from '../components/PreferencesModal.vue'

const preferencesVisible = ref<boolean>(false)
function showPreferences() {
  preferencesVisible.value = true
  console.log(`preferencesVisible: ${preferencesVisible.value}`)
}

function hidePreferences() {
  preferencesVisible.value = false
  console.log(`preferencesVisible: ${preferencesVisible.value}`)
}
</script>

<template>
  <main class="container is-max-desktop" :class="{ 'rtl-align': $i18n.locale === 'yi' }">
    <button @click="showPreferences" class="button is-small">Preferences</button>
    <PreferencesModal
      :visible="preferencesVisible"
      @on-close-modal="hidePreferences"
    ></PreferencesModal>
    <h1>Search page</h1>
    <p>{{ $t('message.hello') }}</p>
    <Search />
  </main>
</template>
