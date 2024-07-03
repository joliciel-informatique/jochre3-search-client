<template>
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
      <div v-if="!isBusy && !hasSearch && !searchResults">
        <div v-html="$t('search.about')"></div>
        <div>{{ $t('search.index-size', [indexSize]) }}</div>
      </div>
      <FacetDisplay 
        v-model:isBusy="isBusy" 
        v-model:hasSearch="hasSearch"
        :searchResults="searchResults" 
        :facets="facets"
      />
      <PageNumbering
        v-model:page="page" 
        v-model:totalCount="totalCount"
      />
      <DisplayResults 
        v-model:isBusy="isBusy" 
        v-model:hasSearch="hasSearch" 
        :searchResults="searchResults"
        v-model:totalCount="totalCount"
        v-model:firstResult="firstResult"
        v-model:lastResult="lastResult"
      />
      <PageNumbering
        v-model:page="page" 
        v-model:totalCount="totalCount"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'

// Importing Interfaces
import type { SearchResult, AggregationBin, AggregationBins } from '@/components/Support/InterfacesExternals.vue'

// Importing sub-components
import PageNumbering from '@/_components/PageNumbering/PageNumbering.vue'
import FacetDisplay from '@/components/FacetDisplay.vue'
import DisplayResults from '@/_components/Search/DisplayResults/DisplayResults.vue'

import { fetchData } from '@/components/Support/FetchMethods.vue'

// Configure icons
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faMagnifyingGlass,
  faFileImage,
  faSquarePlus,
  faSquareMinus,
  faBookOpen,
  faFileLines,
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons'
library.add(faMagnifyingGlass, faFileImage, faSquarePlus, faSquareMinus, faBookOpen, faFileLines, faPenToSquare)

// Startup variables
const router = useRouter()
const route = useRoute()
const keycloak = useKeycloakStore().keycloak
const preferences = usePreferencesStore()
const API_URL = inject('apiUrl')

// References
const indexSize = ref<number>(0)
const errorNotificationVisible = ref<boolean>(false)

// System
const hasSearch = ref<boolean>(false)
const showAdvanced = ref<boolean>(false)
const isBusy = ref<boolean>(false)

// Query
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

// Search
const searchResults = ref<SearchResult[]>([])
const facets = ref<AggregationBin[]>([])

// Metadata
const totalCount = ref<number>(0)
const firstResult = computed(() => (page.value - 1) * preferences.resultsPerPage + 1)
const lastResult = computed(() => {
  const last = page.value * preferences.resultsPerPage
  return totalCount.value < last ? totalCount.value : last
})

// Globals
let images = <Map<string, string>>inject('images')
let imageBusy = <Set<string>>inject('imageBusy')

onMounted(() => {
  router.isReady().then(() => {
    if (route.query['query']) query.value = (route.query['query'] as string).trim()
    if (route.query['strict']) relatedWordForms.value = route.query['strict'] !== 'true'
    if (route.query['page']) page.value = Number(route.query['page'])
    if (route.query['authorInclude']) authorInclude.value = (route.query['authorInclude'] as string).trim()
    if (route.query['title']) title.value = (route.query['title'] as string).trim()
    if (route.query['from-year']) fromYear.value = Number((route.query['from-year'] as string).trim())
    if (route.query['to-year']) toYear.value = Number((route.query['to-year'] as string).trim())
    if (route.query['doc-refs']) docRefs.value = (route.query['doc-refs'] as string).trim()
    if (route.query['sort']) sortBy.value = (route.query['sort'] as string).trim()
    if (route.query['authors'] && (Array.isArray(route.query['authors']))) authors.value = route.query['authors'] as string[]
    if (route.query['authors'] && (!Array.isArray(route.query['authors']))) authors.value = [route.query['authors'] as string]
      
    showAdvanced.value =
      authors.value.length > 0 ||
      title.value.length > 0 ||
      (fromYear.value != null && fromYear.value > 0) ||
      (toYear.value != null && toYear.value > 0) ||
      docRefs.value.length > 0 ||
      (sortBy.value.length > 0 && sortBy.value != 'Score')
   
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
    search(false)
  })
})

// Configure EventBus
const eventBus : any = inject('eventBus')

// EventBus Listener Events
eventBus.on('toggleImageSnippet', (values : Array<any>) => toggleImageSnippet(values))
eventBus.on('resetResults', () => resetResults())
eventBus.on('updatePage', (newPage : number) => {
  page.value = newPage
  search(true)
})
eventBus.on('addFacetToQuery', (facet : string) => {
  authors.value = [facet]
  authorInclude.value = 'true'
  runNewSearch()
})
eventBus.on('error', (error : any) => {
  console.error(error)
})
  
const toggleImageSnippet = (values : Array<any>) => {
  const [docRef, reference, snippetStart, snippetEnd, highlights] = values
  if (images.has(reference)) {
    console.log(`Deleting image ${reference}`)
    images.delete(reference)
  } else {
    console.log(`Creating image ${reference}`)
    imageBusy.add(reference)

    console.log(imageBusy, highlights)

    const params : URLSearchParams = new URLSearchParams({
      'doc-ref' : docRef,
      'start-offset' : `${snippetStart}`,
      'end-offset' : `${snippetEnd}`
    })
    
    highlights.forEach((highlight:Array<Number>) => {
      console.log(highlight)
      params.append('highlight', `[${highlight[0]},${highlight[1]}]`)
    })

    const options = {
      method: "GET",
      headers: {
        Accept: "image/png",
        Authorization: `Bearer ${keycloak?.token}`
      },
      responseType : 'arraybuffer'
    }  

    fetch(`${API_URL}/image-snippet?` + params, options)
    .then(response => (response.status === 200) ? response.arrayBuffer()
    .then(buffer => {
      images.set(reference, `data:${response.headers.get('content-type')};base64,${btoa(String.fromCharCode(...new Uint8Array(buffer)))}`)
      imageBusy.delete(reference)
    }) : null)
    .catch(error => {
      console.error(error)
      imageBusy.delete(reference)
    })
  }
}

const resetResults = () => {
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
  getIndexSize()
}

const hideErrorNotification = () => {
  errorNotificationVisible.value = false
  console.log(`errorNotificationVisible: ${errorNotificationVisible.value}`)
}

const getIndexSize = () => {
  fetchData('size', 'get', undefined, `Bearer ${keycloak?.token}`, 'json').then((response) => {
    response.json().then(result => {
      indexSize.value = result.size
      isBusy.value = false
    }) 
  })
}

const updateUrl = () => {
  const params = new URLSearchParams(defineSearchParams())
  params.append('sort', sortBy.value.trim())
  const url = route.path + '?' + params.toString()
  history.pushState({}, '', url)
}

const runNewSearch = () => {
  page.value = 1
  errorNotificationVisible.value = false
  search(true)
}

const defineSearchParams = () => {
  const docRefArray = docRefs.value.split(/\W+/)
  const searchParams = Object.assign({},
      query.value !== null ? { 'query' : query.value.trim() } : null,
      strict.value.toString() !== null ? { 'strict' : strict.value.toString() } : null,
      authorInclude.value.length ? { 'author-include' : authorInclude.value } : null,
      page.value > 0 ? { 'page' : page.value.toString() } : null,
      title.value.trim().length > 0 ? { 'title' : title.value.trim() } : null,
      (toYear.value != null && toYear.value > 0) ? { 'to-year' : toYear.value.toString() } : null,
      (fromYear.value != null && fromYear.value > 0) ? { 'from-year' : fromYear.value.toString() } : null
    )
  for (const author of authors.value) searchParams.append('authors', author)
  for (const docRef of docRefArray) (docRef.length > 0) ? searchParams.append('doc-refs', docRef) : null
  return searchParams
}

const search = (updateHistory: boolean) => {
  console.log('search')
  hasSearch.value =
    query.value.length > 0 ||
    authors.value.length > 0 ||
    title.value.length > 0 ||
    (fromYear.value != null && fromYear.value > 0) ||
    (toYear.value != null && toYear.value > 0) ||
    docRefs.value.length > 0


  if (hasSearch.value) {
    isBusy.value = true
    const params = new URLSearchParams(defineSearchParams())
    const facetParams = new URLSearchParams({ ...Object.fromEntries(params) })

    params.append('first', ((page.value - 1) * preferences.resultsPerPage).toString())
    params.append('max', preferences.resultsPerPage.toString())
    params.append('sort', sortBy.value.trim())
    params.append('max-snippets', preferences.snippetsPerResult.toString())
    params.append('row-padding', '2')

    facets.value = []

    fetchData('search', 'post', params).then(response => response.json().then(result => {
      if (updateHistory) updateUrl()
      hasSearch.value = true, isBusy.value = false, searchResults.value = result.results, totalCount.value = result.totalCount
      images = new Map()
    })).catch(error => {
      console.error(error)
      errorNotificationVisible.value = true, isBusy.value = false
    })

    if (authors.value.length != 1) {
      facetParams.append('field', 'Author')
      facetParams.append('maxBins', '10')
      fetchData('aggregate', 'get', facetParams)
      .then(response => response.json().then(result => facets.value = result.bins))
      .catch(error => console.error(error))
    }
  } else {
    if (updateHistory) updateUrl()
    searchResults.value = [], totalCount.value = 0, images = new Map()
  }
}

const findAuthors = () => {
  if (authorText.value.length > 0) {
    axios
      .get<AggregationBins>(`${API_URL}/authors`, {
        params: {
          prefix: authorText.value,
          maxBins: 10
        },
        headers: {
          accept: 'application/json'
        }
      })
      .then((response) => {
        authorDropdownItems.value = response.data.bins.map((b) => b.label)
      })
  } else {
    authorDropdownItems.value = []
  }
}

const addAuthor = (author: string) => {
  authors.value.push(author)
  authorText.value = ''
  authorDropdownItems.value = []
}

const removeAuthor = (author: string) => {
  const index = authors.value.indexOf(author, 0)
  if (index > -1) {
    authors.value.splice(index, 1)
  }
}

</script>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>