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
  <div :docRef="result.docRef" :id="result.docRef" class="metadata my-3">
    <AccordionCard
      :id="result.docRef"
      :showing="result.docRef === selectedEntry?.docRef && showing"
    >
      <template #header>
        <div class="columns">
          <p class="column columns">
            <span
              class="column is-1"
              :class="{
                'is-pulled-right': preferences.displayLeftToRight,
                'is-pulled-left': !preferences.displayLeftToRight
              }"
              >{{ index + pageNumberOffset }}|</span
            >
            <span
              class="column"
              :class="{
                'is-pulled-right': preferences.displayLeftToRight,
                'is-pulled-left': !preferences.displayLeftToRight
              }"
              >{{ result.metadata.title ?? result.docRef }} ({{
                result.metadata.author ?? $t('results.result-unknown-author')
              }})</span
            >
            <span
              class="column is-1 icon menu-list-icon is-clickable"
              :class="{
                'is-pulled-right': preferences.displayLeftToRight,
                'is-pulled-left': !preferences.displayLeftToRight
              }"
              tabindex="3"
              @click="openMetadataModal"
              @keyup.enter="openMetadataModal"
              v-tooltip="[
                preferences.displayLeftToRight ? 'left' : 'right',
                $t('fix-metadata.edit-button-tooltip')
              ]"
            >
              <span class="icon fa-sm">
                <font-awesome-icon icon="pen-to-square" />
              </span>
            </span>
          </p>
        </div>
      </template>

      <template #content>
        <div class="card-content">
          <div v-for="field in fields" :key="sha1(field)">
            <SingleResultItem
              v-model:metadata-modal="metadataModal"
              :doc-ref="result.docRef"
              :field="field"
              :value="(result.metadata as any)[field]"
            />
          </div>
          <div class="has-text-right is-size-7 px-2" aria-label="document reference" tabindex="3">
            {{ $t('results.document-reference') }}: <strong>{{ result.docRef }}</strong>
          </div>
        </div>
      </template>

      <template #footer>
        <!-- <div class="columns is-centered">
          <span
            class="column icon is-small has-text-left is-clickable"
            :class="{ rotate: !showing }"
            @click="toggle()"
            v-show="selectedEntry?.docRef === result.docRef"
          >
            <font-awesome-icon icon="circle-chevron-down" size="lg" />
          </span>
        </div> -->
      </template>
    </AccordionCard>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SingleResultItem from '../../ContentsTable/SingleResult/SingleResultItem/SingleResultItem.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPenToSquare,
  faQuestionCircle,
  faBookOpen,
  faCircleChevronDown,
  faCircleChevronUp
} from '@fortawesome/free-solid-svg-icons'
import { sha1 } from 'object-hash'
import AccordionCard from '@/_components/AccordionCard/AccordionCard.vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import type { SearchResult } from '@/assets/interfacesExternals'

const { result, index, pageNumberOffset } = defineProps(['result', 'index', 'pageNumberOffset'])

library.add(faPenToSquare, faQuestionCircle, faBookOpen, faCircleChevronDown, faCircleChevronUp)

const preferences = usePreferencesStore()
const fields = ['titleEnglish', 'author', 'authorEnglish', 'publicationYear', 'publisher']

const metadataModal = defineModel('metadataModal')
const showing = defineModel<boolean>('showing', { default: false })
const selectedEntry = defineModel<SearchResult>('selectedEntry')

const toggle = () => (showing.value = !showing.value)

const openMetadataModal = () => {
  metadataModal.value = {
    show: true,
    docRef: selectedEntry.value?.docRef,
    field: 'title',
    value: selectedEntry.value?.metadata.title ?? selectedEntry.value?.docRef
  }
}
</script>
