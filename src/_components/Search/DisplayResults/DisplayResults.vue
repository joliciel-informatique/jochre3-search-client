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
  <!-- No results for query -->
  <div v-if="searchResults.length == 0 && query.length > 0 && !isLoading">
    <h1>
      <span class="no-results">
        {{ $t('results.none') }}!
        <div class="is-justify-content-center is-align-items-center no-results-image">
          <FontAwesomeIcon class="fa-10x" icon="ban" />
        </div>
      </span>
    </h1>
  </div>
  <!-- Display results -->
  <div v-if="!isBusy && hasSearch && searchResults.length > 0 && query.length > 0">
    <ul>
      <li v-for="(result, index) of searchResults" :key="sha1(result)">
        <div>
          <SingleResult :result="result" />
        </div>
        <hr v-if="index !== preferences.resultsPerPage - 1" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { sha1 } from 'object-hash'
import { type Ref } from 'vue'
import { preferences } from '@/assets/fetchMethods'
import { isBusy, hasSearch } from '@/assets/appState'
import SingleResult from './SingleResult/SingleResult.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faBan)

const { query, searchResults } = defineProps(['query', 'searchResults'])
const isLoading: Ref = defineModel('isLoading')
</script>
