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
  <div :docRef="result.docRef" :id="result.docRef" class="card metadata my-3">
    <AccordionCard :id="result.docRef" :showing="isCollapsed">
      <template #header>
        <div class="card-header">
          <p class="card-header-title title columns" tabindex="3">
            <span
              class="column has-text-left"
              :class="{
                'has-text-left': preferences.displayLeftToRight,
                'has-text-right': !preferences.displayLeftToRight
              }"
            >
              <a :href="result.metadata?.url" target="_blank" class="link-light">{{
                result.metadata.title ?? result.docRef
              }}</a>
            </span>
            <button
              class="button is-small is-white"
              :class="{
                'is-pulled-right': preferences.displayLeftToRight,
                'is-pulled-left': !preferences.displayLeftToRight
              }"
              tabindex="3"
              @click="openMetadataModal"
              @keyup.enter="openMetadataModal"
              v-tooltip:left="$t('fix-metadata.edit-button-tooltip')"
            >
              <span class="icon is-small fa-md">
                <font-awesome-icon icon="pen-to-square" />
              </span>
            </button>
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
              :value="result.metadata[field]"
            />
          </div>
        </div>
        <div class="has-text-right is-size-7 px-2" aria-label="document reference" tabindex="3">
          {{ $t('results.document-reference') }}: <strong>{{ result.docRef }}</strong>
        </div>
      </template>
    </AccordionCard>
  </div>
  <div>
    <DisplaySnippets
      v-model:image-modal="imageModal"
      v-model:word-modal="wordModal"
      v-model:notification="notification"
      :snippets="result.snippets"
      :docRef="result.docRef"
      :url="result.metadata.url"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SingleResultItem from './SingleResultItem/SingleResultItem.vue'
import DisplaySnippets from './DisplaySnippets/DisplaySnippets.vue'
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

library.add(faPenToSquare, faQuestionCircle, faBookOpen, faCircleChevronDown, faCircleChevronUp)

const preferences = usePreferencesStore()
const fields = ['titleEnglish', 'author', 'authorEnglish', 'publicationYear', 'publisher']
const { result, showing } = defineProps(['result', 'showing'])

const isCollapsed = ref(showing)
const imageModal = defineModel('imageModal')
const wordModal = defineModel('wordModal')
const metadataModal = defineModel('metadataModal')
const notification = defineModel('notification')

const openMetadataModal = () => {
  metadataModal.value = {
    show: true,
    docRef: result.docRef,
    field: 'title',
    value: result.metadata.title ?? result.docRef
  }
}

/** Autohide card upon scrolling */
const autoHide = () => {
  // Check if element is at the top of the screen
  isCollapsed.value = false
}

onMounted(() => window.addEventListener('scroll', autoHide))
</script>
