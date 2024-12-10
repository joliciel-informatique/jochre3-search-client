<template>
  <main
    class="hero is-widescreen"
    :class="{
      'rtl-align': !preferences.displayLeftToRight
    }"
  >
    <HeaderPage />
    <div
      :class="{ 'ltr-align': preferences.needsLeftToRight, english: preferences.needsLeftToRight }"
    >
      <p v-if="responseCode == 200">Metadata correction {{ route.params.id }} undone.</p>
      <p v-if="responseCode != 200">An error occurred.</p>
      <p v-if="responseCode == 404">Metadata correction {{ route.params.id }} not found.</p>
    </div>
  </main>
  <FooterPage />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { fetchData } from '@/assets/fetchMethods'

const HeaderPage = defineAsyncComponent(() => import('@/components/HeaderPage/HeaderPage.vue'))
const FooterPage = defineAsyncComponent(() => import('@/components/FooterPage/FooterPage.vue'))

const preferences = usePreferencesStore()
const route = useRoute()

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
  fetchData(`undo-correction/${metadataCorrectionId}`, 'post')
    .then((res) => {
      if (res.status === 200) {
        console.log(`Undo performed`)
      } else {
        console.error(`Undo failed. Response: ${res.status}`)
      }
    })
    .catch((error) => {
      console.error(error)
      responseCode.value = error.response.status
    })
}
</script>
