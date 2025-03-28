<template>
  <span class="icon menu-list-icon is-clickable is-vcentered" tabindex="3">
    <font-awesome-icon
      icon="pen-to-square"
      size="sm"
      @click="openMetadataModal(edit)"
      @keyup.enter="openMetadataModal(edit)"
    />
  </span>
</template>

<script setup lang="ts">
import type { SearchResult } from '@/assets/interfacesExternals'
import type { PropType } from 'vue'

const metadataModal = defineModel('metadataModal')
const { result, edit } = defineProps({
  result: { type: Object as PropType<SearchResult> },
  edit: { type: String, default: 'title' }
})

const openMetadataModal = (field: string) => {
  metadataModal.value = {
    show: true,
    docRef: result?.docRef,
    field: field,
    value: result?.metadata[field]
  }
}
</script>
