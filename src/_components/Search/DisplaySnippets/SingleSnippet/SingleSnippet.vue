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
  <div v-if="imageBusy">
    <img src="/images/loading.gif" />
  </div>
  <img class="image-snippet" v-if="image" :src="image" title="Image" />
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import type { Snippet } from '@/components/Support/InterfacesExternals.vue'

const props = defineProps(['snippet', 'docRef', 'index', 'url'])

const keycloak = useKeycloakStore().keycloak
const API_URL = inject('apiUrl')

// Setup EventBus
const eventBus: any = inject('eventBus')

// Setup router
const router = useRouter()

// Local variables
const imageBusy = ref<boolean>(false)
const image = ref<string>()

const toggleImageSnippet = () => {
  const snippet: Snippet = props.snippet
  const docRef: string = props.docRef
  if (image.value) {
    console.log(`Deleting image ${docRef} index ${props.index}`)
    image.value = undefined
  } else {
    console.log(`Creating image ${docRef} index ${props.index}`)
    imageBusy.value = true

    const params: URLSearchParams = new URLSearchParams({
      'doc-ref': docRef,
      'start-offset': `${snippet.start}`,
      'end-offset': `${snippet.end}`
    })

    snippet.highlights.forEach((highlight: Array<Number>) => {
      console.log(highlight)
      params.append('highlight', `[${highlight[0]},${highlight[1]}]`)
    })

    const options = {
      method: 'GET',
      headers: {
        Accept: 'image/png',
        Authorization: `Bearer ${keycloak?.token}`
      },
      responseType: 'arraybuffer'
    }

    fetch(`${API_URL}/image-snippet?` + params, options)
      .then((response) =>
        response.status === 200
          ? response.arrayBuffer().then((buffer) => {
              image.value = `data:${response.headers.get('content-type')};base64,${btoa(
                Array.from(new Uint8Array(buffer))
                  .map((b) => String.fromCharCode(b))
                  .join('')
              )}`
              imageBusy.value = false
            })
          : null
      )
      .catch((error) => {
        console.error(error)
        imageBusy.value = false
      })
  }
}

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
