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
  <div v-if="result" :docRef="result.docRef" :id="result.docRef" class="metadata m-2">
    <AccordionCard
      :id="result.docRef"
      :showing="
        interfaceStyle == 'new'
          ? (bookIndex < 0 || bookIndex === selectedEntryIdx) && showing
          : showing
      "
    >
      <template #header>
        <p
          class="pb-2 is-flex is-flex-direction-row is-justify-content-space-between"
          :class="{
            'card m-3 p-3 card-header has-background-primary has-text-white':
              interfaceStyle == 'old'
          }"
        >
          <span :class="{ 'is-size-4': interfaceStyle == 'old' }">
            <span v-if="bookIndex && selectedEntryIdx">
              {{ (bookIndex < 0 ? selectedEntryIdx : bookIndex) + pageNumberOffset }}
            </span>
            <span class="px-1">|</span>
            <span
              class="is-align-self-flex-start is-flex-grow-1"
              :class="[displayLeftToRight ? 'has-text-left' : 'has-text-right']"
            >
              {{ result.metadata.title ?? result.docRef }}
              ({{ result.metadata.author ?? $t('results.result-unknown-author') }})
            </span>
          </span>
          <EditBtn :result="result" :edit="'title'" v-model:metadata-modal="metadataModal" />
        </p>
      </template>

      <template #content>
        <div
          class="toc card-content mb-2 is-flex is-flex-direction-column card m-3 p-3 has-background-grey-lighter"
        >
          <div
            class="columns is-vcentered has-text-primary pl-2 pt-1 pr-2"
            :class="displayLeftToRight ? 'has-text-left' : 'has-text-right'"
          >
            <span class="column is-one-fifth has-text-weight-bold">
              {{ $t('results.alternate-title') }}:
            </span>
            <span
              class="column is-four-fifth has-text-primary is-flex is-flex-direction-row is-align-items-center"
              :class="{ 'is-justify-content-space-between': interfaceStyle == 'old' }"
            >
              {{ result.metadata.titleEnglish }}
              <EditBtn
                :result="result"
                :edit="'titleEnglish'"
                v-model:metadata-modal="metadataModal"
              />
            </span>
          </div>
          <div
            class="columns is-vcentered has-text-primary pl-2 pt-1 pr-2 is-hidden-touch"
            :class="displayLeftToRight ? 'has-text-left' : 'has-text-right'"
          >
            <span class="column is-one-fifth has-text-weight-bold">
              {{ $t('results.author') }}:
            </span>

            <span
              class="column is-four-fifth has-text-primary is-flex is-flex-direction-row is-align-items-center"
              :class="{
                'is-justify-content-space-between': interfaceStyle == 'old',
                'rtl-no-text-align': needsRightToLeft,
                'ltr-no-text-align': needsLeftToRight
              }"
            >
              {{ result.metadata.author }}
              <EditBtn :result="result" :edit="'author'" v-model:metadata-modal="metadataModal" />
              (
              {{ result.metadata.authorEnglish }}
              <EditBtn
                :result="result"
                :edit="'authorEnglish'"
                v-model:metadata-modal="metadataModal"
              />
              )
            </span>
          </div>
          <div
            class="columns is-vcentered has-text-primary pl-2 pt-1 pr-2 is-hidden-desktop"
            :class="displayLeftToRight ? 'has-text-left' : 'has-text-right'"
          >
            <span class="column is-one-fifth has-text-weight-bold">
              {{ $t('results.author') }}:
            </span>

            <span
              class="column is-four-fifth has-text-primary is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between"
              :class="needsRightToLeft ? 'ltr-no-text-align' : 'rtl-no-text-align'"
            >
              {{ result.metadata.author }}
              <EditBtn :result="result" :edit="'author'" v-model:metadata-modal="metadataModal" />
            </span>
            <span
              class="column is-four-fifth has-text-primary is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between"
              :class="needsRightToLeft ? 'ltr-no-text-align' : 'rtl-no-text-align'"
            >
              {{ result.metadata.authorEnglish }}
              <EditBtn
                :result="result"
                :edit="'authorEnglish'"
                v-model:metadata-modal="metadataModal"
              />
            </span>
          </div>
          <div
            class="columns is-vcentered has-text-primary pl-2 pt-1 pr-2"
            :class="displayLeftToRight ? 'has-text-left' : 'has-text-right'"
          >
            <span class="column is-one-fifth has-text-weight-bold">
              {{ $t('results.publication-year') }}:</span
            >
            <span
              class="column is-four-fifth has-text-primary is-flex is-flex-direction-row is-align-items-center"
              :class="{ 'is-justify-content-space-between': interfaceStyle == 'old' }"
            >
              {{ result.metadata.publicationYear }}
              <EditBtn
                :result="result"
                :edit="'publicationYear'"
                v-model:metadata-modal="metadataModal"
              />
            </span>
          </div>
          <div
            class="columns is-vcentered has-text-primary pl-2 pt-1 pr-2"
            :class="displayLeftToRight ? 'has-text-left' : 'has-text-right'"
          >
            <span class="column is-one-fifth has-text-weight-bold">
              {{ $t('results.publisher') }}:</span
            >
            <span
              class="column is-four-fifth has-text-primary is-flex is-flex-direction-row is-align-items-center"
              :class="{ 'is-justify-content-space-between': interfaceStyle == 'old' }"
            >
              <span class="is-vcentered">{{ result.metadata.publisher }}</span>
              <EditBtn
                :result="result"
                :edit="'publisher'"
                v-model:metadata-modal="metadataModal"
              />
            </span>
          </div>
          <div
            class="is-size-7 px-2"
            :class="displayLeftToRight ? 'has-text-right' : 'has-text-left'"
            aria-label="document reference"
            tabindex="3"
          >
            <strong>{{ $t('results.document-reference', [result.docRef]) }}</strong>
          </div>
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
import { type PropType } from 'vue'
import type { SearchResult } from '@/assets/interfacesExternals'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { storeToRefs } from 'pinia'
import AccordionCard from '@/_components/AccordionCard/AccordionCard.vue'
import EditBtn from './EditBtn.vue'
const { displayLeftToRight, interfaceStyle, needsLeftToRight, needsRightToLeft } =
  storeToRefs(usePreferencesStore())

const { result, bookIndex, pageNumberOffset } = defineProps({
  result: { type: Object as PropType<SearchResult> },
  bookIndex: { type: Number, default: 0 },
  pageNumberOffset: { type: Number, default: 0 }
})

const metadataModal = defineModel('metadataModal')
const showing = defineModel<boolean>('showing', { default: true })
const selectedEntry = defineModel<SearchResult>('selectedEntry')
const selectedEntryIdx = defineModel<number>('selectedEntryIdx')

const toggle = () => (showing.value = !showing.value)
</script>
