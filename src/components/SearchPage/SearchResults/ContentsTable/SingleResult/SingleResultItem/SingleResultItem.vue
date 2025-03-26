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
    class="is-vcentered has-text-primary pl-2 pt-1 pr-2"
    :class="{
      'has-text-left': preferences.displayLeftToRight,
      'has-text-right': !preferences.displayLeftToRight,
      columns: preferences.interfaceStyle == 'old'
    }"
  >
    <span
      class="has-text-weight-bold"
      :class="{
        column: preferences.interfaceStyle == 'old',
        'is-one-fifth': preferences.interfaceStyle == 'old'
      }"
    >
      {{ $t(title) }}:&nbsp;
    </span>
    <span
      class="has-text-primary"
      :class="{
        column: preferences.interfaceStyle == 'old',
        'is-four-fifth': preferences.interfaceStyle == 'old'
      }"
    >
      <span
        :class="{
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
      <span class="icon menu-list-icon is-clickable" tabindex="3">
        &nbsp;&nbsp;&nbsp;
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
