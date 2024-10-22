<!-- DisplayResults
Parent: SearchPage.vue
Children: SingleResult
Siblings: None

Props: searchResults, totalHits, page
Variables: none
Methods: none

Description: display results in SingleResult child component
-->
<template>
  <div>
    <!-- Loading -->
    <h1 v-if="isLoading">{{ $t('loading') }}</h1>

    <!-- No results for query -->
    <h1 v-else-if="query.length && !searchResults?.length">
      <span class="no-results"> {{ $t('results.none') }}! </span>
      <div class="is-justify-content-center is-align-items-center no-results-image m-6">
        <FontAwesomeIcon class="fa-10x" icon="ban" />
      </div>
    </h1>

    <!-- Display results -->
    <div class="columns" v-else-if="searchResults?.length">
      <div class="column is-3">
        <ContentsTable
          v-model:search-results="searchResults"
          v-model:page="page"
          v-model:image-modal="imageModal"
          v-model:metadata-modal="metadataModal"
          v-model:notification="notification"
          v-model:word-modal="wordModal"
          v-model:selected-entry="firstSearchResult"
          v-model:total-hits="totalHits"
        />
      </div>
      <div class="column mr-6 ml-6" tabindex="-1">
        <ul>
          <li v-for="result of searchResults" :key="sha1(result)">
            <DisplaySnippets
              v-model:image-modal="imageModal"
              v-model:notification="notification"
              v-model:word-modal="wordModal"
              v-model:selected-entry="firstSearchResult"
              :snippets="result.snippets"
              :doc-ref="result.docRef"
              :url="result.metadata.url"
            />
          </li>
        </ul>
      </div>
      <div class="column is-2">
        <FacetBar
          @newSearch="emit('newSearch')"
          @resetSearchResults="emit('resetSearchResults')"
          v-model:is-loading="isLoading"
          v-model:facets="facets"
        />
      </div>
    </div>

    <!-- Show index size page upon no search params -->
    <IndexSize v-else v-model:is-loading="isLoading" v-model:notification="notification" />
  </div>
</template>

<script setup lang="ts">
import { sha1 } from 'object-hash'
import DisplaySnippets from './DisplaySnippets/DisplaySnippets.vue'
import IndexSize from './IndexSize/IndexSize.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { type Ref } from 'vue'
import ContentsTable from './ContentsTable/ContentsTable.vue'
import type { SearchResult } from '@/assets/interfacesExternals'
import FacetBar from './FacetBar/FacetBar.vue'
library.add(faBan)

const emit = defineEmits(['newSearch', 'resetSearchResults'])

const isLoading = defineModel('isLoading')
const imageModal = defineModel('imageModal')
const wordModal = defineModel('wordModal')
const page = defineModel('page')
const totalHits = defineModel('totalHits')
const metadataModal = defineModel('metadataModal')
const notification = defineModel('notification')
const query: Ref = defineModel('query')
const searchResults = defineModel<Array<SearchResult>>('searchResults')
const firstSearchResult = defineModel<SearchResult>('firstSearchResult')
const facets: Ref = defineModel('facets')
</script>
