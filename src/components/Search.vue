<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { store } from '../store.js'

const router = useRouter()
const route = useRoute()

const API_URL = inject('apiUrl')

onMounted(() => {
  getUrlQueryParams()
})

const query = ref<string>('velt')

const getUrlQueryParams = async () => {
  //router is async so we wait for it to be ready
  await router.isReady()
  //once its ready we can access the query params
  console.log(route.query)
  query.value = route.query['query'] as string
  search(false)
}

const results = ref<SearchResult[]>([])

interface Snippet {
  text: String
  start: number
  end: number
  highlights: number[][]
}

interface SearchResult {
  docRef: string
  snippets: Snippet[]
}

interface SearchResponse {
  results: SearchResult[]
}

function search(updateHistory: boolean) {
  axios
    .get<SearchResponse>(`${API_URL}/search`, {
      params: {
        query: query.value,
        first: '0',
        max: '10',
        'max-snippets': '20',
        'row-padding': '2'
      },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${store.keycloakToken}`
      }
    })
    .then((response) => {
      if (updateHistory) {
        history.pushState({}, '', route.path + '?query=' + encodeURIComponent(query.value))
      }
      results.value = response.data.results
      images.value = new Map()
    })
}

const images = ref<Map<string, string>>(new Map())

function toggleImageSnippet(docRef: string, index: number, snippet: Snippet) {
  const imageKey = `${docRef}_${index}`
  if (images.value.has(imageKey)) {
    console.log(`Deleting image ${imageKey}`)
    images.value.delete(imageKey)
  } else {
    console.log(`Creating image ${imageKey}`)
    const params = new URLSearchParams()
    params.append('doc-ref', docRef)
    params.append('start-offset', `${snippet.start}`)
    params.append('end-offset', `${snippet.end}`)
    snippet.highlights.forEach((highlight) =>
      params.append('highlight', `[${highlight[0]},${highlight[1]}]`)
    )

    axios
      .get(`${API_URL}/image-snippet`, {
        params: params,
        headers: {
          accept: 'image/png',
          Authorization: `Bearer ${store.keycloakToken}`
        },
        responseType: 'arraybuffer'
      })
      .then((response) => {
        if (response.status == 200) {
          const b64 = btoa(String.fromCharCode(...new Uint8Array(response.data)))
          const imgData = 'data:' + response.headers['content-type'] + ';base64,' + b64
          images.value.set(imageKey, imgData)
        }
      })
  }
}
</script>

<template>
  <div class="container is-max-desktop">
    Query: <input v-model="query" />
    <button @click="search(true)" class="button is-small">Search</button>
    <ul>
      <li v-for="result of results">
        {{ result.docRef }}
        <ul>
          <li v-for="(snippet, index) in result.snippets">
            <div v-html="snippet.text" class="rtl-align yiddish"></div>
            <button
              @click="toggleImageSnippet(result.docRef, index, snippet)"
              class="button is-small"
            >
              Image
            </button>
            <img :src="images.get(`${result.docRef}_${index}`)" title="Image" />
            <hr />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
