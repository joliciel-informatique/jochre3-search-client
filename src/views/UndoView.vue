<template>
  <main class="hero is-widescreen">
    <HeaderPage />
    <div class="p-3 m-3">
      <p v-if="responseCode == 200">Metadata correction {{ route.params.id }} undone.</p>
      <p v-else-if="responseCode == 404">Metadata correction {{ route.params.id }} not found.</p>
      <p v-else>An error occurred (Response code {{ responseCode }}).</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { fetchData } from '@/assets/fetchMethods'

const HeaderPage = defineAsyncComponent(() => import('@/components/HeaderPage/HeaderPage.vue'))

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
      responseCode.value = res.status
    })
    .catch((error) => {
      console.error(error)
      responseCode.value = error.response.status
    })
}
</script>
