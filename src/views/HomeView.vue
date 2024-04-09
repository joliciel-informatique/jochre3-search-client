<script setup lang="ts">
import { ref } from 'vue'
import Search from '../components/Search.vue'
import PreferencesModal from '../components/PreferencesModal.vue'
import { useKeycloakStore } from '@/stores/KeycloakStore'

const keycloak = useKeycloakStore().keycloak

const preferencesVisible = ref<boolean>(false)
function showPreferences() {
  preferencesVisible.value = true
  console.log(`preferencesVisible: ${preferencesVisible.value}`)
}

function hidePreferences() {
  preferencesVisible.value = false
  console.log(`preferencesVisible: ${preferencesVisible.value}`)
}

function logout() {
  keycloak?.logout()
}
</script>

<template>
  <main
    class="container is-max-desktop"
    :class="{ 'rtl-align': $i18n.locale === 'yi', yiddish: $i18n.locale === 'yi' }"
  >
    <button @click="showPreferences" class="button is-small">Preferences</button>
    <button @click="logout" class="button is-small">Logout</button>
    <PreferencesModal
      :visible="preferencesVisible"
      @on-close-modal="hidePreferences"
    ></PreferencesModal>
    <h1>Search page</h1>
    <Search />
  </main>
</template>
