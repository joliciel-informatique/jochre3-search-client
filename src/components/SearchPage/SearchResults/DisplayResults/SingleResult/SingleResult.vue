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
    <AccordionCard :id="result.docRef" :showing="showing">
      <template #header>
        <div class="card-header">
          <p class="card-header-title title yiddish">
            <a :href="result.metadata?.url" target="_blank">{{
              result.metadata.title ?? result.docRef
            }}</a>
            <button
              @click="openMetadataModalForTitle"
              class="button is-small is-white is-pulled-right"
            >
              <span class="icon is-small fa-2xs">
                <font-awesome-icon icon="pen-to-square" />
              </span>
            </button>
          </p>
        </div>
      </template>
      <template #content>
        <div class="card-content">
          <div class="is-italic is-size-6 has-text-centered">
            {{ $t('results.document-reference', [result.docRef]) }}
          </div>
          <div v-for="field in fields" :key="sha1(field)">
            <SingleResultItem
              v-model:metadata-modal="metadataModal"
              :doc-ref="result.docRef"
              :field="field"
              :value="result.metadata[field]"
            />
          </div>
        </div>
      </template>
    </AccordionCard>
  </div>
  <div>
    <DisplaySnippets
      v-model:image-modal="imageModal"
      v-model:word-modal="wordModal"
      :snippets="result.snippets"
      :docRef="result.docRef"
      :url="result.metadata.url"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SingleResultItem from './SingleResultItem.vue'
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
library.add(faPenToSquare, faQuestionCircle, faBookOpen, faCircleChevronDown, faCircleChevronUp)
const fields = ['titleEnglish', 'author', 'authorEnglish', 'publicationYear', 'publisher']
const { result } = defineProps(['result'])
const showing = ref(true)

const imageModal = defineModel('imageModal')
const wordModal = defineModel('wordModal')
const metadataModal = defineModel('metadataModal')

const emit = defineEmits(['openMetadataModal', 'openWordModal'])

/** Autohide card upon scrolling */
const autoHide = () => {
  showing.value = false
}

onMounted(() => {
  window.addEventListener('scroll', autoHide)
})

const openMetadataModalForTitle = () => {
  metadataModal.value = {
    open: true,
    docRef: result.docRef,
    field: 'title',
    value: result.metadata.title ?? result.docRef
  }
}
</script>
