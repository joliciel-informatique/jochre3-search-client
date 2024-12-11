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
  <div
    class="is-flex is-justify-content-center bla"
    :class="
      preferences.isMobile || preferences.isTablet || preferences.isPortrait
        ? `on-mobile`
        : `on-desktop`
    "
    tabindex="-1"
    v-if="!isLoading && searchResults?.length"
  >
    <ul id="snippets">
      <li v-for="(result, bookIndex) of searchResults" :key="sha1(result)">
        <hr
          :bookindex="bookIndex"
          :id="`hr-${bookIndex}`"
          v-if="displayPerBook"
          class="is-invisible"
        />
        <BookHeader
          :bookIndex="bookIndex"
          :title="result.metadata.title"
          :author="result.metadata.author"
        />
        <ul
          class="p-2 pt-4 snippets-on"
          :class="
            preferences.isMobile || preferences.isTablet || preferences.isPortrait
              ? `mobile is-hidden-desktop`
              : `desktop is-hidden-touch`
          "
          v-show="
            displayPerBook ||
            (!displayPerBook && searchResults[selectedEntryIdx]?.docRef === result.docRef)
          "
        >
          <SingleSnippet
            v-for="(snippet, index) in result.snippets"
            :key="sha1(snippet)"
            :docRef="result.docRef"
            :bookIndex="bookIndex"
            :snippetIndex="index"
            :snippet="snippet"
            :url="result.metadata.url"
            :query="query"
            :strict="strict"
            :title="result.metadata.title"
            :author="result.metadata.author"
            v-model:image-modal="imageModal"
            v-model:word-modal="wordModal"
            v-model:notification="notification"
            v-model:selected-entry-idx="selectedEntryIdx"
          />
        </ul>
      </li>
    </ul>
  </div>
  <div v-else>
    <h1>{{ $t('results.loading') }}</h1>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { sha1 } from 'object-hash'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import type { SearchResult } from '@/assets/interfacesExternals'
import SingleSnippet from '../DisplaySnippets/SingleSnippet/SingleSnippet.vue'
import { defineAsyncComponent, onMounted, onUpdated } from 'vue'

const BookHeader = defineAsyncComponent(
  () => import('@/components/SearchPage/SearchResults/DisplaySnippets/BookHeader/BookHeader.vue')
)

const preferences = usePreferencesStore()

const { displayPerBook } = storeToRefs(preferences)

const imageModal = defineModel('imageModal')
const wordModal = defineModel('wordModal')
const notification = defineModel('notification')
const selectedEntryIdx = defineModel<number>('selectedEntryIdx', { default: 0 })
const searchResults = defineModel<SearchResult[]>('searchResults')
const query = defineModel<string>('query')
const strict = defineModel<boolean>('strict')
const isLoading = defineModel('isLoading')

// How many snippets for each volume are in view upon scroll only if shown in continuous list
const scrolling = () => {
  if (displayPerBook.value) {
    // First/top element is marked as active by default
    // Check if user scrolled all the way down: mark last element as active
    // If else: activate books below the middle of the screen

    const snippetsDiv = document.getElementById('snippets')
    const snippets = Array.from(document.querySelectorAll('.snippets-on li'))

    if (snippetsDiv && snippets.length) {
      if (snippetsDiv.scrollTop === 0) {
        selectedEntryIdx.value = 0 // top
      } else if (
        snippetsDiv.scrollHeight ===
          Math.floor(snippetsDiv.scrollTop + snippetsDiv.getBoundingClientRect().height) ||
        snippetsDiv.scrollHeight ===
          Math.ceil(snippetsDiv.scrollTop + snippetsDiv.getBoundingClientRect().height)
      ) {
        if (searchResults.value) selectedEntryIdx.value = searchResults.value.length - 1 // bottom
      } else if (
        snippetsDiv.scrollHeight >
        Math.floor(snippetsDiv.scrollTop + snippetsDiv.getBoundingClientRect().height)
      ) {
        selectedEntryIdx.value = Math.max(
          ...snippets.map((snippet: Element) => {
            const bookIndex = snippet.getAttribute('bookindex')
            return Math.ceil((snippet as HTMLElement).getBoundingClientRect().top) <
              snippetsDiv.offsetHeight / 2 && bookIndex
              ? +bookIndex
              : 0
          })
        )
      } else {
        // Scrolling down
        console.log('else')
      }
    }
  }
}

onMounted(() => document.getElementById('snippets')?.addEventListener('scroll', scrolling))
onUpdated(() => document.getElementById('snippets')?.addEventListener('scroll', scrolling))
</script>
