<!-- SingleResult
Parent: DisplayResults.vue
Children: SingleResultItem.vue, DisplaySnippets.vue
Siblings: None

Props: result
Variables: none
Methods: fixMetaData (imported)

Description: presents OCR record metadata
-->
<template>
  <div v-if="result" :docRef="result.docRef" :id="result.docRef" class="metadata mt-2">
    <AccordionCard :id="result.docRef" :showing="showing">
      <!-- (bookIndex < 0 || bookIndex === selectedEntryIdx) &&  -->
      <template #header>
        <p
          class="pb-2 is-flex is-flex-direction-row is-justify-content-space-between"
          :class="
            interfaceStyle == 'old'
              ? 'card m-3 p-3 card-header selected-snippet has-text-white'
              : ''
          "
        >
          <span :class="interfaceStyle == 'old' ? 'is-size-4' : ''">
            {{ (bookIndex < 0 ? selectedEntryIdx : bookIndex) + pageNumberOffset }}|
          </span>
          <span
            class="is-align-self-flex-start is-flex-grow-1"
            :class="[
              interfaceStyle == 'old' ? 'is-size-4' : '',
              displayLeftToRight ? 'has-text-left' : 'has-text-right'
            ]"
          >
            {{ result.metadata.title ?? result.docRef }}
            ({{ result.metadata.author ?? $t('results.result-unknown-author') }})
          </span>
          <span tabindex="3" @click="openMetadataModal" @keyup.enter="openMetadataModal">
            <span class="icon fa-sm is-clickable">
              <font-awesome-icon icon="pen-to-square" />
            </span>
          </span>
        </p>
      </template>

      <template #content>
        <div
          class="toc card-content mb-2 is-flex is-flex-direction-column"
          :class="interfaceStyle == 'old' ? 'card m-3 p-3' : ''"
        >
          <SingleResultItem
            v-for="field in fields"
            :key="sha1(field)"
            :doc-ref="result.docRef"
            :field="field"
            :value="(result.metadata as any)[field] ?? ''"
            v-model:metadata-modal="metadataModal"
          />
          <div
            v-if="interfaceStyle == 'old'"
            class="is-size-7 px-2"
            :class="displayLeftToRight ? 'has-text-right' : 'has-text-left'"
            aria-label="document reference"
            tabindex="3"
          >
            <strong>{{ $t('results.document-reference', [result.docRef]) }}</strong>
          </div>
        </div>
        <div
          v-if="interfaceStyle == 'new'"
          class="has-text-right is-size-7 px-2"
          aria-label="document reference"
          tabindex="3"
        >
          <strong>{{ $t('results.document-reference', [result.docRef]) }}</strong>
        </div>
      </template>

      <template #footer>
        <div class="columns is-hidden-touch">
          <span
            class="column footer-icon pt-2 is-small has-text-centered is-clickable"
            :class="{ rotate: !showing }"
            @click="toggle()"
            v-show="selectedEntry?.docRef === result.docRef"
          >
            <font-awesome-icon icon="circle-chevron-up" size="lg" />
          </span>
        </div>
      </template>
    </AccordionCard>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { sha1 } from 'object-hash'
import type { SearchResult } from '@/assets/interfacesExternals'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { storeToRefs } from 'pinia'
const { displayLeftToRight, interfaceStyle } = storeToRefs(usePreferencesStore())

const SingleResultItem = defineAsyncComponent(
  () =>
    import(
      '@/components/SearchPage/SearchResults/ContentsTable/SingleResult/SingleResultItem/SingleResultItem.vue'
    )
)
const AccordionCard = defineAsyncComponent(
  () => import('@/_components/AccordionCard/AccordionCard.vue')
)

const { result, bookIndex, pageNumberOffset } = defineProps([
  'result',
  'bookIndex',
  'pageNumberOffset'
])

const metadataModal = defineModel('metadataModal')
const showing = defineModel<boolean>('showing', { default: true })
const selectedEntry = defineModel<SearchResult>('selectedEntry')
const selectedEntryIdx = defineModel<number>('selectedEntryIdx')

const fields = ['titleEnglish', 'author', 'authorEnglish', 'publicationYear', 'publisher']

const toggle = () => (showing.value = !showing.value)

const openMetadataModal = () => {
  metadataModal.value = {
    show: true,
    docRef: result.docRef,
    field: 'title',
    value: result.metadata.title
  }
}
</script>
