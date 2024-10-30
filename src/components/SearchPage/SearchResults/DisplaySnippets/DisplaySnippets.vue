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
  <div v-if="!displayPerBook">
    <ul v-show="selectedEntry?.docRef === docRef">
      <li v-for="(snippet, index) in snippets" :key="sha1(snippet)">
        <SingleSnippet
          v-model:image-modal="imageModal"
          v-model:word-modal="wordModal"
          v-model:notification="notification"
          v-model:selected-entry="selectedEntry"
          :index="index"
          :bookIndex="bookIndex"
          :snippet="snippet"
          :docRef="docRef"
          :url="url"
        />
      </li>
    </ul>
  </div>
  <div v-else>
    <ul>
      <li v-for="(snippet, index) in snippets" :key="sha1(snippet)" :bookIndex>
        <SingleSnippet
          v-model:image-modal="imageModal"
          v-model:word-modal="wordModal"
          v-model:notification="notification"
          v-model:selected-entry="selectedEntry"
          :index="index"
          :bookIndex="bookIndex"
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
import SingleSnippet from '../DisplaySnippets/SingleSnippet/SingleSnippet.vue'
import { isInView } from '@/assets/functions'
import { onMounted } from 'vue'

const preferences = usePreferencesStore()

const { displayPerBook } = storeToRefs(preferences)

const { docRef } = defineProps(['snippets', 'docRef', 'url', 'bookIndex'])

const imageModal = defineModel('imageModal')
const wordModal = defineModel('wordModal')
const notification = defineModel('notification')
const selectedEntry = defineModel<SearchResult>('selectedEntry')
const searchResults = defineModel<SearchResult[]>('searchResults')

// How many snippets for each volume are in view upon scroll only if shown in contiguous list
const scrolling = () => {
  if (displayPerBook.value) {
    const snippetsInView = Array.from(document.querySelectorAll('li div .card.snippet'))
      .map((snippet) => (isInView(snippet) ? snippet : null))
      .filter((x) => x)
      .map((snippet) => snippet?.getAttribute('bookindex'))

    const idx = snippetsInView
      .sort(
        (a, b) =>
          snippetsInView.filter((v) => v === a).length -
          snippetsInView.filter((v) => v === b).length
      )
      .pop()

    if (idx && searchResults.value) selectedEntry.value = searchResults.value[+idx]
  }
}

onMounted(() => window.addEventListener('scroll', scrolling))
</script>
