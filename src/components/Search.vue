<script setup lang="ts">
import { computed, ref, onMounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const router = useRouter()
const route = useRoute()
const keycloak = useKeycloakStore().keycloak
const preferences = usePreferencesStore()
const API_URL = inject('apiUrl')

onMounted(() => {
  getUrlQueryParams()
})

const query = ref<string>('')
const strict = ref(false)
const page = ref<number>(1)

const getUrlQueryParams = async () => {
  //router is async so we wait for it to be ready
  await router.isReady()
  //once its ready we can access the query params
  console.log(route.query)
  if (route.query['query']) {
    query.value = route.query['query'] as string
  }
  if (route.query['strict']) {
    strict.value = route.query['strict'] === 'true'
  }
  if (route.query['page']) {
    page.value = Number(route.query['page'])
  }

  search(false)
}

const searchResults = ref<SearchResult[]>([])
const totalCount = ref<number>(0)
const lastPage = computed(() => {
  const last = Math.floor((totalCount.value - 1) / preferences.resultsPerPage) + 1
  console.log(
    `totalCount: ${totalCount.value}, results per page: ${preferences.resultsPerPage}. Current: ${page.value}. Last: ${last}`
  )
  return last
})

interface Snippet {
  text: String
  start: number
  end: number
  highlights: number[][]
}

interface Metadata {
  title: string
  author: string
  titleEnglish: string
  authorEnglish: string
  publicationYear: string
  publisher: string
  volume: string
}

interface SearchResult {
  docRef: string
  metadata: Metadata
  snippets: Snippet[]
}

interface SearchResponse {
  results: SearchResult[]
  totalCount: number
}

function search(updateHistory: boolean) {
  axios
    .get<SearchResponse>(`${API_URL}/search`, {
      params: {
        query: query.value,
        strict: strict.value,
        first: (page.value - 1) * preferences.resultsPerPage,
        max: page.value * preferences.resultsPerPage,
        'max-snippets': preferences.snippetsPerResult,
        'row-padding': 2
      },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${keycloak?.token}`
      }
    })
    .then((response) => {
      if (updateHistory) {
        const url =
          route.path +
          '?query=' +
          encodeURIComponent(query.value) +
          '&strict=' +
          encodeURIComponent(strict.value) +
          '&page=' +
          page.value
        history.pushState({}, '', url)
      }
      searchResults.value = response.data.results
      totalCount.value = response.data.totalCount
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
          Authorization: `Bearer ${keycloak?.token}`
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

function gotoPage(newPage: number) {
  page.value = newPage
  search(true)
}
</script>

<template>
  <div>
    <div class="field has-addons">
      <div class="control">
        <input
          v-model="query"
          class="input is-normal"
          type="text"
          :placeholder="$t('search.query')"
          @keyup.enter="search(true)"
        />
      </div>
      <div class="control">
        <button @click="search(true)" class="button is-normal">
          <span class="icon is-small">
            <svg
              class="svg-inline--fa fa-search fa-w-16"
              aria-hidden="true"
              focusable="false"
              data-prefix="fa"
              data-icon="search"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
              ></path>
            </svg>
          </span>
        </button>
      </div>
      <div class="control pr-2 pl-2">
        <label class="checkbox">
          <input type="checkbox" v-model="strict" @change="search(true)" />
          {{ $t('search.strict') }}
        </label>
      </div>
    </div>
    <div v-if="searchResults.length > 0">
      <ul>
        <li v-for="result of searchResults">
          <h1>{{ result.metadata.title ?? result.docRef }}</h1>
          <div v-if="typeof result.metadata.titleEnglish !== undefined">
            <strong>{{ $t('results.alternate-title') }}</strong> {{ result.metadata.titleEnglish }}
          </div>
          <div v-if="typeof result.metadata.volume !== undefined">
            <strong>{{ $t('results.volume') }}</strong> {{ result.metadata.volume }}
          </div>
          <div v-if="typeof result.metadata.author !== undefined">
            <strong>{{ $t('results.author') }}</strong> {{ result.metadata.author }}
          </div>
          <div v-if="typeof result.metadata.authorEnglish !== undefined">
            <strong>{{ $t('results.alternate-author') }}</strong>
            {{ result.metadata.authorEnglish }}
          </div>
          <div v-if="typeof result.metadata.publisher !== undefined">
            <strong>{{ $t('results.publisher') }}</strong> {{ result.metadata.publisher }}
          </div>
          <div v-if="typeof result.metadata.publicationYear !== undefined">
            <strong>{{ $t('results.publication-year') }}</strong>
            {{ result.metadata.publicationYear }}
          </div>
          <div>
            <strong>{{ $t('results.document-reference') }}</strong> {{ result.docRef }}
          </div>
          <ul>
            <li v-for="(snippet, index) in result.snippets">
              <div v-html="snippet.text" class="rtl-align yiddish pr-2 pl-2"></div>
              <button
                @click="toggleImageSnippet(result.docRef, index, snippet)"
                class="button is-text"
              >
                <span class="icon is-small">
                  <svg
                    class="svg-inline--fa fa-file-image fa-w-12 mx-1"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="file-image"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M384 121.941V128H256V0h6.059a24 24 0 0 1 16.97 7.029l97.941 97.941a24.002 24.002 0 0 1 7.03 16.971zM248 160c-13.2 0-24-10.8-24-24V0H24C10.745 0 0 10.745 0 24v464c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V160H248zm-135.455 16c26.51 0 48 21.49 48 48s-21.49 48-48 48-48-21.49-48-48 21.491-48 48-48zm208 240h-256l.485-48.485L104.545 328c4.686-4.686 11.799-4.201 16.485.485L160.545 368 264.06 264.485c4.686-4.686 12.284-4.686 16.971 0L320.545 304v112z"
                    ></path>
                  </svg>
                </span>
                <span>{{ $t('results.show-image-snippet') }}</span>
              </button>
              <img :src="images.get(`${result.docRef}_${index}`)" title="Image" />
              <hr />
            </li>
          </ul>
        </li>
      </ul>
      <nav class="pagination" role="navigation" aria-label="pagination">
        <button @click="gotoPage(page - 1)" :disabled="page <= 1" class="pagination-previous">
          {{ $t('pagination.previous') }}
        </button>
        <button @click="gotoPage(page + 1)" :disabled="page >= lastPage" class="pagination-next">
          {{ $t('pagination.next') }}
        </button>
        <ul class="pagination-list">
          <li v-if="page - 1 > 1">
            <a @click="gotoPage(1)" class="pagination-link" aria-label="Goto page 1">1</a>
          </li>
          <li v-if="page - 1 > 1">
            <span class="pagination-ellipsis">&hellip;</span>
          </li>
          <li v-if="page > 1">
            <a
              @click="gotoPage(page - 1)"
              class="pagination-link"
              :aria-label="`Goto page ${page - 1}`"
              >{{ page - 1 }}</a
            >
          </li>
          <li>
            <a
              class="pagination-link is-current"
              :aria-label="`Page ${page}`"
              aria-current="page"
              >{{ page }}</a
            >
          </li>
          <li v-if="page < lastPage">
            <a
              @click="gotoPage(page + 1)"
              class="pagination-link"
              :aria-label="`Goto page ${page + 1}`"
              >{{ page + 1 }}</a
            >
          </li>
          <li v-if="page + 1 < lastPage">
            <span class="pagination-ellipsis">&hellip;</span>
          </li>
          <li v-if="page + 1 < lastPage">
            <a
              @click="gotoPage(lastPage)"
              class="pagination-link"
              :aria-label="`Goto page ${lastPage}`"
              >{{ lastPage }}</a
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
