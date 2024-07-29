<template>
  <div>
    <SearchBar v-model:query="query" @search="search" />
    <AdvancedSearch
      @search="search"
      @resetSearchResults="resetSearchResults"
      v-model:showAdvancedSearchPanel="showAdvancedSearchPanel"
      v-model:authorList="authorList"
      v-model:title="title"
      v-model:toYear="toYear"
      v-model:fromYear="fromYear"
      v-model:docRefs="docRefs"
      v-model:sortBy="sortBy"
    />
    <div class="container is-max-desktop hero search-content">
      <HistoryNavigator @resetSearchResults="resetSearchResults" />
      <IndexSize :searchResults="searchResults" />
      <DisplayFacets
        @search="search"
        @resetSearchResults="resetSearchResults"
        :searchResults="searchResults"
        :facets="facets"
      />
      <PageNumbering @search="search" v-model:page="page" v-model:totalHits="totalHits" />
      <DisplayResults
        :searchResults="searchResults"
        v-model:totalHits="totalHits"
        v-model:page="page"
      />
      <PageNumbering @search="search" v-model:page="page" v-model:totalHits="totalHits" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchData, preferences } from '@/assets/fetchMethods'

// Import sub-components
import SearchBar from '@/_components/Search/SearchBar/SearchBar.vue'
import AdvancedSearch from '@/_components/Search/AdvancedSearch/AdvancedSearch.vue'
import IndexSize from '@/components/IndexSize/IndexSize.vue'
import DisplayFacets from '@/_components/DisplayFacets/DisplayFacets.vue'
import PageNumbering from '@/_components/PageNumbering/PageNumbering.vue'
import DisplayResults from '@/_components/Search/DisplayResults/DisplayResults.vue'
import HistoryNavigator from '../HistoryNavigator/HistoryNavigator.vue'
import type { SearchResult, AggregationBin } from '@/assets/interfacesExternals'
import { hasSearch, isBusy } from '@/assets/appState'
import { setErrorMessage } from '@/_components/Modals/ErrorNotification/ErrorNotification.vue'

// Configure icons
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
library.add(
  faMagnifyingGlass,
  faFileImage,
  faSquarePlus,
  faSquareMinus,
  faBookOpen,
  faFileLines,
  faPenToSquare
)

// Startup variables: may move to App.vue or HomeView.vue
const router = useRouter()
const route = useRoute()

const showAdvancedSearchPanel = ref(false)

onMounted(() => {
  router.isReady().then(() => {
    if (route.query['query']) query.value = (route.query['query'] as string).trim()
    if (route.query['strict']) relatedWordForms.value = route.query['strict'] !== 'true'
    if (route.query['page']) page.value = Number(route.query['page'])
    if (route.query['authorInclude']) authorInclude.value = true
    if (route.query['title']) title.value = (route.query['title'] as string).trim()
    if (route.query['from-year'])
      fromYear.value = Number((route.query['from-year'] as string).trim())
    if (route.query['to-year']) toYear.value = Number((route.query['to-year'] as string).trim())
    if (route.query['doc-refs']) docRefs.value = (route.query['doc-refs'] as string).trim()
    if (route.query['sort']) sortBy.value = (route.query['sort'] as string).trim()
    // if (route.query['authors'] && Array.isArray(route.query['authors']))
    //   authors.value = route.query['authors'] as string[]
    // if (route.query['authors'] && !Array.isArray(route.query['authors']))
    //   authors.value = [route.query['authors'] as string]

    showAdvancedSearchPanel.value =
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

    search()
  })
})

const defineSearchParams = () =>
  Object.assign(
    {},
    query.value.length ? { query: query.value.trim() } : null,
    strict.value.toString() !== null ? { strict: strict.value.toString() } : null,
    authorInclude.value ? { 'author-include': authorInclude.value } : null,
    page.value > 0 ? { page: page.value.toString() } : null,
    title.value.trim().length > 0 ? { title: title.value.trim() } : null,
    toYear.value != null && toYear.value > 0 ? { 'to-year': toYear.value.toString() } : null,
    fromYear.value != null && fromYear.value > 0 ? { 'from-year': fromYear.value.toString() } : null
  )

const authorInclude = ref(false)
const authors = ref<Array<string>>([])
const authorList = ref<Array<{ label: string; count: number }>>([])
const searchResults = ref<Array<SearchResult>>([])
const facets = ref<Array<AggregationBin>>([])
const query = ref('')
const relatedWordForms = ref(false)
const page = ref(1)
const totalHits = ref(0)
const title = ref('')
const fromYear = ref(0)
const toYear = ref(0)
const docRefs = ref('')
const sortBy = ref('Score')
const strict = computed(() => !relatedWordForms.value)

const resetSearchResults = () => {
  query.value = ''
  page.value = 1
  title.value = 'Enter a title'
  fromYear.value = 0
  toYear.value = 0
  docRefs.value = ''
  relatedWordForms.value = false
  sortBy.value = 'Score'
  authorList.value = []
  showAdvancedSearchPanel.value = false
  search()
}

const search = (facet: string | undefined = undefined) => {
  if (facet) {
    authorInclude.value = true
    authorList.value.push({ label: facet, count: 0 })
  }

  hasSearch.value =
    query.value.length > 0 ||
    authorList.value.length > 0 ||
    title.value.length > 0 ||
    (fromYear.value != null && fromYear.value > 0) ||
    (toYear.value != null && toYear.value > 0) ||
    docRefs.value.length > 0

  if (hasSearch) {
    isBusy.value = true
    const params = new URLSearchParams(defineSearchParams())
    authorInclude.value = false
    if (authorList.value)
      authorList.value.forEach((author) => params.append('authors', author.label))
    if (docRefs.value)
      docRefs.value.split(/\W+/).forEach((docRef) => params.append('doc-refs', docRef))

    const facetParams = new URLSearchParams({ ...Object.fromEntries(params) })

    params.append('first', ((page.value - 1) * preferences.resultsPerPage).toString())
    params.append('max', preferences.resultsPerPage.toString())
    params.append('sort', sortBy.value.trim())
    params.append('max-snippets', preferences.snippetsPerResult.toString())
    params.append('row-padding', '2')

    facets.value = []
    const url = route.path + '?' + params.toString()
    history.pushState({}, '', url)
    fetchData('search', 'get', params)
      .then((response) =>
        response.json().then(({ results, totalCount }) => {
          authors.value = results
            .map((result: SearchResult) =>
              result.metadata.author !== '' ? result.metadata.author : ''
            )
            .filter((author: string) => author)
          hasSearch.value = true
          isBusy.value = false
          searchResults.value = results
          totalHits.value = totalCount
          if (authors.value.length > 1) {
            facetParams.append('field', 'Author')
            facetParams.append('maxBins', '10')
            fetchData('aggregate', 'get', facetParams)
              .then((response) =>
                response.json().then((result) => {
                  facets.value = result.bins
                  showAdvancedSearchPanel.value = false
                })
              )
              .catch((error) => console.error(error))
          }
        })
      )
      .catch((error) => {
        setErrorMessage(new Error(`Could not reach the search endpoint: ${error.message}`))
        isBusy.value = false
      })
  } else {
    searchResults.value = []
    totalHits.value = 0
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>
