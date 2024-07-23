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
  <div
    v-html="snippet.text"
    class="rtl-align snippet rtl yiddish pr-2 pl-2"
    @dblclick="getSelectedWord(snippet.text)"
  ></div>
  <div class="container is-italic has-text-weight-bold">
    {{ $t('results.word-fix-instructions') }}
  </div>
  <div class="container">
    <button class="button is-small is-text p-1 m-1" @click="toggleImageSnippet()">
      <span class="icon">
        <font-awesome-icon icon="file-image" size="xs" />
      </span>
    </button>
    <button class="button is-text p-0 m-1" @click="toggleImageSnippet()">
      <span>{{ $t('results.show-image-snippet') }}</span>
    </button>
    <button
      class="button is-small is-text p-1 m-1"
      @click="router.push(`/text/${docRef}/page/${snippet.page}`)"
    >
      <span class="icon">
        <font-awesome-icon icon="file-lines" size="xs" />
      </span>
    </button>
    <button
      class="button is-text p-0 m-1"
      @click="router.push(`/text/${docRef}/page/${snippet.page}`)"
    >
      <span>{{ $t('results.show-text') }}</span>
    </button>
    <a class="button is-small is-text p-1 m-1" :href="url" target="_blank">
      <span class="icon" v-if="snippet.deepLink">
        <font-awesome-icon icon="book-open" size="xs" />
      </span>
    </a>
    <a class="button is-text p-0 m-1" v-if="snippet.deepLink" :href="snippet.deepLink" target="_blank">
      <span>{{ $t('results.show-original-page', [snippet.page]) }}</span>
    </a>
  </div>
  <br />
  <div v-if="imageBusy">
    <img src="/images/loading.gif" />
  </div>
  <img class="image-snippet" v-if="image" :src="image" title="Image" />
  <FixWord 
    v-model:wordOffset="wordOffset"
    v-model:word="word"
    v-model:wordImage="wordImage"
    v-model:visibility="visibility"  
    :docRef="docRef"
  />
</template>

<script setup lang="ts">
import FixWord from '@/_components/Modals/FixWord/FixWord.vue'
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRouter } from 'vue-router'
import { fetchData } from '@/assets/fetchMethods'

const { snippet, docRef, url } = defineProps(['snippet', 'docRef', 'url'])

// Setup router
const router = useRouter()

// Local variables
const image = ref<string>()
const imageBusy = ref(false)

const wordOffset = ref(0)
const word = ref('')
const wordImage = ref('')
const visibility = ref(false)

// import { fixWordVisible, wordOffset, word, wordImage, cachedImages } from '@/_components/Modals/FixWord/FixWord-variables';
// import { wordOffset, word, wordImage, fixWordVisible} from '@/_components/Modals/FixWord/FixWord.vue';

const getSelectedWord = (snippet: string) => {
    const sel = window.getSelection()
    if (sel && sel.anchorNode) {

        const div1 = document.createElement('div');
        div1.innerHTML = snippet.trim();

        // Get the parent span
        let parentElement = sel.anchorNode

        while (parentElement.nodeType != Node.ELEMENT_NODE) {
          parentElement = parentElement.parentNode as ParentNode
        }

        let parentSpan = parentElement as HTMLElement
        while (parentSpan.tagName != 'SPAN') {
          parentSpan = parentSpan.parentElement as HTMLElement
        }

        if (parentSpan.tagName === 'SPAN') {

          const offset = parentSpan.getAttribute('offset') ?? '0'

          // docRef.value = ref
          wordOffset.value = parseInt(offset)

          // Pull the image from the database
          const params : URLSearchParams = new URLSearchParams({ 'doc-ref' : docRef, 'word-offset' : wordOffset.value.toString() })

          fetchData('word-image', 'get', params, 'image/png', 'arraybuffer')
          .then(response => (response.status === 200) ? response.arrayBuffer()
          .then(buffer => wordImage.value = `data:${response.headers.get('content-type')};base64,${btoa(Array.from(new Uint8Array(buffer)).map((buf) => String.fromCharCode(buf)).join(''))}` 
          ) : null)

          console.log(1)

          // const img : { docRef : string, page : number, offset : number, image : string } | undefined = cachedImages.find(ref, page, wordOffset.value)
          // if (img !== undefined) {

            // Pull text from the DOM-cached snippet
            // wordImage.value = img.image
            
          const selectedWord = div1.querySelector(`span[offset="${wordOffset.value}"]`)
            
          if (selectedWord !== null && selectedWord.textContent !== null) {
            word.value = selectedWord.textContent
          }

        } else {

            // Else set selected text
            if (sel.anchorNode.textContent) {
              word.value = sel.anchorNode.textContent.substring(sel.anchorOffset, sel.focusOffset).trim()
              wordImage.value = ''
            }

        }
        visibility.value = true // Open modal
      }
    }

const toggleImageSnippet = () => {
  if (image.value) {
    image.value = undefined
  } else {
    imageBusy.value = true

    const params: URLSearchParams = new URLSearchParams({
      'doc-ref': docRef,
      'start-offset': `${snippet.start}`,
      'end-offset': `${snippet.end}`
    })

    snippet.highlights.forEach((highlight: Array<Number>) => {
      params.append('highlight', `[${highlight[0]},${highlight[1]}]`)
    })

    fetchData('image-snippet', 'get', params, 'image/png', 'arraybuffer')
      .then((response) => response.status === 200 ? response.arrayBuffer()
      .then((buffer) => {
        image.value = `data:${response.headers.get('content-type')};base64,${btoa(String.fromCharCode(...new Uint8Array(buffer)))}`
        imageBusy.value = false
      }) : null)
      .catch((error) => {
        console.error(error)
        imageBusy.value = false
      })
  }
}
</script>
