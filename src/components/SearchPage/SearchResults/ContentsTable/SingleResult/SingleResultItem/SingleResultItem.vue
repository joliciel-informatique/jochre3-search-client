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
  <div class="columns is-vcentered has-text-primary pl-2 pt-2 pr-1">
    <span
      class="column has-text-weight-boldis-one-fifth"
      :class="preferences.interfaceStyle == 'old' ? 'is-one-fifth' : ''"
    >
      {{ $t(title) }}
    </span>
    <span
      class="column p-2 has-text-primary is-three-fifth"
      :class="{
        'has-text-left': preferences.displayLeftToRight,
        'has-text-right': !preferences.displayLeftToRight,
        'ltr-no-text-align':
          preferences.needsLeftToRight &&
          (field == 'titleEnglish' ||
            field == 'authorEnglish' ||
            field == 'publisher' ||
            field == 'publicationYear'),
        'rtl-no-text-align': preferences.needsRightToLeft && field == 'author'
      }"
    >
      {{ value }}
    </span>
    <span class="column is-flex is-justify-content-end" aria-labelledby="edit" tabindex="3">
      <span class="icon menu-list-icon is-clickable is-one-fifth">
        <font-awesome-icon
          icon="pen-to-square"
          @click="openMetadataModal"
          @keyup.enter="openMetadataModal"
      /></span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { type Ref } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { storeToRefs } from 'pinia'
const preferences = usePreferencesStore()

const field: Ref = defineModel('field')
const value: Ref = defineModel('value')
const docRef: Ref = defineModel('docRef')

const metadataModal = defineModel('metadataModal')

let title: string = `results.${field.value}`
title = field.value === 'titleEnglish' ? `results.alternate-title` : title
title = field.value === 'authorEnglish' ? `results.alternate-author` : title
title = field.value === 'publicationYear' ? `results.publication-year` : title

const openMetadataModal = () => {
  metadataModal.value = {
    show: true,
    docRef: docRef.value,
    field: field.value,
    value: value.value
  }
}
</script>
