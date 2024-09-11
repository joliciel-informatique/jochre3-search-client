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
  <div>
    <strong>{{ $t(title) }}&nbsp;</strong>
    <span :class="field === 'author' ? '' : ltr">
      {{ value }}
    </span>
    <button @click="openMetadataModal" class="button is-small is-white is-pulled-right">
      <span class="icon is-small fa-2xs">
        <font-awesome-icon icon="pen-to-square" />
      </span>
    </button>
    <!-- <button @click="visible = true" class="button is-small is-white">
      <span class="icon is-small fa-2xs">
        <font-awesome-icon icon="pen-to-square" />
      </span>
    </button> -->
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ltr } from '@/assets/appState'

const { field, value, docRef } = defineProps(['field', 'value', 'docRef'])

const metadataModal = defineModel('metadataModal')

let title: string = `results.${field}`
title = field === 'titleEnglish' ? `results.alternate-title` : title
title = field === 'authorEnglish' ? `results.alternate-author` : title
title = field === 'publicationYear' ? `results.publication-year` : title

const openMetadataModal = () => {
  metadataModal.value = {
    open: true,
    docRef: docRef,
    field: field,
    value: value
  }
}
</script>
