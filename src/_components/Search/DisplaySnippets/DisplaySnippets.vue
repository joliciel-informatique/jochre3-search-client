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
    <li v-for="snippet in snippets" :key="sha1(snippet)">
      <SingleSnippet :snippet="snippet" :docRef="docRef" :url="url" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import SingleSnippet from './SingleSnippet/SingleSnippet.vue'
import { sha1 } from 'object-hash'

defineProps(['snippets', 'docRef', 'url'])
</script>
