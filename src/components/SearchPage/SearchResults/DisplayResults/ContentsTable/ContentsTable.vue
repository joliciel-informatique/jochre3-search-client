<template>
  <div class="box table-of-contents" role="navigation" tabindex="1">
    <aside class="column columns menu p-2 my-3">
      <div class="column">
        <p class="menu-label">{{ $t('results.contents-table-header') }}</p>
        <p class="menu-label">
          {{ $t('results.contents-table-subheader', [totalHits, firstResult, lastResult]) }}
        </p>
        <ul class="menu-list">
          <li class="px-2" v-for="(result, index) of searchResults" :key="result.docRef">
            <a
              @click="selectEntry(result)"
              @keyup.enter="selectEntry(result)"
              tabindex="0"
              class="grid"
              :class="selectedEntry?.docRef === result.docRef ? 'is-active' : ''"
            >
              <SingleResult
                v-model:image-modal="imageModal"
                v-model:word-modal="wordModal"
                v-model:metadata-modal="metadataModal"
                v-model:notification="notification"
                v-model:showing="showing"
                v-model:selectedEntry="selectedEntry"
                :result
                :index
                :page-number-offset
              />
            </a>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>
<script setup lang="ts">
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { computed, onMounted, ref, type Ref } from 'vue'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleChevronDown } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faCircleChevronDown)

import SingleResult from './SingleResult/SingleResult.vue'
import type { SearchResult } from '@/assets/interfacesExternals'
const preferences = usePreferencesStore()

const showing = ref(true)

// const toggle = () => (showing.value = !showing.value)

const searchResults = defineModel<Array<SearchResult>>('searchResults')
const page: Ref = defineModel('page')
const imageModal: Ref = defineModel('imageModal')
const wordModal: Ref = defineModel('wordModal')
const metadataModal: Ref = defineModel('metadataModal')
const notification: Ref = defineModel('notification')
const selectedEntry = defineModel<SearchResult>('selectedEntry')
const totalHits: Ref = defineModel('totalHits')

const pageNumberOffset = computed(() => (page.value - 1) * preferences.resultsPerPage + 1) // Same line as in SearchInfo: firstResult

const firstResult = computed(() => (page.value - 1) * preferences.resultsPerPage + 1)
const lastResult = computed(() => {
  const last = page.value * preferences.resultsPerPage
  return totalHits.value < last ? totalHits.value : last
})

const selectEntry = (entry: SearchResult) => (selectedEntry.value = entry)

onMounted(() => {
  const results = searchResults.value
  if (results) selectEntry(results[0])
})
</script>
