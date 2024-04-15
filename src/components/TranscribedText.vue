<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUpdate, inject, watch } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import axios from 'axios'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const router = useRouter()
const route = useRoute()
const keycloak = useKeycloakStore().keycloak
const preferences = usePreferencesStore()
const API_URL = inject('apiUrl')

const docText = ref<string>('')

onMounted(async () => {
  const docRef = route.params.docRef
  updateText(docRef as string)
})

onBeforeRouteUpdate(async (to, from) => {
  // react to route changes...
  updateText(to.params.docRef as string)
})

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

async function updateText(docRef: string): Promise<void> {
  console.log(`Updating text for ${docRef}`)
  axios
    .get<string>(`${API_URL}/text-as-html`, {
      params: {
        'doc-ref': docRef
      },
      headers: {
        accept: 'text/html',
        Authorization: `Bearer ${keycloak?.token}`
      }
    })
    .then((response) => {
      const text = response.data
      console.log(`Received text with length ${text.length}`)
      docText.value = text
    })
    .then(() => {
      delay(300)
    })
    .then(() => {
      const pageElement = document.getElementById(`page${route.params.page}`)
      console.log(`found element ${pageElement}`)
      pageElement?.scrollIntoView()
    })
}
</script>

<template>
  <div v-html="docText" class="rtl-align yiddish"></div>
</template>
