<!-- DisplaySnippets
Parent: SingleResult.vue
Children: SingleSnippet.vue
Siblings: None

Props: snippets (Snippet), docRef (string), url (string)
Variables: none
Methods: none

Description: controls text snippets from the OCR text
-->
<template>
  <ul>
    <li v-for="(snippet, index) in snippets" :key="sha1(snippet)">
      <SingleSnippet
        v-model:image-modal="imageModal"
        v-model:word-modal="wordModal"
        :index="index"
        :snippet="snippet"
        :docRef="docRef"
        :url="url"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import SingleSnippet from './SingleSnippet/SingleSnippet.vue'
import { sha1 } from 'object-hash'

const imageModal = defineModel('imageModal')
const wordModal = defineModel('wordModal')

defineProps(['snippets', 'docRef', 'url'])
</script>
