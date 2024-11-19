<template>
  <!-- ToC Search Results on desktop -->
  <div
    v-if="searchResults?.length"
    class="box table-of-contents is-flex is-flex-direction-column search-results menu is-hidden-touch"
    :class="preferences.displayLeftToRight ? 'left' : 'right'"
    role="navigation"
    tabindex="1"
  >
    <p class="menu-label is-size-5 label">
      {{ $t('results.contents-table-header') }}
    </p>
    <p class="menu-label label pt-4">
      {{ $t('results.contents-table-subheader', [totalHits, firstResult, lastResult]) }}
    </p>
    <div class="scroll-list">
      <ul class="menu-list">
        <li class="px-2" v-for="(result, index) of searchResults" :key="result.docRef">
          <a
            @click="selectEntry(result, index)"
            @keyup.enter="selectEntry(result, index)"
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
  </div>

  <!-- ToC Search Results on mobile -->
  <div
    v-if="searchResults?.length"
    class="is-hidden-desktop toc-mobile has-text-centered-touch is-flex-tablet is-align-items-center is-flex-wrap-nowrap is-flex-direction-row is-justify-content-space-between p-2"
    id="mobile-navigation"
    role="navigation"
    tabindex="1"
  >
    <a
      class="button toc-index-btn has-background-info has-text-white"
      @click.prevent="openMobileSearchResultsToc = !openMobileSearchResultsToc"
      ><font-awesome-icon
        icon="list"
        size="lg"
        class="m-2"
        :class="{ 'fa-flip-horizontal': !preferences.displayLeftToRight }"
    /></a>
    <a
      class="button toc-index-btn has-background-info has-text-white"
      @click.prevent="openMobileFacets = !openMobileFacets"
      ><font-awesome-icon icon="users" size="lg" class="m-2"
    /></a>
    <a
      class="button toc-metadata-btn has-background-info has-text-white"
      @click.prevent="openMobileMetadataPanel = !openMobileMetadataPanel"
    >
      <span class="m-1 ml-2 pt-1" :class="{ 'rtl-align': preferences.needsRightToLeft }">
        <span>
          {{ selectedEntry?.metadata.title }}
          ({{ selectedEntry?.metadata.author ?? $t('results.result-unknown-author') }})
        </span>
      </span>
    </a>
    <PageNumbering @newPage="emit('newPage')" v-model:totalHits="totalHits" v-model:page="page" />
  </div>
  <aside class="toc-drawer menu box p-2" v-show="openMobileMetadataPanel">
    <SingleResult
      v-model:image-modal="imageModal"
      v-model:word-modal="wordModal"
      v-model:metadata-modal="metadataModal"
      v-model:notification="notification"
      v-model:showing="showing"
      v-model:selectedEntry="selectedEntry"
      :result="selectedEntry"
      :index="selectedEntryIndex"
      :page-number-offset
    />
  </aside>
  <aside class="toc-drawer menu box p-2" v-show="openMobileSearchResultsToc">
    <p
      class="menu-label is-size-5 label p-2 is-flex is-flex-direction-row is-justify-content-space-between"
    >
      {{ $t('results.contents-table-header') }}
      <font-awesome-icon icon="gear" @click="preferences.show = true" />
    </p>
    <p class="menu-label label pt-4">
      {{ $t('results.contents-table-subheader', [totalHits, firstResult, lastResult]) }}
    </p>
    <ul class="menu-list p-2">
      <li v-for="(result, index) of searchResults" :key="result.docRef">
        <a
          @click="selectEntry(result, index)"
          @keyup.enter="selectEntry(result, index)"
          tabindex="0"
          class="grid"
          :class="selectedEntry?.docRef === result.docRef ? 'is-active' : ''"
          >{{ `${index + pageNumberOffset}| ${result.metadata.title}` }}
        </a>
      </li>
    </ul>
  </aside>
  <aside class="toc-drawer menu box p-2" v-show="openMobileFacets">
    <FacetBar
      @newSearch="emit('newSearch')"
      v-model:facets="facets"
      v-model:open-mobile-facets="openMobileFacets"
    />
  </aside>
  <!-- </div> -->
</template>
<script setup lang="ts">
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { computed, onMounted, ref, type Ref } from 'vue'

import SingleResult from '../ContentsTable/SingleResult/SingleResult.vue'
import type { SearchResult } from '@/assets/interfacesExternals'
import PageNumbering from '../../SearchBar/Navigation/PageNumbering/PageNumbering.vue'
import FacetBar from '../FacetBar/FacetBar.vue'

const preferences = usePreferencesStore()

const showing = ref(true)

const searchResults = defineModel<Array<SearchResult>>('searchResults')
const page: Ref = defineModel('page')
const imageModal: Ref = defineModel('imageModal')
const wordModal: Ref = defineModel('wordModal')
const metadataModal: Ref = defineModel('metadataModal')
const notification: Ref = defineModel('notification')
const selectedEntry = defineModel<SearchResult>('selectedEntry')
const selectedEntryIndex = ref(0)
const totalHits: Ref = defineModel('totalHits')
const facets: Ref = defineModel('facets')

const openMobileSearchResultsToc = defineModel('openMobileSearchResultsToc')
const openMobileMetadataPanel = defineModel('openMobileMetadataPanel')
const openMobileFacets = defineModel('openMobileFacets')

const pageNumberOffset = computed(() => (page.value - 1) * preferences.resultsPerPage + 1) // Same line as in SearchInfo: firstResult

const firstResult = computed(() => (page.value - 1) * preferences.resultsPerPage + 1)
const lastResult = computed(() => {
  const last = page.value * preferences.resultsPerPage
  return totalHits.value < last ? totalHits.value : last
})

const selectEntry = (entry: SearchResult, index: number) => {
  selectedEntry.value = entry
  selectedEntryIndex.value = index
  const navBarHeight = document.getElementById('topbar')?.getBoundingClientRect().height
  const top = document.getElementById(`hr-${index}`)?.getBoundingClientRect().top
  if (navBarHeight && top)
    document.getElementById('snippets')?.scrollBy({
      top: top - navBarHeight,
      behavior: 'smooth'
    })
}

onMounted(() => {
  const results = searchResults.value
  if (results) selectEntry(results[0], 0)
})

const emit = defineEmits(['newPage', 'resetSearchResults', 'newSearch'])
</script>
