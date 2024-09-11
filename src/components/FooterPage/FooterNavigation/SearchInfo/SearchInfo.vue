<template>
  <div id="searchInfo" class="search-info" v-if="totalHits > 0">
    <hr />
    <div class="search-info-background is-flex is-align-items-center">
      <div class="search-info-text">
        {{ $t('results.result-count', [totalHits]) }}
        ({{ $t('results.result-range', [firstResult, lastResult]) }})
      </div>
      <span class="icon is-medium is-clickable footer-icon">
        <font-awesome-icon icon="circle-chevron-down" size="lg" />
      </span>

      <!-- <div class="px-2"></div> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { preferences } from '@/assets/fetchMethods'
// import { type SearchResult } from '@/assets/interfacesExternals'
import { computed, onUpdated, ref, type Ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleChevronDown } from '@fortawesome/free-solid-svg-icons'
library.add(faCircleChevronDown)

const page: Ref = defineModel('page')
const totalHits: Ref = defineModel('totalHits')
// const totalSnippets: Ref = defineModel('totalSnippets')
// const searchResults: Ref = defineModel('searchResults')
// const { searchResults } = defineProps(['searchResults'])

const firstResult = computed(() => (page.value - 1) * preferences.resultsPerPage + 1)
const lastResult = computed(() => {
  const last = page.value * preferences.resultsPerPage
  return totalHits.value < last ? totalHits.value : last
})
</script>
