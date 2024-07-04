<template>
  <div
    v-html="snippet.text"
    class="rtl-align snippet rtl yiddish pr-2 pl-2"
    @dblclick="correctWord(docRef)"
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
    <a
      class="button is-text p-0 m-1"
      v-if="snippet.deepLink"
      :href="snippet.deepLink"
      target="_blank"
    >
      <span>{{ $t('results.show-original-page', [snippet.page]) }}</span>
    </a>
  </div>
  <br />
  <div v-if="imageBusy.has(reference)">
    <img src="/images/loading.gif" />
  </div>
  <img
    class="image-snippet"
    v-if="images.has(reference)"
    :src="images.get(reference)"
    title="Image"
  />
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { inject } from 'vue'

const props = defineProps(['snippet', 'docRef', 'index', 'url', 'images', 'imageBusy'])

const reference = computed(() => {
  return `${props.docRef}_${props.index}`
})

// Setup EventBus
const eventBus: any = inject('eventBus')

// Setup router
import { useRouter } from 'vue-router'
import { computed } from 'vue'
const router = useRouter()

const toggleImageSnippet = () =>
  eventBus.emit('toggleImageSnippet', [
    props.docRef,
    reference.value,
    props.snippet.start,
    props.snippet.end,
    props.snippet.highlights
  ])

const correctWord = (docRef: string) => {
  var sel = window.getSelection()

  if (sel && sel.anchorNode) {
    const range = sel.getRangeAt(0)
    console.log(
      `range startOffset: ${range.startOffset}, endOffset ${range.endOffset}, startContainer ${range.startContainer.nodeName}, endContainer ${range.endContainer.nodeName}, commonAncestorContainer ${range.commonAncestorContainer.nodeName}`
    )
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
    console.log(
      `localOffset: ${localOffset}, globalOffset: ${globalOffset}, wordOffset: ${wordOffset}`
    )

    // Pass new values to FixWord modal for updating
    eventBus.emit('fixWordModal', [docRef, wordOffset, true])
  }
}
</script>
