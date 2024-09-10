<!-- SingleSnippet
Parent: DisplaySnippets.vue
Children: None
Siblings: None

Props: snippet (Snippet), docRef (string), url (string)
Variables: image (local, string), imageBusy (local, boolean)
Methods: getSelectedWord (local), toggleImageSnippet (local), fetchData (imported)

Description: displays text snippets from the OCR text
-->
<template>
  <div :docRef="docRef" :index="index" class="card snippet m-2">
    <!-- Instructions
    <div
      v-tooltip:top="$t('results.word-fix-instructions')"
      class="card-footer-item is-large p-1 m-1"
    >
      <span class="icon">
        <font-awesome-icon icon="question-circle" size="lg" />
      </span>
    </div> -->
    <header class="card-header snippet">
      <p class="card-header-title has-text-info">Page {{ snippet.page }}</p>
      <!-- Open page in book -->
      <button
        class="card-header-icon is-large has-text-info p-1 m-1"
        v-if="snippet.deepLink"
        v-tooltip:bottom="$t('results.show-original-page', [snippet.page])"
      >
        <span class="icon">
          <font-awesome-icon icon="book-open" size="lg" />
        </span>
      </button>
      <!-- Show snippet image -->
      <button
        v-tooltip:bottom="$t('results.show-image-snippet')"
        class="card-header-icon is-large has-text-info p-1 m-1"
      >
        <span class="icon">
          <font-awesome-icon icon="file-image" size="lg" />
        </span>
      </button>

      <!-- View transcribed text -->
      <button
        v-tooltip:bottom="$t('results.show-text')"
        class="card-header-icon is-large has-text-info p-1 m-1"
        @click="router.push(`/text/${docRef}/page/${snippet.page}`)"
      >
        <span class="icon">
          <font-awesome-icon icon="file-lines" size="lg" />
        </span>
      </button>
    </header>
    <div class="card-content" :data-index="index" :data-docref="docRef" :data-page="snippet.page">
      <div
        class="rtl-align snippet has-text-weight-medium rtl yiddish pr-2 pl-2"
        v-html="snippet.text"
        @dblclick="openWordModal"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRouter } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faFileImage,
  faBookOpen,
  faFileLines,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons'
library.add(faFileImage, faBookOpen, faFileLines, faAngleDown)

const wordModal = defineModel('wordModal')

const openWordModal = () => {
  const selection: Selection | null = window.getSelection()
  if (selection && selection.anchorNode) {
    let parentElement = selection.anchorNode

    while (parentElement.nodeType != Node.ELEMENT_NODE) {
      parentElement = parentElement.parentNode as ParentNode
    }

    let parentSpan = parentElement as HTMLElement
    while (parentSpan.tagName != 'SPAN') {
      parentSpan = parentSpan.parentElement as HTMLElement
    }

    if (parentSpan.tagName === 'SPAN') {
      const globalOffsetStr = parentSpan.getAttribute('offset') ?? '0'
      const globalOffset = parseInt(globalOffsetStr)
      let parsed = new DOMParser().parseFromString(snippet.text, 'text/html')
      const tags = Object.fromEntries(
        Array.from(parsed.body.getElementsByTagName('span')).map((tag) => [
          tag.getAttribute('offset'),
          tag.innerText
        ])
      )

      const word = tags[globalOffset].substring(selection.baseOffset - 1)

      wordModal.value = {
        open: true,
        docRef: docRef,
        selection: selection,
        globalOffset: globalOffset,
        word: `\u202B${word.split(' ').filter((d: string) => d)[0]}`
      }
    }
  }
}

const { index, snippet, docRef, url } = defineProps(['index', 'snippet', 'docRef', 'url'])

// Setup router
const router = useRouter()
// @click="toggleImageSnippet()"

// <div v-if="imageBusy">
//         <img src="/images/loading.gif" />
//       </div>
//       <img class="image-snippet" v-if="image" :src="image" title="Image" />
</script>
