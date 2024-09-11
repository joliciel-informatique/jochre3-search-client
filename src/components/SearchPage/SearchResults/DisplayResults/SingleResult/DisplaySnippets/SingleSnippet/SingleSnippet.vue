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
        v-tooltip:bottom="$t('results.show-original-page', [snippet.page])"
        v-if="snippet.deepLink"
        @click="openDeepLink(snippet.deepLink)"
      >
        <span class="icon">
          <font-awesome-icon icon="book-open" size="lg" />
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
      <div class="columns">
        <div
          class="column button is-flex is-align-items-center"
          :class="imageIsLoading ? 'is-loading' : ''"
          @click="image ? openImageModal() : toggleImageSnippet()"
        >
          <div>
            <div v-if="!image" class="is-flex is-flex-direction-column is-align-items-center m-2">
              <div class="p-3" :hidden="imageIsLoading">
                <button class="is-large is-flex is-align-items-center">
                  <span class="icon" :hidden="imageIsLoading">
                    <font-awesome-icon icon="file-image" size="2xl" />
                  </span>
                </button>
              </div>
              <span :hidden="imageIsLoading">{{ $t('results.show-image-snippet') }}</span>
            </div>
            <!-- Show snippet image -->
            <div v-else>
              <img class="image-snippet" :src="image" title="Image" />
            </div>
          </div>
        </div>
        <div
          class="column rtl-align snippet has-text-weight-medium rtl yiddish pr-2 pl-2"
          v-html="snippet.text"
          @dblclick="openWordModal"
        ></div>
      </div>
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
import { fetchData } from '@/assets/fetchMethods'
import { ref, type Ref } from 'vue'
library.add(faFileImage, faBookOpen, faFileLines, faAngleDown)

const imageModal: Ref = defineModel('imageModal')
const wordModal = defineModel('wordModal')
const image = ref('')
const imageIsLoading = ref(false)

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

const toggleImageSnippet = () => {
  imageIsLoading.value = true

  const params: URLSearchParams = new URLSearchParams({
    'doc-ref': docRef,
    'start-offset': `${snippet.start}`,
    'end-offset': `${snippet.end}`
  })

  snippet.highlights.forEach((highlight: Array<Number>) => {
    params.append('highlight', `[${highlight[0]},${highlight[1]}]`)
  })

  fetchData('image-snippet', 'get', params, 'image/png', 'arraybuffer')
    .then((response) =>
      response.status === 200
        ? response.arrayBuffer().then((buffer) => {
            image.value = `data:${response.headers.get('content-type')};base64,${btoa(
              Array.from(new Uint8Array(buffer))
                .map((buf) => String.fromCharCode(buf))
                .join('')
            )}`
            imageIsLoading.value = false
          })
        : null
    )
    .catch((error) => {
      console.error(error)
      imageIsLoading.value = false
    })
}

const openImageModal = () => {
  imageModal.value = {
    open: true,
    title: `Page ${snippet.page} for ${docRef}`,
    data: image.value ? image.value : null
  }
}

const openDeepLink = (url: string) => {
  window.open(url, '_blank')
}

const { index, snippet, docRef } = defineProps(['index', 'snippet', 'docRef'])

// Setup router
const router = useRouter()
</script>
