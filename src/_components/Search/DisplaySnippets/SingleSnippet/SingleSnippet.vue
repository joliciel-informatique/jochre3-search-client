<template>
  <div>
    <p>{{ docRef }} | {{ index }}</p>
  </div>
  <div v-html="snippet.text" class="rtl-align snippet rtl yiddish pr-2 pl-2" @dblclick="correctWord(docRef)"></div>
  <div class="container is-italic has-text-weight-bold"> {{ $t('results.word-fix-instructions') }} </div>
  <div class="container">
    <button class="button is-small is-text p-1 m-1" @click="toggleImageSnippet()">
      <span class="icon">
        <font-awesome-icon icon="file-image" size="xs" />
      </span>
    </button>
    <button class="button is-text p-0 m-1" @click="toggleImageSnippet()">
      <span>{{ $t('results.show-image-snippet') }}</span>
    </button>
    <button class="button is-small is-text p-1 m-1" @click="router.push(`/text/${docRef}/page/${snippet.page}`)">
      <span class="icon">
        <font-awesome-icon icon="file-lines" size="xs" />
      </span>
    </button>
    <button class="button is-text p-0 m-1" @click="router.push(`/text/${docRef}/page/${snippet.page}`)">
      <span>{{ $t('results.show-text') }}</span>
    </button>
    <a class="button is-small is-text p-1 m-1" :href=url target="_blank">
      <span class="icon" v-if="snippet.deepLink">
        <font-awesome-icon icon="book-open" size="xs" />
      </span>
    </a>
    <a class="button is-text p-0 m-1" v-if="snippet.deepLink" :href="snippet.deepLink" target="_blank">
      <span>{{ $t('results.show-original-page', [snippet.page]) }}</span>
    </a>
  </div>
  <br />
  <div v-if="imageBusy && images.has(reference)">
    <img src="/images/loading.gif" />
  </div>
  <img class="image-snippet" v-if="images.has(reference)" :src="images.get(reference)" title="Image" />
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { Snippet } from '@/components/Support/InterfacesExternals.vue';
import { type PropType, inject} from 'vue'

const snippet = defineModel('singleSnippet', { 
  type : Object as PropType<Snippet>,
  default : {} 
})
const docRef = defineModel('docRef', { type : String, default : "" })
const index = defineModel('index', { type : Number })
const reference = `${docRef.value}_${index.value}`

// console.log(snippet.value, docRef.value, index.value, reference)

const imageBusy = <Boolean>inject('imageBusy')
const images = <Map<string, string>>inject('images')

// console.log(imageBusy, images)

// Setup EventBus
const eventBus : any = inject('eventBus')

// Setup router
import { useRouter } from 'vue-router'
const router = useRouter();

// const props = defineProps(['docRef', 'index', 'imageBusy'])

// const docRef = props['docRef']
// const index = props['index']
// const snippet = defineModel('singleSnippet', { type : Object })
// const snippet = props['snippet']
// const imageBusy = props['imageBusy']
// const images = this.images

// console.log(images)

const url = `https://archive.org/details/${docRef.value}/page/n${snippet.value.page}/mode/1up`

// const emits = defineEmits(['toggleImageSnippet'])

const toggleImageSnippet = () => eventBus.emit('toggleImageSnippet', [docRef.value, reference, snippet.value.start, snippet.value.end, snippet.value.highlights])

const correctWord = (docRef: string) => {
  var sel = window.getSelection()

  if (sel && sel.anchorNode) {
    const range = sel.getRangeAt(0)
    console.log(`range startOffset: ${range.startOffset}, endOffset ${range.endOffset}, startContainer ${range.startContainer.nodeName}, endContainer ${range.endContainer.nodeName}, commonAncestorContainer ${range.commonAncestorContainer.nodeName}`)
    console.log(`sel.anchorNode: ${sel.anchorNode.nodeName}, sel.anchorOffset: ${sel.anchorOffset}`)

    // Get the parent span
    let parentElement = sel.anchorNode
    while (parentElement.nodeType != Node.ELEMENT_NODE) {
      parentElement = parentElement.parentNode as ParentNode
    }

    let parentSpan = parentElement as HTMLElement
    while (parentSpan.tagName != 'SPAN') {
      parentSpan = parentSpan.parentElement as HTMLElement
    }

    const localOffset = sel.anchorOffset
    const globalOffsetStr = parentSpan.getAttribute('offset') ?? '0'
    const globalOffset = parseInt(globalOffsetStr)
    const wordOffset = globalOffset + localOffset
    console.log(`localOffset: ${localOffset}, globalOffset: ${globalOffset}, wordOffset: ${wordOffset}`)
   
    // Pass new values to FixWord modal for updating
    eventBus.emit('fixWordModal', [docRef, wordOffset, true])
  }
}

</script>


            <!-- <div
              v-html="snippet.text"
              class="rtl-align snippet rtl yiddish pr-2 pl-2"
              @dblclick="correctWord(singleResult.docRef)"
            ></div> -->
            <!-- <div class="container is-italic has-text-weight-bold">
              {{ $t('results.word-fix-instructions') }}
            </div> -->
            <!-- <div class="container">
              <button
                class="button is-small is-text p-1 m-1"
                @click="toggleImageSnippet(singleResult.docRef, index, snippet)"
              >
                <span class="icon">
                  <font-awesome-icon icon="file-image" size="xs" />
                </span>
              </button>
              <button
                @click="toggleImageSnippet(singleResult.docRef, index, snippet)"
                class="button is-text p-0 m-1"
              >
                <span>{{ $t('results.show-image-snippet') }}</span>
              </button>
              <button
                class="button is-small is-text p-1 m-1"
                @click="router.push(`/text/${singleResult.docRef}/page/${snippet.page}`)"
              >
                <span class="icon">
                  <font-awesome-icon icon="file-lines" size="xs" />
                </span>
              </button>
              <button
                @click="router.push(`/text/${singleResult.docRef}/page/${snippet.page}`)"
                class="button is-text p-0 m-1"
              >
                <span>{{ $t('results.show-text') }}</span>
              </button>
              <a
                class="button is-small is-text p-1 m-1"
                :href="`https://archive.org/details/${singleResult.docRef}/page/n${snippet.page}/mode/1up`"
                target="_blank"
              >
                <span class="icon" v-if="snippet.deepLink">
                  <font-awesome-icon icon="book-open" size="xs" />
                </span>
              </a>
              <a
                v-if="snippet.deepLink"
                :href="snippet.deepLink"
                target="_blank"
                class="button is-text p-0 m-1"
              >
                <span>{{ $t('results.show-original-page', [snippet.page]) }}</span>
              </a>
            </div> -->
            
            <!-- <div v-if="imageBusy.has(`${singleResult.docRef}_${index}`)">
              <img src="/images/loading.gif" />
            </div> -->
            <!-- <img
              class="image-snippet"
              v-if="images.has(`${result.docRef}_${index}`)"
              :src="images.get(`${result.docRef}_${index}`)"
              title="Image"
            /> -->