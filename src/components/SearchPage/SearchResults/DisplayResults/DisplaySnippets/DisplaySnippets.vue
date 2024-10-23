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
  <div v-if="displayPerBook">
    <ul v-show="selectedEntry?.docRef === docRef">
      <li v-for="(snippet, index) in snippets" :key="sha1(snippet)">
        <SingleSnippet
          v-model:image-modal="imageModal"
          v-model:word-modal="wordModal"
          v-model:notification="notification"
          v-model:selected-entry="selectedEntry"
          :index="index"
          :snippet="snippet"
          :docRef="docRef"
          :url="url"
        />
      </li>
    </ul>
  </div>
  <div v-else>
    <ul>
      <li v-for="(snippet, index) in snippets" :key="sha1(snippet)">
        <SingleSnippet
          v-model:image-modal="imageModal"
          v-model:word-modal="wordModal"
          v-model:notification="notification"
          v-model:selected-entry="selectedEntry"
          :index="index"
          :snippet="snippet"
          :docRef="docRef"
          :url="url"
        />
      </li>
    </ul>
    <hr />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { sha1 } from 'object-hash'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import type { SearchResult } from '@/assets/interfacesExternals'
import SingleSnippet from './SingleSnippet/SingleSnippet.vue'

const preferences = usePreferencesStore()

const { displayPerBook } = storeToRefs(preferences)

const { docRef } = defineProps(['snippets', 'docRef', 'url'])

const imageModal = defineModel('imageModal')
const wordModal = defineModel('wordModal')
const notification = defineModel('notification')
const selectedEntry = defineModel<SearchResult>('selectedEntry')
</script>
