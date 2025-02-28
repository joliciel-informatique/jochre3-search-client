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
  <div class="grid has-text-primary pl-2 pt-2">
    <span class="cell has-text-weight-bold">{{ $t(title) }} </span>
    <span class="cell p-2 has-text-primary has-text-left">
      {{ value }}
    </span>
    <span
      class="cell icon menu-list-icon is-clickable"
      aria-labelledby="edit"
      tabindex="3"
      @click="openMetadataModal"
      @keyup.enter="openMetadataModal"
    >
      <font-awesome-icon icon="pen-to-square" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { type Ref } from 'vue'

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
