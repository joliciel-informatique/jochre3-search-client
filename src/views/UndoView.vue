<template>
  <main
    :class="{
      container: true,
      hero: true,
      'is-widescreen': true,
      'rtl-align': !preferences.isLeftToRight,
      yiddish: !preferences.isLeftToRight
    }"
  >
    <HeaderPage />
    <div :class="{ 'ltr-align': $i18n.locale === 'yi', english: $i18n.locale === 'yi' }">
      <p v-if="responseCode == 200">Metadata correction {{ route.params.id }} undone.</p>
      <p v-if="responseCode != 200">An error occurred.</p>
      <p v-if="responseCode == 404">Metadata correction {{ route.params.id }} not found.</p>
    </div>
  </main>
  <FooterPage />
</template>

<script setup lang="ts">
import HeaderPage from '@/components/HeaderPage/HeaderPage.vue'
import FooterPage from '@/components/FooterPage/FooterPage.vue'

import { useKeycloakStore } from '@/stores/KeycloakStore'
import axios from 'axios'
import { inject, onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

const route = useRoute()
const keycloak = useKeycloakStore().keycloak
const API_URL = inject('apiUrl')

const responseCode = ref<number>()

onMounted(async () => {
  const idStr = route.params.id
  const id: number = +idStr
  undoCorrection(id)
})

onBeforeRouteUpdate(async (to, from) => {
  // react to route changes...
  const idStr = to.params.id
  const id: number = +idStr
  undoCorrection(id)
})

async function undoCorrection(metadataCorrectionId: number): Promise<void> {
  console.log(`Undoing correction ${metadataCorrectionId}`)
  axios
    .post(
      `${API_URL}/undo-correction/${metadataCorrectionId}`,
      {},
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${keycloak?.token}`
        }
      }
    )
    .then(() => {
      console.log(`Undo performed`)
      responseCode.value = 200
    })
    .catch((error) => {
      console.error(error)
      responseCode.value = error.response.status
    })
}
</script>
