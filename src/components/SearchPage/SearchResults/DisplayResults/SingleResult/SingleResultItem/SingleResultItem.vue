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
    :class="{
      columns: true,
      'has-text-left': preferences.displayLeftToRight,
      'has-text-right': !preferences.displayLeftToRight
    }"
  >
    <span class="is-size-6 column is-one-quarter">
      <strong>{{ $t(title) }}</strong
      >:
    </span>
    <span class="column">{{ value }}</span>
    <button
      @click="openMetadataModal"
      :class="{
        button: true,
        'is-small': true,
        'is-white': true,
        'is-pulled-right': preferences.displayLeftToRight,
        'is-pulled-left': !preferences.displayLeftToRight
      }"
    >
      <span class="icon is-small fa-2xs">
        <font-awesome-icon icon="pen-to-square" />
      </span>
    </button>
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
