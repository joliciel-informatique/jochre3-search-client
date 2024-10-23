<template>
  <div class="searchBar p-1">
    <SearchBar
      @newSearch="newSearch"
      @resetSearchResults="resetSearchResults"
      v-model:show-advanced-search-panel="showAdvancedSearchPanel"
      v-model:has-advanced-search-criteria="hasAdvancedSearchCriteria"
      v-model:query="query"
      v-model:strict="strict"
      v-model:is-loading="isLoading"
    />
    <AdvancedSearch
      @newSearch="newSearch"
      @resetSearchResults="resetSearchResults"
      v-model:show-advanced-search-panel="showAdvancedSearchPanel"
      v-model:author-list="authorList"
      v-model:title="title"
      v-model:to-year="toYear"
      v-model:from-year="fromYear"
      v-model:doc-refs="docRefs"
      v-model:sort-by="sortBy"
      v-model:facets="facets"
      v-model:exclude-from-search="excludeFromSearch"
    />
    <FooterNavigation
      @newPage="newPage()"
      @resetSearchResults="resetSearchResults()"
      v-model:totalHits="totalHits"
      v-model:page="page"
    />
  </div>
  <div
    class="container is-fluid is-flex-direction-column is-align-items-center has-text-centered p-5"
  >
    <!-- Loading -->
    <div v-if="isLoading">
      <div class="columns">
        <div class="column is-3"></div>
        <div class="column" v-if="isLoading">
          <h1>{{ $t('loading') }}</h1>
        </div>
      </div>
    </div>

    <!-- No results for query -->
    <div v-else-if="query.length && !searchResults?.length">
      <div class="columns">
        <div class="column is-3"></div>
        <div class="column">
          <h1>
            <span class="no-results"> {{ $t('results.none') }}! </span>
            <div class="is-justify-content-center is-align-items-center no-results-image m-6">
              <FontAwesomeIcon class="fa-10x" icon="ban" />
            </div>
          </h1>
        </div>
      </div>
    </div>

    <div v-if="searchResults?.length">
      <div class="columns">
        <div class="column is-3">
          <ContentsTable
            v-model:search-results="searchResults"
            v-model:page="page"
            v-model:image-modal="imageModal"
            v-model:metadata-modal="metadataModal"
            v-model:notification="notification"
            v-model:word-modal="wordModal"
            v-model:selected-entry="firstSearchResult"
            v-model:total-hits="totalHits"
          />
        </div>
        <div class="column mr-6 ml-6" tabindex="-1">
          <div v-if="searchResults?.length">
            <ul>
              <li v-for="result of searchResults" :key="sha1(result)">
                <DisplaySnippets
                  v-model:image-modal="imageModal"
                  v-model:notification="notification"
                  v-model:word-modal="wordModal"
                  v-model:selected-entry="firstSearchResult"
                  :snippets="result.snippets"
                  :doc-ref="result.docRef"
                  :url="result.metadata.url"
                />
              </li>
            </ul>
          </div>
        </div>
        <div class="column is-2">
          <FacetBar
            @newSearch="newSearch"
            @resetSearchResults="resetSearchResults"
            v-model:facets="facets"
          />
        </div>
      </div>
    </div>
    <!-- <IndexSize v-else v-model:is-loading="isLoading" v-model:notification="notification" /> -->
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, defineExpose, type Ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchData } from '@/assets/fetchMethods'
import { sha1 } from 'object-hash'

// Import Child components
import SearchBar from './SearchBar/SearchBar.vue'
import AdvancedSearch from './SearchBar/AdvancedSearch/AdvancedSearch.vue'
import ContentsTable from './SearchResults/ContentsTable/ContentsTable.vue'
import DisplaySnippets from './SearchResults/DisplaySnippets/DisplaySnippets.vue'
import FooterNavigation from '../FooterPage/FooterNavigation/FooterNavigation.vue'
import FacetBar from './SearchResults/FacetBar/FacetBar.vue'
import IndexSize from './SearchResults/IndexSize/IndexSize.vue'

// Import interfaces
import { type SearchResult, type AggregationBin } from '@/assets/interfacesExternals'

import { hasSearch } from '@/assets/appState'

import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

import { storeToRefs } from 'pinia'

const { resultsPerPage, authorFacetCount } = storeToRefs(preferences)

const query = ref('')
const firstSearchResult = ref<SearchResult>()
const searchResults = defineModel<Array<SearchResult>>('searchResults')
const totalHits: Ref = defineModel('totalHits')
const page: Ref = defineModel('page')
const imageModal: Ref = defineModel('imageModal')
const wordModal: Ref = defineModel('wordModal')
const metadataModal: Ref = defineModel('metadataModal')
const notification: Ref = defineModel('notification')

const authorInclude = ref(true)
const excludeFromSearch = ref(false)
const authorList = ref<Array<AggregationBin>>([])

const strict = ref(false)
const isLoading = ref(false)

const title = ref('')
const fromYear = ref()
const toYear = ref()
const docRefs = ref('')
const sortBy = ref('Score')

// Startup variables: may move to App.vue or HomeView.vue
const router = useRouter()
const route = useRoute()

const hasAdvancedSearchCriteria = ref(false)
const showAdvancedSearchPanel = ref(false)
const facets = ref<Array<AggregationBin>>([])

onMounted(() => {
  router.isReady().then(() => {
    if (route.query['query']) query.value = (route.query['query'] as string).trim()
    if (route.query['strict']) strict.value = route.query['strict'] === 'true'
    if (route.query['page']) page.value = Number(route.query['page'])
    if (route.query['authorInclude'])
      authorInclude.value = route.query['authorInclude'] as unknown as boolean
    if (route.query['title']) title.value = (route.query['title'] as string).trim()
    if (route.query['from-year'])
      fromYear.value = Number((route.query['from-year'] as string).trim())
    if (route.query['to-year']) toYear.value = Number((route.query['to-year'] as string).trim())
    if (route.query['doc-refs']) docRefs.value = (route.query['doc-refs'] as string).trim()
    if (route.query['sort']) sortBy.value = (route.query['sort'] as string).trim()
    if (route.query['authors'] && Array.isArray(route.query['authors']))
      authorList.value = (route.query['authors'] as string[]).map((authorName) => {
        return { label: authorName, count: 10, active: false }
      })

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

    newSearch()
  })
})

const newPage = () => {
  runSearch()
}

const newSearch = () => {
  page.value = 1
  runSearch()
}

const runSearch = () => {
  hasAdvancedSearchCriteria.value = false
  search().then((res) => {
    isLoading.value = res ? true : false
    const searchBar = document.querySelector('.searchBar') as HTMLDivElement
    if (searchBar !== null && searchResults.value?.length) {
      window.onscroll = () => {
        window.scrollY < searchBar.offsetTop
          ? searchBar.classList.add('stickySearchBarDocked')
          : searchBar.classList.remove('stickySearchBarUndocked')
      }
    }
  })
}

const defineSearchParams = () => {
  return Object.assign(
    {},
    query.value?.length ? { query: query.value.trim() } : null,
    strict.value.toString() !== null ? { strict: strict.value.toString() } : null,
    page.value && page.value > 0 ? { page: page.value?.toString() } : null,
    title.value.trim().length > 0 ? { title: title.value.trim() } : null,
    toYear.value != null && toYear.value > 0 ? { 'to-year': toYear.value.toString() } : null,
    fromYear.value != null && fromYear.value > 0 ? { 'from-year': fromYear.value.toString() } : null
  )
}

const params = ref(defineSearchParams())

const resetSearchResults = () => {
  query.value = ''
  isLoading.value = false
  hasSearch.value = false
  facets.value = []
  searchResults.value = []
  totalHits.value = 0

  page.value = 1
  title.value = ''
  fromYear.value = null
  toYear.value = null
  docRefs.value = ''
  strict.value = false
  sortBy.value = 'Score'
  authorList.value = []
  hasAdvancedSearchCriteria.value = false
  showAdvancedSearchPanel.value = false

  window.history.replaceState({}, document.title, '/')
}

watch(excludeFromSearch, () => (authorInclude.value = !excludeFromSearch.value))
watch(resultsPerPage, () => search())
watch(authorFacetCount, () => searchFacets())

const searchFacets = async () => {
  const facetParams = new URLSearchParams({ ...Object.fromEntries(params.value) })
  facetParams.append('field', 'Author')
  if (preferences.authorFacetCount > 0)
    facetParams.append('maxBins', preferences.authorFacetCount.toString())
  return fetchData('aggregate', 'get', facetParams).then((response) =>
    response.json().then((result) => {
      const activeFacets = facets.value
        .map((facet) => (facet.active ? facet.label : null))
        .filter((facet) => facet)

      facets.value = result.bins.map((facet: { label: string; count: number }) =>
        activeFacets.includes(facet.label)
          ? { ...facet, active: true }
          : { ...facet, active: false }
      )
    })
  )
}

const search = async () => {
  isLoading.value = true

  const activeFacets = facets.value.filter((facet) => facet.active).map((facet) => facet.label)
  const hasActiveFacets = activeFacets.length > 0

  const authorsToSearch = activeFacets.length
    ? activeFacets
    : authorList.value.map((author) => author.label)

  // Ignore author include if there are any active facets, or if there are no selected authors
  const addAuthorInclude = activeFacets.length == 0 && authorsToSearch.length > 0

  hasSearch.value =
    (query.value ? query.value.length > 0 : null) ||
    authorsToSearch.length > 0 ||
    title.value.length > 0 ||
    (fromYear.value != null && fromYear.value > 0) ||
    (toYear.value != null && toYear.value > 0) ||
    docRefs.value.length > 0

  hasAdvancedSearchCriteria.value =
    authorList.value.length > 0 ||
    title.value.length > 0 ||
    (fromYear.value != null && fromYear.value > 0) ||
    (toYear.value != null && toYear.value > 0) ||
    docRefs.value.length > 0 ||
    (sortBy.value.length > 0 && sortBy.value != 'Score')

  showAdvancedSearchPanel.value = false

  if (!hasSearch.value) {
    return
  }

  const searchParams = new URLSearchParams(defineSearchParams())

  authorsToSearch.forEach((author) => searchParams.append('authors', author))
  if (addAuthorInclude) searchParams.append('author-include', authorInclude.value.toString())
  if (docRefs.value)
    docRefs.value.split(/\W+/).forEach((docRef) => searchParams.append('doc-refs', docRef))

  // const facetParams = new URLSearchParams({ ...Object.fromEntries(params) })

  searchParams.append(
    'first',
    page.value ? ((page.value - 1) * resultsPerPage.value).toString() : '10'
  )
  searchParams.append('max', resultsPerPage.value.toString())
  searchParams.append('sort', sortBy.value.trim())
  searchParams.append('max-snippets', preferences.snippetsPerResult.toString())
  searchParams.append('row-padding', '2')
  searchParams.append('physical-newlines', 'false')

  if (!hasActiveFacets) {
    const urlParams = new URLSearchParams({ ...Object.fromEntries(searchParams) })
    urlParams.delete('authors')
    urlParams.delete('author-include')
    authorList.value.forEach((author) => urlParams.append('authors', author.label))
    urlParams.append('author-include', authorInclude.value.toString())

    const url = route.path + '?' + urlParams.toString()
    history.pushState({}, '', url)
  }

  const q: HTMLElement | null = document.getElementById('query')
  isLoading.value
    ? q?.parentElement?.classList.add('is-loading')
    : q?.parentElement?.classList.remove('is-loading')
  isLoading.value ? q?.setAttribute('disabled', 'disabled') : q?.removeAttribute('disabled')

  params.value = searchParams

  return fetchData('search', 'get', searchParams)
    .then((response) =>
      response.json().then(({ results, totalCount }) => {
        hasSearch.value = true
        isLoading.value = false
        searchResults.value = results
        firstSearchResult.value = results[0]
        totalHits.value = totalCount
        if (!hasActiveFacets) {
          searchFacets()
            .then((results) => {
              q?.parentElement?.classList.remove('is-loading')
              q?.removeAttribute('disabled')
              return false
            })
            // facetParams.append('field', 'Author')
            // facetParams.append('maxBins', preferences.authorFacetCount.toString())
            //  return fetchData('aggregate', 'get', facetParams)
            //   .then((response) =>
            //     response.json().then((result) => {
            //       const activeFacets = facets.value
            //         .map((facet) => (facet.active ? facet.label : null))
            //         .filter((facet) => facet)

            //       facets.value = result.bins.map((facet: { label: string; count: number }) =>
            //         activeFacets.includes(facet.label)
            //           ? { ...facet, active: true }
            //           : { ...facet, active: false }
            //       )

            // q?.parentElement?.classList.remove('is-loading')
            // q?.removeAttribute('disabled')
            // return false
            // })
            // )
            .catch((error) => {
              notification.value = {
                show: true,
                error: true,
                delay: 4000,
                msg: `Error: ${error}`
              }
            })
        } else {
          q?.parentElement?.classList.remove('is-loading')
          q?.removeAttribute('disabled')
          isLoading.value = false
          return false
        }
      })
    )
    .catch((error) => {
      notification.value = {
        show: true,
        error: true,
        delay: 4000,
        msg: `Error: ${error}`
      }
      isLoading.value = false
      hasSearch.value = true
      q?.parentElement?.classList.remove('is-loading')
      q?.removeAttribute('disabled')
    })
}

defineExpose({
  newSearch,
  newPage,
  resetSearchResults
})
</script>
