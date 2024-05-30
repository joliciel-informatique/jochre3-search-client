<script setup lang="ts">
import { computed, ref, onMounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  // import icons here
  faMagnifyingGlass,
  faFileImage,
  faSquarePlus,
  faSquareMinus,
  faBookOpen,
  faFileLines,
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FixWordModal from '../components/FixWordModal.vue'
import FixMetadataModal from '../components/FixMetadataModal.vue'

library.add(faMagnifyingGlass)
library.add(faFileImage)
library.add(faSquarePlus)
library.add(faSquareMinus)
library.add(faBookOpen)
library.add(faFileLines)
library.add(faPenToSquare)

const router = useRouter()
const route = useRoute()
const keycloak = useKeycloakStore().keycloak
const preferences = usePreferencesStore()
const API_URL = inject('apiUrl')

onMounted(() => {
  getUrlQueryParams()

  const stylesheet = document.createElement('link')
  stylesheet.type = 'text/css'
  stylesheet.rel = 'stylesheet'
  document.head.appendChild(stylesheet)

  stylesheet.href = '/css/keyboard.css'

  const plugin = document.createElement('script')
  plugin.type = 'module'

  document.head.appendChild(plugin)

  plugin.src = '/js/keyboard.js'
  plugin.async = true

  getIndexSize()
})

function getIndexSize() {
  interface SizeResponse {
    size: number
  }

  axios
    .get<SizeResponse>(`${API_URL}/size`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${keycloak?.token}`
      }
    })
    .then((response) => {
      indexSize.value = response.data.size
    })
}

const indexSize = ref<number>(0)

const query = ref<string>('')
const relatedWordForms = ref(true)
const strict = computed(() => !relatedWordForms.value)

const page = ref<number>(1)

const authorText = ref<string>('')
const authorDropdownItems = ref<string[]>([])
const authors = ref<string[]>([])
const authorInclude = ref('true')

const title = ref<string>('')
const fromYear = ref<number>()
const toYear = ref<number>()
const docRefs = ref<string>('')
const sortBy = ref<string>('Score')

const searchResults = ref<SearchResult[]>([])
const totalCount = ref<number>(0)
const lastPage = computed(() => {
  const last = Math.floor((totalCount.value - 1) / preferences.resultsPerPage) + 1
  console.log(
    `totalCount: ${totalCount.value}, results per page: ${preferences.resultsPerPage}. Current: ${page.value}. Last: ${last}`
  )
  return last
})
const firstResult = computed(() => (page.value - 1) * preferences.resultsPerPage + 1)
const lastResult = computed(() => {
  const last = page.value * preferences.resultsPerPage
  return totalCount.value < last ? totalCount.value : last
})

const hasSearch = ref<boolean>(false)
const showAdvanced = ref<boolean>(false)

const images = ref<Map<string, string>>(new Map())
const imageBusy = ref<Set<string>>(new Set())

const facets = ref<AggregationBin[]>([])

const getUrlQueryParams = async () => {
  //router is async so we wait for it to be ready
  await router.isReady()
  //once its ready we can access the query params
  console.log(route.query)
  if (route.query['query']) {
    query.value = (route.query['query'] as string).trim()
  }
  if (route.query['strict']) {
    relatedWordForms.value = route.query['strict'] !== 'true'
  }
  if (route.query['page']) {
    page.value = Number(route.query['page'])
  }
  if (route.query['authorInclude']) {
    authorInclude.value = (route.query['authorInclude'] as string).trim()
  }
  if (route.query['authors']) {
    if (Array.isArray(route.query['authors'])) {
      authors.value = route.query['authors'] as string[]
    } else {
      authors.value = [route.query['authors'] as string]
    }
  }
  if (route.query['title']) {
    title.value = (route.query['title'] as string).trim()
  }
  if (route.query['from-year']) {
    fromYear.value = Number((route.query['from-year'] as string).trim())
  }
  if (route.query['to-year']) {
    toYear.value = Number((route.query['to-year'] as string).trim())
  }
  if (route.query['doc-refs']) {
    docRefs.value = (route.query['doc-refs'] as string).trim()
  }
  if (route.query['sort']) {
    sortBy.value = (route.query['sort'] as string).trim()
  }

  showAdvanced.value =
    authors.value.length > 0 ||
    title.value.length > 0 ||
    (fromYear.value != null && fromYear.value > 0) ||
    (toYear.value != null && toYear.value > 0) ||
    docRefs.value.length > 0 ||
    (sortBy.value.length > 0 && sortBy.value != 'Score')

  search(false)
}

interface Snippet {
  text: String
  page: number
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
  url: string
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

interface AggregationBin {
  label: string
  count: number
}

interface AggregationBins {
  bins: AggregationBin[]
}

function updateUrl() {
  const params = new URLSearchParams()
  params.append('query', query.value.trim())
  params.append('strict', strict.value.toString())
  params.append('authorInclude', authorInclude.value)
  for (const author of authors.value) {
    params.append('authors', author)
  }
  params.append('title', title.value.trim())
  params.append('page', page.value.toString())
  if (fromYear.value != null) {
    params.append('from-year', fromYear.value?.toString())
  }
  if (toYear.value != null) {
    params.append('to-year', toYear.value?.toString())
  }
  params.append('doc-refs', docRefs.value.trim())
  params.append('sort', sortBy.value.trim())
  const url = route.path + '?' + params.toString()

  history.pushState({}, '', url)
}

const isBusy = ref<boolean>(false)

function runNewSearch() {
  page.value = 1
  errorNotificationVisible.value = false

  search(true)
}

function search(updateHistory: boolean) {
  hasSearch.value =
    query.value.length > 0 ||
    authors.value.length > 0 ||
    title.value.length > 0 ||
    (fromYear.value != null && fromYear.value > 0) ||
    (toYear.value != null && toYear.value > 0) ||
    docRefs.value.length > 0

  console.log(
    `Search parameters. query: ${query.value}. strict: ${strict.value}. authors: ${authors.value}. title: ${title.value}. fromyear: ${fromYear.value}. toYear: ${toYear.value}. docREfs: ${docRefs.value}`
  )
  console.log(`Has search? ${hasSearch.value}`)

  if (hasSearch.value) {
    isBusy.value = true
    const params = new URLSearchParams()
    params.append('query', query.value)
    params.append('strict', strict.value.toString())
    params.append('author-include', authorInclude.value)
    for (const author of authors.value) {
      params.append('authors', author)
    }
    if (title.value.trim().length > 0) {
      params.append('title', title.value.trim())
    }
    if (fromYear.value != null && fromYear.value > 0) {
      console.log(`Adding from-year ${fromYear.value}`)
      params.append('from-year', fromYear.value.toString())
    }
    if (toYear.value != null && toYear.value > 0) {
      console.log(`Adding to-year ${toYear.value}`)
      params.append('to-year', toYear.value.toString())
    }
    const docRefArray = docRefs.value.split(/\W+/)
    for (const docRef of docRefArray) {
      if (docRef.length > 0) {
        params.append('doc-refs', docRef)
      }
    }

    const facetParams = new URLSearchParams({
      ...Object.fromEntries(params)
    })

    params.append('first', ((page.value - 1) * preferences.resultsPerPage).toString())
    params.append('max', preferences.resultsPerPage.toString())
    params.append('sort', sortBy.value.trim())
    params.append('max-snippets', preferences.snippetsPerResult.toString())
    params.append('row-padding', '2')

    facets.value = []

    axios
      .get<SearchResponse>(`${API_URL}/search`, {
        params: params,
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${keycloak?.token}`
        }
      })
      .then((response) => {
        if (updateHistory) {
          updateUrl()
        }
        hasSearch.value = true
        isBusy.value = false
        searchResults.value = response.data.results
        totalCount.value = response.data.totalCount
        images.value = new Map()
      })
      .catch((error) => {
        console.error(error)
        errorNotificationVisible.value = true
        isBusy.value = false
      })

    if (authors.value.length != 1) {
      facetParams.append('field', 'Author')
      facetParams.append('maxBins', '10')

      axios
        .get<AggregationBins>(`${API_URL}/aggregate`, {
          params: facetParams,
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${keycloak?.token}`
          }
        })
        .then((response) => {
          facets.value = response.data.bins

          // For testing many facets:
          // for (let i = 0; i < 10; i++) {
          //   const bin = {} as AggregationBin
          //   bin.count = 42
          //   bin.label = 'כלב שבכלבים'
          //   facets.value.push(bin)
          // }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  } else {
    if (updateHistory) {
      updateUrl()
    }
    searchResults.value = []
    totalCount.value = 0
    images.value = new Map()
  }
}

function addAuthorToQuery(author: string) {
  authors.value = [author]
  authorInclude.value = 'true'
  runNewSearch()
}

function toggleImageSnippet(docRef: string, index: number, snippet: Snippet) {
  const imageKey = `${docRef}_${index}`
  if (images.value.has(imageKey)) {
    console.log(`Deleting image ${imageKey}`)
    images.value.delete(imageKey)
  } else {
    console.log(`Creating image ${imageKey}`)
    imageBusy.value.add(imageKey)

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
          imageBusy.value.delete(imageKey)
        }
      })
      .catch((error) => {
        console.error(error)
        imageBusy.value.delete(imageKey)
      })
  }
}

function gotoPage(newPage: number) {
  page.value = newPage
  search(true)
}

function resetResults() {
  query.value = ''
  page.value = 1
  title.value = ''
  fromYear.value = undefined
  toYear.value = undefined
  docRefs.value = ''
  authors.value = []
  relatedWordForms.value = true
  sortBy.value = 'Score'
  showAdvanced.value = false
  errorNotificationVisible.value = false
  search(true)
}

function findAuthors() {
  if (authorText.value.length > 0) {
    axios
      .get<AggregationBins>(`${API_URL}/authors`, {
        params: {
          prefix: authorText.value,
          maxBins: 10
        },
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${keycloak?.token}`
        }
      })
      .then((response) => {
        authorDropdownItems.value = response.data.bins.map((b) => b.label)
      })
  } else {
    authorDropdownItems.value = []
  }
}

function addAuthor(author: string) {
  authors.value.push(author)
  authorText.value = ''
  authorDropdownItems.value = []
}

function removeAuthor(author: string) {
  const index = authors.value.indexOf(author, 0)
  if (index > -1) {
    authors.value.splice(index, 1)
  }
}

const fixWordModalVisible = ref<boolean>(false)
const fixWordOffset = ref<number>()
const fixWordDocRef = ref<string>()
function showFixWordModal() {
  fixWordModalVisible.value = true
  console.log(`fixWordVisible: ${fixWordModalVisible.value}`)
}

function hideFixWordModal() {
  fixWordModalVisible.value = false
  console.log(`fixWordVisible: ${fixWordModalVisible.value}`)
}

function correctWord(docRef: string) {
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

    fixWordDocRef.value = docRef
    fixWordOffset.value = wordOffset
    showFixWordModal()
  }
}

const fixMetadataModalVisible = ref<boolean>(false)
const fixMetadataDocRef = ref<string>()
const fixMetadataField = ref<string>()
const fixMetadataCurrentValue = ref<string>()

function showFixMetadataModal() {
  fixMetadataModalVisible.value = true
  console.log(`fixMetadataModalVisible: ${fixMetadataModalVisible.value}`)
}

function hideFixMetadataModal() {
  fixMetadataModalVisible.value = false
  console.log(`fixMetadataModalVisible: ${fixMetadataModalVisible.value}`)
}

function fixMetadata(docRef: string, field: string, currentValue: string | undefined) {
  console.log(`Correct metadata, doc ${docRef}, field ${field}, currentValue ${currentValue}`)
  fixMetadataDocRef.value = docRef
  fixMetadataField.value = field
  fixMetadataCurrentValue.value = currentValue ?? ''
  showFixMetadataModal()
}

const errorNotificationVisible = ref<boolean>(false)

function hideErrorNotification() {
  errorNotificationVisible.value = false
  console.log(`errorNotificationVisible: ${errorNotificationVisible.value}`)
}
</script>

<template>
  <FixWordModal
    :visible="fixWordModalVisible"
    :doc-ref="fixWordDocRef"
    :word-offset="fixWordOffset"
    @on-close-modal="hideFixWordModal"
  ></FixWordModal>
  <FixMetadataModal
    :visible="fixMetadataModalVisible"
    :doc-ref="fixMetadataDocRef"
    :field="fixMetadataField"
    :current-value="fixMetadataCurrentValue"
    @on-close-modal="hideFixMetadataModal"
  ></FixMetadataModal>
  <div class="notification is-danger" v-if="errorNotificationVisible">
    <button class="delete" @click="hideErrorNotification"></button>
    {{ $t('error') }}
  </div>
  <div>
    <div class="block has-text-white custom-background has-text-weight-semibold m-0 p-0">
      <div class="container is-max-desktop">
        <div class="field has-addons pb-0 mb-0">
          <input
            id="query"
            v-model="query"
            class="input is-normal keyboardInput"
            type="text"
            lang="yi"
            :placeholder="$t('search.query')"
            @keyup.enter="runNewSearch()"
          />
          <button @click="runNewSearch()" class="button is-normal" v-if="true">
            <span class="icon is-small">
              <font-awesome-icon icon="magnifying-glass" />
            </span>
          </button>
        </div>
        <div class="control pr-2 pl-2">
          <label class="checkbox">
            <input type="checkbox" v-model="relatedWordForms" @change="runNewSearch()" />
            {{ $t('search.related-word-forms') }}
          </label>
        </div>
        <div class="pt-0 mt-0">
          <a @click="showAdvanced = !showAdvanced" class="link-white">
            <span class="m-1">{{ $t('search.advanced') }}</span>
            <span class="icon is-small m-1">
              <font-awesome-icon v-if="!showAdvanced" icon="square-plus" />
              <font-awesome-icon v-if="showAdvanced" icon="square-minus" />
            </span>
          </a>
        </div>
      </div>
    </div>
    <div v-show="showAdvanced" class="block custom-background-light m-0 p-0">
      <div class="container is-max-desktop">
        <p>{{ $t('search.field-instructions') }}</p>
        <div class="field has-addons">
          <label class="label">{{ $t('search.author') }}</label>
          <div class="dropdown is-active is-right">
            <div class="dropdown-trigger">
              <input
                id="findAuthors"
                class="input"
                type="text"
                v-model="authorText"
                @input="findAuthors"
              />
            </div>
            <div
              class="dropdown-menu"
              id="dropdown-menu"
              role="menu"
              v-if="authorDropdownItems.length > 0"
            >
              <div class="dropdown-content">
                <a
                  v-for="author of authorDropdownItems"
                  class="dropdown-item"
                  @click="addAuthor(author)"
                  >{{ author }}</a
                >
              </div>
            </div>
          </div>
          <div class="control">
            <label class="radio">
              <input type="radio" name="authorInclude" value="true" v-model="authorInclude" />
              ✓
            </label>
            <label class="radio">
              <input type="radio" name="authorInclude" value="false" v-model="authorInclude" />
              ✗
            </label>
          </div>
          <button v-for="author of authors" class="tag mr-1 ml-1" @click="removeAuthor(author)">
            {{ author }} ×
          </button>
        </div>
        <div class="field has-addons">
          <label class="label">{{ $t('search.title') }}</label>
          <input
            id="title"
            class="input keyboardInput"
            type="text"
            lang="yi"
            v-model="title"
            @keyup.enter="runNewSearch()"
          />
        </div>
        <div class="field has-addons">
          <label class="label">{{ $t('search.date-from') }}</label>
          <input
            id="fromYear"
            class="input"
            type="number"
            v-model="fromYear"
            min="1700"
            max="2000"
            @keyup.enter="search(true)"
          />
          <label class="label">{{ $t('search.date-to') }}</label>
          <input
            id="toYear"
            class="input"
            type="number"
            v-model="toYear"
            min="1700"
            max="2000"
            @keyup.enter="search(true)"
          />
        </div>
        <div class="field has-addons">
          <label class="label">{{ $t('search.document-reference') }}</label>
          <input class="input" type="text" v-model="docRefs" @keyup.enter="search(true)" />
        </div>
        <div class="field has-addons">
          <label class="label">{{ $t('search.sort-by') }}</label>
          <div class="select">
            <select v-model="sortBy">
              <option value="Score">{{ $t('search.sort.score') }}</option>
              <option value="DateAscending">{{ $t('search.sort.date-ascending') }}</option>
              <option value="DateDescending">{{ $t('search.sort.date-descending') }}</option>
            </select>
          </div>
        </div>
        <div class="field has-text-centered p-2">
          <button class="button is-light" @click="resetResults">{{ $t('search.reset') }}</button
          >&nbsp;
          <button class="button is-inverted" @click="search(true)">
            {{ $t('search.search') }}
          </button>
        </div>
      </div>
    </div>
    <div class="container is-max-desktop hero search-content">
      <div v-if="isBusy">
        <img src="/images/loading.gif" />
      </div>
      <div v-if="!isBusy && !hasSearch && searchResults.length == 0">
        <div v-html="$t('search.about')"></div>
        <div>{{ $t('search.index-size', [indexSize]) }}</div>
      </div>
      <div v-if="!isBusy && hasSearch">
        <div>
          <span class="is-pulled-right" v-if="searchResults.length == 0">
            <div class="navbar-item" v-if="searchResults.length == 0">
              <strong>{{ $t('results.none') }}</strong>
            </div>
          </span>
          <span class="is-pulled-right" v-for="facet of facets">
            <button @click="addAuthorToQuery(facet.label)" class="button is-small is-dark m-1">
              {{ facet.label }}: {{ facet.count }}
            </button>
          </span>
          <span class="is-pulled-left">
            <button @click="router.back()" class="button is-small is-light m-1">
              {{ $t('back') }}
            </button>
            <button @click="resetResults" class="button is-small is-light m-1">
              {{ $t('results.reset') }}
            </button>
          </span>
        </div>
      </div>
      <div v-if="!isBusy && hasSearch && searchResults.length > 0">
        <strong
          >{{ $t('results.result-count', [totalCount]) }}
          {{ $t('results.result-range', [firstResult, lastResult]) }}</strong
        >
      </div>
      <div v-if="!isBusy && searchResults.length > 0">
        <ul>
          <li v-for="result of searchResults">
            <h1 class="title">
              <a :href="result.metadata.url" target="_blank">{{
                result.metadata.title ?? result.docRef
              }}</a>
              <button
                @click="fixMetadata(result.docRef, 'Title', result.metadata.title)"
                class="button is-small is-white"
              >
                <span class="icon is-small fa-2xs">
                  <font-awesome-icon icon="pen-to-square" />
                </span>
              </button>
            </h1>
            <div>
              <strong>{{ $t('results.alternate-title') }}</strong
              >&nbsp;
              <span :class="{ ltr: $i18n.locale === 'yi', english: $i18n.locale === 'yi' }">
                {{ result.metadata.titleEnglish }}
              </span>
              <button
                @click="fixMetadata(result.docRef, 'TitleEnglish', result.metadata.titleEnglish)"
                class="button is-small is-white"
              >
                <span class="icon is-small fa-2xs">
                  <font-awesome-icon icon="pen-to-square" />
                </span>
              </button>
            </div>
            <div>
              <strong>{{ $t('results.volume') }}</strong
              >&nbsp;
              {{ result.metadata.volume }}
              <button
                @click="fixMetadata(result.docRef, 'Volume', result.metadata.volume)"
                class="button is-small is-white"
              >
                <span class="icon is-small fa-2xs">
                  <font-awesome-icon icon="pen-to-square" />
                </span>
              </button>
            </div>
            <div>
              <strong>{{ $t('results.author') }}</strong
              >&nbsp;
              {{ result.metadata.author }}
              <button
                @click="fixMetadata(result.docRef, 'Author', result.metadata.author)"
                class="button is-small is-white"
              >
                <span class="icon is-small fa-2xs">
                  <font-awesome-icon icon="pen-to-square" />
                </span>
              </button>
            </div>
            <div>
              <strong>{{ $t('results.alternate-author') }}</strong
              >&nbsp;
              <span :class="{ ltr: $i18n.locale === 'yi', english: $i18n.locale === 'yi' }">{{
                result.metadata.authorEnglish
              }}</span>
              <button
                @click="fixMetadata(result.docRef, 'AuthorEnglish', result.metadata.authorEnglish)"
                class="button is-small is-white"
              >
                <span class="icon is-small fa-2xs">
                  <font-awesome-icon icon="pen-to-square" />
                </span>
              </button>
            </div>
            <div v-if="result.metadata.publisher != null">
              <strong>{{ $t('results.publisher') }}</strong
              >&nbsp;
              {{ result.metadata.publisher }}
              <button
                @click="fixMetadata(result.docRef, 'Publisher', result.metadata.publisher)"
                class="button is-small is-white"
              >
                <span class="icon is-small fa-2xs">
                  <font-awesome-icon icon="pen-to-square" />
                </span>
              </button>
            </div>
            <div>
              <strong>{{ $t('results.publication-year') }}</strong
              >&nbsp;
              {{ result.metadata.publicationYear }}
              <button
                @click="
                  fixMetadata(result.docRef, 'PublicationYear', result.metadata.publicationYear)
                "
                class="button is-small is-white"
              >
                <span class="icon is-small fa-2xs">
                  <font-awesome-icon icon="pen-to-square" />
                </span>
              </button>
            </div>
            <div>
              <strong>{{ $t('results.document-reference') }}</strong
              >&nbsp;{{ result.docRef }}
            </div>
            <ul>
              <li v-for="(snippet, index) in result.snippets">
                <div
                  v-html="snippet.text"
                  class="rtl-align yiddish pr-2 pl-2"
                  @dblclick="correctWord(result.docRef)"
                ></div>
                <div class="container">
                  <button
                    class="button is-small is-text p-1 m-1"
                    @click="toggleImageSnippet(result.docRef, index, snippet)"
                  >
                    <span class="icon">
                      <font-awesome-icon icon="file-image" size="xs" />
                    </span>
                  </button>
                  <button
                    @click="toggleImageSnippet(result.docRef, index, snippet)"
                    class="button is-text p-0 m-1"
                  >
                    <span>{{ $t('results.show-image-snippet') }}</span>
                  </button>
                  <button
                    class="button is-small is-text p-1 m-1"
                    @click="router.push(`/text/${result.docRef}/page/${snippet.page}`)"
                  >
                    <span class="icon">
                      <font-awesome-icon icon="file-lines" size="xs" />
                    </span>
                  </button>
                  <button
                    @click="router.push(`/text/${result.docRef}/page/${snippet.page}`)"
                    class="button is-text p-0 m-1"
                  >
                    <span>{{ $t('results.show-text') }}</span>
                  </button>
                  <a
                    class="button is-small is-text p-1 m-1"
                    :href="`https://archive.org/details/${result.docRef}/page/n${snippet.page}/mode/1up`"
                    target="_blank"
                  >
                    <span class="icon">
                      <font-awesome-icon icon="book-open" size="xs" />
                    </span>
                  </a>
                  <a
                    :href="`https://archive.org/details/${result.docRef}/page/n${snippet.page}/mode/1up`"
                    target="_blank"
                    class="button is-text p-0 m-1"
                  >
                    <span>{{ $t('results.show-original-page', [snippet.page]) }}</span>
                  </a>
                </div>
                <br />
                <div v-if="imageBusy.has(`${result.docRef}_${index}`)">
                  <img src="/images/loading.gif" />
                </div>
                <img
                  v-if="images.has(`${result.docRef}_${index}`)"
                  :src="images.get(`${result.docRef}_${index}`)"
                  title="Image"
                />
              </li>
            </ul>
            <hr />
          </li>
        </ul>
        <nav class="pagination p-1" role="navigation" aria-label="pagination">
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
                class="pagination-link is-current current-page-color"
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
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>
