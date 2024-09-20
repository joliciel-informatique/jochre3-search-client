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
      <div class="column is-one-quarter">
        <ContentsTable v-model:search-results="searchResults" />
      </div>
      <div class="column">
        <ul>
          <li v-for="(result, index) of searchResults" :key="sha1(result)">
            <div>
              <SingleResult
                v-model:image-modal="imageModal"
                v-model:word-modal="wordModal"
                v-model:metadata-modal="metadataModal"
                v-model:notification="notification"
                :result="result"
              />
            </div>
            <hr v-if="index !== preferences.resultsPerPage - 1" />
          </li>
        </ul>
      </div>
    </div>

    <!-- Show index size page upon no search params -->
    <IndexSize v-else v-model:is-loading="isLoading" v-model:notification="notification" />
  </div>
</template>

<script setup lang="ts">
import { sha1 } from 'object-hash'
import { preferences } from '@/assets/fetchMethods'
import SingleResult from './SingleResult/SingleResult.vue'
import IndexSize from './IndexSize/IndexSize.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { type Ref } from 'vue'
import ContentsTable from './ContentsTable/ContentsTable.vue'
library.add(faBan)

const isLoading = defineModel('isLoading')
const imageModal = defineModel('imageModal')
const wordModal = defineModel('wordModal')
const metadataModal = defineModel('metadataModal')
const notification = defineModel('notification')
const query: Ref = defineModel('query')
const searchResults: Ref = defineModel('searchResults')
</script>
