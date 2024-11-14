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
  <li :docRef="docRef" class="card snippet m-4" :bookIndex :snippetIndex>
    <header
      class="card-header"
      :class="selectedEntry.docRef === docRef ? 'selected-snippet' : 'snippet'"
    >
      <p class="card-header-title">
        {{ $t('results.page', [snippet.page]) }}
      </p>
      <span class="card-header-title is-centered is-hidden-mobile is-size-7">{{ docRef }}</span>
      <!-- Open page in book -->
      <button
        class="card-header-icon is-large p-1 m-1 is-flex is-flex-direction-column"
        aria-label="view book"
        v-tooltip:top="$t('results.show-original-page', [snippet.page])"
        v-if="snippet.deepLink"
        @click="openDeepLink(snippet.deepLink)"
        @keyup.enter="openDeepLink(snippet.deepLink)"
      >
        <span class="icon">
          <font-awesome-icon icon="book-open" size="lg" />
        </span>
        <span class="is-size-7">{{ $t('snippet.open-page') }}</span>
      </button>

      <!-- View transcribed text -->
      <button
        class="card-header-icon is-large p-1 m-1 is-flex is-flex-direction-column"
        aria-label="view transcription"
        v-tooltip:top="$t('results.show-text')"
        @click="openTranscribedText()"
        @keyup.enter="openTranscribedText()"
      >
        <span class="icon">
          <font-awesome-icon icon="file-lines" size="lg" />
        </span>
        <span class="is-size-7">{{ $t('snippet.open-transcription') }}</span>
      </button>
    </header>
    <div class="card-content" :data-docref="docRef" :data-page="snippet.page">
      <div class="columns is-mobile">
        <div
          v-if="preferences.displayLeftToRight === preferences.corpusLeftToRight"
          :class="{
            column: true,
            snippet: true,
            'has-text-weight-medium': true,
            'pr-2': true,
            'pl-2': true,
            'rtl-align': !preferences.corpusLeftToRight,
            rtl: !preferences.corpusLeftToRight
          }"
          v-html="snippet.text"
          @dblclick="openWordModal"
          v-touch:longtap="openWordModal"
        ></div>
        <div
          class="load-original-image-button column button is-flex is-align-items-center is-size-7"
          :class="imageIsLoading ? 'is-loading' : ''"
          tabindex="3"
          :alt="$t('results.click-image-snippet')"
          @click="
            image
              ? openImageModal($t('large-image.title', [snippet.page, docRef]))
              : toggleImageSnippet()
          "
          @keyup.enter="
            image
              ? openImageModal($t('large-image.title', [snippet.page, docRef]))
              : toggleImageSnippet()
          "
        >
          <div>
            <div
              v-if="!image"
              class="is-flex is-flex-direction-column is-align-items-center m-2"
              visibility:hidden
            >
              <div class="p-3" :hidden="imageIsLoading">
                <button class="is-large is-flex is-align-items-center">
                  <span class="icon" :hidden="imageIsLoading">
                    <font-awesome-icon icon="file-image" size="2xl" />
                  </span>
                </button>
              </div>
              <span :hidden="imageIsLoading">{{ $t('results.click-image-snippet') }}</span>
            </div>

            <!-- Show snippet image -->
            <div v-else>
              <img
                class="image-snippet"
                :src="image"
                title="Image"
                :alt="`Image for page ${snippet.page}`"
              />
            </div>
          </div>
        </div>
        <div
          v-if="preferences.displayLeftToRight !== preferences.corpusLeftToRight"
          :class="{
            column: true,
            snippet: true,
            'has-text-weight-medium': true,
            'pr-2': true,
            'pl-2': true,
            'rtl-align': !preferences.corpusLeftToRight,
            rtl: !preferences.corpusLeftToRight
          }"
          v-html="snippet.text"
          tabindex="3"
          @dblclick="openWordModal"
          v-touch:longtap="openWordModal"
        ></div>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { fetchData } from '@/assets/fetchMethods'
import { ref, type Ref } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

const { snippet, docRef, bookIndex, snippetIndex, query, strict } = defineProps([
  'snippet',
  'docRef',
  'bookIndex',
  'snippetIndex',
  'query',
  'strict'
])
const imageModal: Ref = defineModel('imageModal')
const wordModal = defineModel('wordModal')
const notification = defineModel('notification')
const selectedEntry: Ref = defineModel('selectedEntry')

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

    // IMPORTANT: text in span element may not match image; retrieve both separately from server based on selection globalOffset
    if (parentSpan.tagName === 'SPAN') {
      const globalOffsetStr = parentSpan.getAttribute('offset') ?? '0'
      const globalOffset = parseInt(globalOffsetStr)

      wordModal.value = {
        show: true,
        docRef: docRef,
        selection: selection,
        globalOffset: globalOffset
      }
    }
  }
}

const toggleImageSnippet = async () => {
  imageIsLoading.value = true

  const params: URLSearchParams = new URLSearchParams({
    'doc-ref': docRef,
    'start-offset': `${snippet.start}`,
    'end-offset': `${snippet.end}`
  })

  snippet.highlights.forEach((highlight: Array<Number>) => {
    params.append('highlight', `[${highlight[0]},${highlight[1]}]`)
  })

  const response = await fetchData('image-snippet', 'get', params, 'image/png', 'arraybuffer')
  if (response.status !== 200) {
    notification.value = {
      show: true,
      error: true,
      delay: 4000,
      msg: 'Something went wrong! Contact us if the error persists!'
    }
  } else {
    image.value = await response.arrayBuffer().then(
      (buffer) =>
        `data:${response.headers.get('content-type')};base64,${btoa(
          Array.from(new Uint8Array(buffer))
            .map((buf) => String.fromCharCode(buf))
            .join('')
        )}`
    )
  }
  imageIsLoading.value = false
}

const openImageModal = (title: string) => {
  imageModal.value = {
    show: true,
    title: title,
    data: image.value ? image.value : null
  }
}

const openTranscribedText = () => {
  const textParams = new URLSearchParams()
  if (query) {
    textParams.append('query', query)
  }
  if (strict) {
    textParams.append('strict', strict)
  }
  const url = `/text/${docRef}/page/${snippet.page}/?` + textParams.toString()
  openDeepLink(url)
}

const openDeepLink = (url: string) => window.open(url, '_blank')
</script>
