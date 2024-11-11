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
  <div class="snippetsColumn column" tabindex="-1">
    <!-- Showing results -->
    <div v-if="!isLoading">
      <!-- On desktop -->
      <div class="snippets-on-desktop is-hidden-touch">
        <ul>
          <li v-for="(result, bookIndex) of searchResults" :key="sha1(result)">
            <div v-if="!displayPerBook">
              <ul v-show="selectedEntry?.docRef === result.docRef">
                <SingleSnippet
                  v-for="(snippet, index) in result.snippets"
                  :key="sha1(snippet)"
                  :docRef="result.docRef"
                  :bookIndex="bookIndex"
                  :snippetIndex="index"
                  :snippet="snippet"
                  :url="result.url"
                  v-model:image-modal="imageModal"
                  v-model:word-modal="wordModal"
                  v-model:notification="notification"
                  v-model:selected-entry="selectedEntry"
                />
              </ul>
            </div>
            <div v-else>
              <ul>
                <hr :bookindex="bookIndex" :id="`desktop-hr-${bookIndex}`" />
                <SingleSnippet
                  v-for="(snippet, index) in result.snippets"
                  :key="sha1(snippet)"
                  v-model:image-modal="imageModal"
                  v-model:word-modal="wordModal"
                  v-model:notification="notification"
                  v-model:selected-entry="selectedEntry"
                  :snippet="snippet"
                  :docRef="result.docRef"
                  :url="result.url"
                  :bookIndex="bookIndex"
                  :snippetIndex="index"
                />
              </ul>
            </div>
          </li>
        </ul>
      </div>

      <!-- On mobile -->
      <div class="snippets-on-mobile is-hidden-desktop">
        <ul>
          <li v-for="(result, bookIndex) of searchResults" :key="sha1(result)">
            <div v-if="!displayPerBook">
              <ul v-show="selectedEntry?.docRef === result.docRef">
                <SingleSnippet
                  v-for="(snippet, index) in result.snippets"
                  :key="sha1(snippet)"
                  v-model:image-modal="imageModal"
                  v-model:word-modal="wordModal"
                  v-model:notification="notification"
                  v-model:selected-entry="selectedEntry"
                  :snippet="snippet"
                  :docRef="result.docRef"
                  :url="result.url"
                  :bookIndex="bookIndex"
                  :snippetIndex="index"
                />
              </ul>
            </div>
            <div v-else>
              <ul>
                <hr :bookindex="bookIndex" :id="`mobile-hr-${bookIndex}`" />
                <SingleSnippet
                  v-for="(snippet, index) in result.snippets"
                  :key="sha1(snippet)"
                  v-model:image-modal="imageModal"
                  v-model:word-modal="wordModal"
                  v-model:notification="notification"
                  v-model:selected-entry="selectedEntry"
                  :snippet="snippet"
                  :docRef="result.docRef"
                  :url="result.url"
                  :bookIndex="bookIndex"
                  :snippetIndex="index"
                />
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <h1>{{ $t('loading') }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { sha1 } from 'object-hash'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import type { SearchResult } from '@/assets/interfacesExternals'
import SingleSnippet from '../DisplaySnippets/SingleSnippet/SingleSnippet.vue'
import { isInView, mobileCheck } from '@/assets/functions'
import { onMounted } from 'vue'

const preferences = usePreferencesStore()

const { displayPerBook } = storeToRefs(preferences)

const imageModal = defineModel('imageModal')
const wordModal = defineModel('wordModal')
const notification = defineModel('notification')
const selectedEntry = defineModel<SearchResult>('selectedEntry')
const searchResults = defineModel<SearchResult[]>('searchResults')
const isLoading = defineModel('isLoading')

// How many snippets for each volume are in view upon scroll only if shown in continuous list
const scrolling = () => {
  if (displayPerBook.value) {
    const snippets = !mobileCheck()
      ? '.snippets-on-desktop li div .card.snippet'
      : '.snippets-on-mobile li div .card.snippet'

    const snippetsInView = Array.from(document.querySelectorAll(snippets))
      .map((snippet) => (isInView(snippet) ? snippet.getAttribute('bookindex') : null))
      .filter((x) => x)

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
