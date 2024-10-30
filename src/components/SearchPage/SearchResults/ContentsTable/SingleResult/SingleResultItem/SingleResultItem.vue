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
  <div
    class="columns p-2 has-text-primary"
    :class="{
      'has-text-left': preferences.displayLeftToRight,
      'has-text-right': !preferences.displayLeftToRight
    }"
  >
    <span class="column is-6"> {{ $t(title) }}</span>
    <span class="column">{{ value }}</span>
    <span
      class="column is-1 icon menu-list-icon is-clickable"
      :class="{
        'is-pulled-right': preferences.displayLeftToRight,
        'is-pulled-left': !preferences.displayLeftToRight
      }"
      v-tooltip="[
        preferences.displayLeftToRight ? 'left' : 'right',
        $t('fix-metadata.edit-button-tooltip')
      ]"
      aria-labelledby="edit"
      tabindex="3"
      @click="openMetadataModal"
      @keyup.enter="openMetadataModal"
    >
      <span class="icon fa-sm">
        <font-awesome-icon icon="pen-to-square" />
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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
