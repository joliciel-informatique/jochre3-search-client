<template>
  <div id="searchInfo" class="search-info">
    <div class="search-info-background">
      <strong>
        {{ $t('results.result-count', [totalHits]) }}
        {{ $t('results.result-range', [firstResult, lastResult]) }}
      </strong>
    </div>
  </div>
</template>
<script setup lang="ts">
import { preferences } from '@/assets/fetchMethods'
import { computed, type Ref } from 'vue'

const page: Ref = defineModel('page')
const totalHits: Ref = defineModel('totalHits')
const { searchResults } = defineProps(['searchResults'])

const firstResult = computed(() => (page.value - 1) * preferences.resultsPerPage + 1)
const lastResult = computed(() => {
  const last = page.value * preferences.resultsPerPage
  return totalHits.value < last ? totalHits.value : last
})
</script>
