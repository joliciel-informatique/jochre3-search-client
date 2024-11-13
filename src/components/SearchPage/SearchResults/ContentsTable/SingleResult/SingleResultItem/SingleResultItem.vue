<!-- SingleResultItem
Parent: DisplayResults.vue
Children: None
Siblings: None

Props: field, value, docRef
Variables: title (string)
Methods: fixMetaData (imported)

Description: display single metadata item
-->
<template>
  <div class="is-flex is-flex-direction-column has-text-primary pl-2 pt-2">
    <span
      class="is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between has-text-weight-bold"
      >{{ $t(title) }}
      <span
        class="is-flex is-align-self-flex-start icon menu-list-icon is-clickable"
        v-tooltip="[
          preferences.displayLeftToRight ? 'left' : 'right',
          $t('fix-metadata.edit-button-tooltip')
        ]"
        aria-labelledby="edit"
        tabindex="3"
        @click="openMetadataModal"
        @keyup.enter="openMetadataModal"
      >
        <span class="icon fa-sm"> <font-awesome-icon icon="pen-to-square" /></span
      ></span>
    </span>
    <span class="p-2 has-text-primary has-text-left is-align-self-flex-start is-flex-grow-1">{{
      value
    }}</span>
  </div>
</template>

<script setup lang="ts">
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

const { field, value, docRef } = defineProps(['field', 'value', 'docRef'])

const metadataModal = defineModel('metadataModal')

let title: string = `results.${field}`
title = field === 'titleEnglish' ? `results.alternate-title` : title
title = field === 'authorEnglish' ? `results.alternate-author` : title
title = field === 'publicationYear' ? `results.publication-year` : title

const openMetadataModal = () => {
  metadataModal.value = {
    show: true,
    docRef: docRef,
    field: field,
    value: value
  }
}
</script>
