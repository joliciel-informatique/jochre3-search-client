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
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/ModalStore'

const modalStore = useModalStore()
const { fixMetadataModalData, showFixMetadataModal } = storeToRefs(modalStore)

const { result, edit } = defineProps({
  result: { type: Object as PropType<SearchResult> },
  edit: { type: String, default: 'title' }
})

const openMetadataModal = (field: string) => {
  const fieldValue = result?.metadata[field]
  const stringValue = Array.isArray(fieldValue) ? fieldValue[0] : fieldValue

  fixMetadataModalData.value = {
    docRef: result?.docRef ?? '',
    field: field,
    value: stringValue
  }
  showFixMetadataModal.value = true
}
</script>
