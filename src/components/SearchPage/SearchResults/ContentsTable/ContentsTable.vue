<template>
  <!-- ToC Search Results on desktop -->
  <div
    v-if="searchResults?.length"
    class="box table-of-contents is-flex is-flex-direction-column search-results menu is-hidden-touch mx-3"
    role="navigation"
    tabindex="1"
  >
    <p class="menu-label is-size-5 label">
      {{ $t('toc.contents-table-header') }}
    </p>
    <p class="menu-label label pt-4">
      {{ $t('toc.contents-table-subheader', [totalHits, firstResult, lastResult]) }}
    </p>
    <div class="scroll-list" ref="scrollListDesktop">
      <ul class="menu-list">
        <li
          class="px-2"
          :id="`metadata-${result.docRef}`"
          v-for="(result, bookIndex) of searchResults"
          :key="result.docRef"
          :ref="results.set"
        >
          <a
            @click="selectEntry(bookIndex)"
            @keyup.enter="selectEntry(bookIndex)"
            tabindex="0"
            class="grid"
            :class="searchResults[selectedEntryIdx]?.docRef === result.docRef ? 'is-active' : ''"
          >
            <SingleResult
              v-model:image-modal="imageModal"
              v-model:metadata-modal="metadataModal"
              v-model:selectedEntryIdx="selectedEntryIdx"
              :result="result"
              :book-index="bookIndex"
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
    class="is-hidden-desktop is-relative toc-mobile has-text-centered-touch is-flex-tablet is-align-items-center is-flex-wrap-nowrap is-flex-direction-row is-justify-content-space-between p-2"
    id="mobile-navigation"
    role="navigation"
    tabindex="1"
  >
    <a
      v-if="preferences.interfaceStyle == 'new'"
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
      v-if="preferences.interfaceStyle == 'new'"
      class="button toc-metadata-btn has-background-info has-text-white"
      @click.prevent="openMobileMetadataPanel = !openMobileMetadataPanel"
    >
      <span class="m-1 ml-2 pt-1" :class="{ 'rtl-align': preferences.needsRightToLeft }">
        <span>
          {{ searchResults[selectedEntryIdx]?.metadata.title }}
          ({{
            searchResults[selectedEntryIdx]?.metadata.author ?? $t('results.result-unknown-author')
          }})
        </span>
      </span>
    </a>
    <PageNumbering @newPage="emit('newPage')" />
  </div>
  <aside
    v-if="searchResults?.length"
    class="toc-drawer menu box p-2 metadata on-mobile"
    v-show="openMobileMetadataPanel"
  >
    <SingleResult
      v-model:image-modal="imageModal"
      v-model:metadata-modal="metadataModal"
      v-model:selected-entry-idx="selectedEntryIdx"
      :result="searchResults[selectedEntryIdx]"
      :book-index="-1"
      :page-number-offset
    />
  </aside>
  <aside
    v-if="searchResults?.length"
    class="toc-drawer menu box p-2"
    v-show="openMobileSearchResultsToc"
  >
    <!-- <p
      class="menu-label is-size-5 label p-2 is-flex is-flex-direction-row is-justify-content-space-between"
    >
      {{ $t('toc.contents-table-header') }}
      <font-awesome-icon icon="gear" @click="preferences.show = true" />
    </p> -->
    <p class="menu-label label pt-4 has-text-centered">
      {{ $t('toc.contents-table-subheader', [totalHits, firstResult, lastResult]) }}
    </p>
    <ul class="menu-list p-2">
      <li v-for="(result, index) of searchResults" :key="result.docRef">
        <a
          @click="selectEntry(index)"
          @keyup.enter="selectEntry(index)"
          tabindex="0"
          class="grid"
          :class="{
            'is-active': searchResults[selectedEntryIdx]?.docRef === result.docRef,
            'has-text-right': !preferences.corpusLeftToRight,
            'rtl-align': preferences.needsRightToLeft
          }"
          >{{ `${index + pageNumberOffset}| ${result.metadata.title}` }}
        </a>
      </li>
    </ul>
  </aside>
  <aside class="toc-drawer menu box p-2" v-show="openMobileFacets">
    <FacetBar
      @activeFacetsChanged="emit('activeFacetsChanged')"
      v-model:facets="facets"
      v-model:open-mobile-facets="openMobileFacets"
    />
  </aside>
</template>
<script setup lang="ts">
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { computed, nextTick, ref, watch, type Ref } from 'vue'
import { useTemplateRefsList } from '@vueuse/core'
import { useSearchStore } from '@/stores/SearchStore'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/ModalStore'

import SingleResult from '@/components/SearchPage/SearchResults/ContentsTable/SingleResult/SingleResult.vue'
import PageNumbering from '@/components/SearchPage/SearchBar/Navigation/PageNumbering/PageNumbering.vue'
import FacetBar from '@/components/SearchPage/SearchResults/FacetBar/FacetBar.vue'

const searchStore = useSearchStore()
const { page, searchResults, totalHits, firstResult, lastResult, selectedEntryIdx } =
  storeToRefs(searchStore)

const preferences = usePreferencesStore()

const imageModal: Ref = defineModel('imageModal')
const metadataModal: Ref = defineModel('metadataModal')
const facets: Ref = defineModel('facets')

const openMobileSearchResultsToc = defineModel('openMobileSearchResultsToc')
const openMobileMetadataPanel = defineModel('openMobileMetadataPanel')
const openMobileFacets = defineModel('openMobileFacets')

const pageNumberOffset = computed(() => (page.value - 1) * preferences.resultsPerPage + 1) // Same line as in SearchInfo: firstResult

// ContentTable tree is reactive; Vue Refs required to keep synchronous with DOM
const scrollListDesktop = ref()
const results = useTemplateRefsList()

const selectEntry = (index: number) => {
  selectedEntryIdx.value = index
  const navBarHeight = document.getElementById('topbar')?.getBoundingClientRect().height
  const top = document.getElementById(`hr-${index}`)?.getBoundingClientRect().top
  if (navBarHeight && top)
    document.getElementById('snippets')?.scrollBy({
      top: top - navBarHeight,
      behavior: 'instant'
    })
}

const emit = defineEmits(['newPage', 'activeFacetsChanged'])

watch(selectedEntryIdx, () => {
  nextTick(() => {
    setTimeout(() => {
      const rectTop = scrollListDesktop.value.getBoundingClientRect()
      const active = results.value
        .filter((el: Element) => el.children[0].classList.contains('is-active'))[0]
        .getBoundingClientRect()
      scrollListDesktop.value.scrollBy({
        top: active.top - rectTop.top,
        behavior: 'smooth'
      })
    }, 300)
  })
})
</script>
