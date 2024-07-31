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
  <div v-if="!isBusy && hasSearch && searchResults.length > 0">
    <div>
      <strong>
        {{ $t('results.result-count', [totalHits]) }}
        {{ $t('results.result-range', [firstResult, lastResult]) }}
      </strong>
    </div>
    <ul>
      <li v-for="result of searchResults" :key="sha1(result)">
        <SingleResult :result="result" />
      </li>
      <hr />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { sha1 } from 'object-hash'
import { computed, type Ref } from 'vue'
import { preferences } from '@/assets/fetchMethods'
import { isBusy, hasSearch } from '@/assets/appState'
import SingleResult from './SingleResult/SingleResult.vue'

const { searchResults } = defineProps(['searchResults'])
const page: Ref = defineModel('page')
const totalHits: Ref = defineModel('totalHits')

const firstResult = computed(() => (page.value - 1) * preferences.resultsPerPage + 1)
const lastResult = computed(() => {
  const last = page.value * preferences.resultsPerPage
  return totalHits.value < last ? totalHits.value : last
})
</script>
