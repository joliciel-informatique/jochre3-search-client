<template>
  <div>
    <strong>{{ $t(title) }}&nbsp;</strong>
    <span :class="field === 'author' ? '' : ltr">
      {{ value }}
    </span>
    <button @click="fixMetaData(docRef, field, value)" class="button is-small is-white">
      <span class="icon is-small fa-2xs">
        <font-awesome-icon icon="pen-to-square" />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { fixMetaData } from '@/_components/Modals/FixMetaData/FixMetaData-methods';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ltr } from '@/assets/appState';

const props = defineProps(['field', 'value', 'docRef'])

let title: string = `results.${props.field}`
title = props.field === 'titleEnglish' ? `results.alternate-title` : title
title = props.field === 'authorEnglish' ? `results.alternate-author` : title
title = props.field === 'publicationYear' ? `results.publication-year` : title
</script>