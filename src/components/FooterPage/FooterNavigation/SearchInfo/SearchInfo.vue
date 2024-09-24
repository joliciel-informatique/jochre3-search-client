<template>
  <div id="searchInfo" class="search-info" v-if="totalHits > 0">
    <div class="search-info-background is-flex is-align-items-center">
      <div class="search-info-text">
        {{ firstResult }}-{{ lastResult }}/{{ $t('results.result-count', [totalHits]) }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { preferences } from '@/assets/fetchMethods'
import { computed, type Ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircleChevronDown } from '@fortawesome/free-solid-svg-icons'
library.add(faCircleChevronDown)

const page: Ref = defineModel('page')
const totalHits: Ref = defineModel('totalHits')

const firstResult = computed(() => (page.value - 1) * preferences.resultsPerPage + 1)
const lastResult = computed(() => {
  const last = page.value * preferences.resultsPerPage
  return totalHits.value < last ? totalHits.value : last
})
</script>
