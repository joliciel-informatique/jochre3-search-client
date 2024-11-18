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
    id="snippets"
    class="is-flex is-justify-content-center bla"
    :class="preferences.isTablet || preferences.isMobile ? `on-mobile` : `on-desktop`"
    tabindex="-1"
    v-if="!isLoading"
  >
    <ul>
      <li v-for="(result, bookIndex) of searchResults" :key="sha1(result)">
        <hr
          :bookindex="bookIndex"
          :id="`hr-${bookIndex}`"
          v-if="displayPerBook"
          class="is-invisible"
        />
        <ul
          class="p-2 pt-4 snippets-on"
          :class="
            preferences.isTablet || preferences.isMobile
              ? `mobile is-hidden-desktop`
              : `desktop is-hidden-mobile`
          "
          v-show="displayPerBook || (!displayPerBook && selectedEntry?.docRef === result.docRef)"
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
            v-model:selected-entry="selectedEntry"
          />
        </ul>
      </li>
    </ul>
  </div>
  <div v-else>
    <h1>{{ $t('loading') }}</h1>
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

const imageModal = defineModel('imageModal')
const wordModal = defineModel('wordModal')
const notification = defineModel('notification')
const selectedEntry = defineModel<SearchResult>('selectedEntry')
const searchResults = defineModel<SearchResult[]>('searchResults')
const query = defineModel<string>('query')
const strict = defineModel<boolean>('strict')
const isLoading = defineModel('isLoading')

// How many snippets for each volume are in view upon scroll only if shown in continuous list
const scrolling = () => {
  if (displayPerBook.value) {
    const snippets =
      preferences.isMobile || preferences.isTablet ? '.snippets-on li' : '.snippets-on li'

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

onMounted(() => document.getElementById('snippets')?.addEventListener('scroll', scrolling))
</script>
