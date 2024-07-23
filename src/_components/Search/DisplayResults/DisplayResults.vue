<template>
  <div v-if="!isBusy.value && hasSearch.value && searchResults.value.length > 0">
    <div>
      <strong>
        {{ $t('results.result-count', [totalHits.value]) }}
        {{ $t('results.result-range', [firstResult, lastResult]) }}
      </strong>
    </div>
    <ul>
      <li v-for="(result, index) of searchResults.value" :key="index">
        <SingleResult :result="result" />
      </li>
      <hr />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { preferences } from '@/assets/fetchMethods';
import { isBusy, hasSearch } from '@/assets/appState';
import { searchResults, totalHits, page } from '@/components/SearchPage/SearchPage-variables';
import SingleResult from './SingleResult/SingleResult.vue'

const firstResult = computed(() => (page.value - 1) * preferences.resultsPerPage + 1)
const lastResult = computed(() => {
  const last = page.value * preferences.resultsPerPage
  return totalHits.value < last ? totalHits.value : last
})

</script>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>
