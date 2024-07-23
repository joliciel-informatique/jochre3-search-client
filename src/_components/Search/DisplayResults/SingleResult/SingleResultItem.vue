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
    <button @click="visible = true" class="button is-small is-white">
      <span class="icon is-small fa-2xs">
        <font-awesome-icon icon="pen-to-square" />
      </span>
    </button>
  </div>
  <FixMetaData 
    v-model:visibility="visible"
    :docRef="docRef"
    :field="field"
    :oldValue="value"
  />
</template>

<script setup lang="ts">
import FixMetaData from '@/_components/Modals/FixMetaData/FixMetaData.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ltr } from '@/assets/appState';
import { ref } from 'vue';

const visible = ref(false)

const {field, value, docRef } = defineProps(['field', 'value', 'docRef'])

let title: string = `results.${field}`
title = field === 'titleEnglish' ? `results.alternate-title` : title
title = field === 'authorEnglish' ? `results.alternate-author` : title
title = field === 'publicationYear' ? `results.publication-year` : title
</script>