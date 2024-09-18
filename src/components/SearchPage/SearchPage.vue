<template>
  <div class="searchBar p-1">
    <SearchBar
      @newSearch="newSearch"
      @resetSearchResults="resetSearchResults"
      @setShowAdvancedSearchPanel="setShowAdvancedSearchPanel"
      v-model:show-advanced-search-panel="showAdvancedSearchPanel"
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
    <FacetBar
      @newSearch="newSearch"
      @resetSearchResults="resetSearchResults"
      v-model:is-loading="isLoading"
      v-model:facets="facets"
    />
  </div>
  <div
    class="container is-max-desktop is-flex-direction-column is-align-items-center has-text-centered p-5"
  >
    <DisplayResults
      v-model:is-loading="isLoading"
      v-model:image-modal="imageModal"
      v-model:word-modal="wordModal"
      v-model:metadata-modal="metadataModal"
      v-model:notification="notification"
      v-model:query="query"
      v-model:search-results="searchResults"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, defineExpose, type Ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchData, preferences } from '@/assets/fetchMethods'

// Import Child components
import SearchBar from './SearchBar/SearchBar.vue'
import AdvancedSearch from './SearchBar/AdvancedSearch/AdvancedSearch.vue'
import FacetBar from './SearchBar/FacetBar/FacetBar.vue'
import DisplayResults from './SearchResults/DisplayResults/DisplayResults.vue'

// Import interfaces
import type { SearchResult, AggregationBin } from '@/assets/interfacesExternals'

import { hasSearch } from '@/assets/appState'

const query = ref('')
const searchResults: Ref = defineModel('searchResults')
const totalHits: Ref = defineModel('totalHits')
const page: Ref = defineModel('page')
const imageModal: Ref = defineModel('imageModal')
const wordModal: Ref = defineModel('wordModal')
const metadataModal: Ref = defineModel('metadataModal')
const notification: Ref = defineModel('notification')

const authorInclude = ref(false)
const excludeFromSearch = ref(false)
const authors = ref<Array<string>>([])
const authorList = ref<Array<{ label: string; count: number; active: boolean }>>([])

const strict = ref(false)
const isLoading = ref(false)

const title = ref('')
const fromYear = ref(0)
const toYear = ref(0)
const docRefs = ref('')
const sortBy = ref('Score')

// import { useStateStore } from '@/stores/StateStore'
// import { storeToRefs } from 'pinia'

// Startup variables: may move to App.vue or HomeView.vue
const router = useRouter()
const route = useRoute()

const showAdvancedSearchPanel = ref(false)
const facets = ref<Array<AggregationBin>>([])
// Hack: clear the authorList in case facets are selected
// TODO: rethink structure of facets vs. authorList
watch(facets, () => {
  const activeFacets = facets.value.filter((facet) => (facet.active ? true : null)).length
  if (activeFacets) {
    authorList.value = []
  }
})

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
      authors.value = route.query['authors'] as string[]

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

    newSearch()
  })
})

const newSearch = (facet: string | undefined = undefined) => {
  search(facet).then((res) => {
    isLoading.value = res ? true : false
    const searchBar = document.querySelector('.searchBar') as HTMLDivElement
    if (searchBar !== null && searchResults.value.length) {
      window.onscroll = () => {
        window.scrollY < searchBar.offsetTop
          ? searchBar.classList.add('stickySearchBarDocked')
          : searchBar.classList.remove('stickySearchBarUndocked')
        const newSearchResults = document.querySelectorAll(
          '.card.metadata'
        ) as NodeListOf<HTMLDivElement>
        newSearchResults.forEach((result) => (result.style.top = `${searchBar?.offsetHeight}px`))
      }
      // } else {
      // return
    }
  })
}

const defineSearchParams = () => {
  return Object.assign(
    {},
    query.value?.length ? { query: query.value.trim() } : null,
    strict.value.toString() !== null ? { strict: strict.value.toString() } : null,
    authors.value.length ? { 'author-include': authorInclude.value } : null,
    page.value && page.value > 0 ? { page: page.value?.toString() } : null,
    title.value.trim().length > 0 ? { title: title.value.trim() } : null,
    toYear.value != null && toYear.value > 0 ? { 'to-year': toYear.value.toString() } : null,
    fromYear.value != null && fromYear.value > 0 ? { 'from-year': fromYear.value.toString() } : null
  )
}

const resetSearchResults = () => {
  query.value = ''
  isLoading.value = false
  hasSearch.value = false
  facets.value = []
  searchResults.value = []
  totalHits.value = 0

  page.value = 1
  title.value = ''
  fromYear.value = 0
  toYear.value = 0
  docRefs.value = ''
  strict.value = false
  sortBy.value = 'Score'
  authorList.value = []
  showAdvancedSearchPanel.value = false

  window.history.replaceState({}, document.title, '/')
}

const setShowAdvancedSearchPanel = () => {
  showAdvancedSearchPanel.value = !showAdvancedSearchPanel.value
}

watch(excludeFromSearch, () => {
  console.log(excludeFromSearch.value)
  authorInclude.value = !excludeFromSearch.value
})

const search = async (facet: string | undefined = undefined) => {
  isLoading.value = true

  // TODO: Known bug; currently only one facet is included when clicked
  // The user should be able to select multiple facets
  // The active boolean on each facet in facets.value could be used to indicate which should be included
  if (facet) {
    facets.value = facets.value.map((currentFacet) => {
      if (currentFacet.label == facet) {
        currentFacet.active = currentFacet.active ? false : true
      }
      return currentFacet
    })
    authorInclude.value = facets.value.length ? true : false
  }

  hasSearch.value =
    (query.value ? query.value.length > 0 : null) ||
    facets.value.length > 0 ||
    title.value.length > 0 ||
    (fromYear.value != null && fromYear.value > 0) ||
    (toYear.value != null && toYear.value > 0) ||
    docRefs.value.length > 0

  // if (hasSearch.value) {
  const params = new URLSearchParams(defineSearchParams())
  const facetParams = new URLSearchParams({ ...Object.fromEntries(params) })

  // authorInclude.value = true
  if (facets.value)
    facets.value.forEach((facet) => (facet.active ? params.append('authors', facet.label) : null))
  if (docRefs.value)
    docRefs.value.split(/\W+/).forEach((docRef) => params.append('doc-refs', docRef))

  if (authorList.value) {
    authorList.value.forEach((author) => params.append('authors', author.label))
  }

  params.append(
    'first',
    page.value ? ((page.value - 1) * preferences.resultsPerPage).toString() : '10'
  )
  params.append('max', preferences.resultsPerPage.toString())
  params.append('sort', sortBy.value.trim())
  params.append('max-snippets', preferences.snippetsPerResult.toString())
  params.append('row-padding', '2')

  const url = route.path + '?' + params.toString()
  history.pushState({}, '', url)

  const q: HTMLElement | null = document.getElementById('query')
  isLoading.value
    ? q?.parentElement?.classList.add('is-loading')
    : q?.parentElement?.classList.remove('is-loading')
  isLoading.value ? q?.setAttribute('disabled', 'disabled') : q?.removeAttribute('disabled')

  return fetchData('search', 'get', params)
    .then((response) =>
      response.json().then(({ results, totalCount }) => {
        authors.value = results
          .map((result: SearchResult) =>
            result.metadata.author !== '' ? result.metadata.author : ''
          )
          .filter((author: string) => author)
        hasSearch.value = true
        isLoading.value = false
        searchResults.value = results
        totalHits.value = totalCount
        if (authors.value.length > 0) {
          facetParams.append('field', 'Author')
          facetParams.append('maxBins', '10')
          return fetchData('aggregate', 'get', facetParams)
            .then((response) =>
              response.json().then((result) => {
                const activeFacets = facets.value
                  .map((facet) => (facet.active ? facet.label : null))
                  .filter((facet) => facet)

                facets.value = result.bins.map((facet: { label: string; count: number }) =>
                  activeFacets.includes(facet.label)
                    ? { ...facet, active: true }
                    : { ...facet, active: false }
                )

                showAdvancedSearchPanel.value = false
                q?.parentElement?.classList.remove('is-loading')
                q?.removeAttribute('disabled')
                return false
              })
            )
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
  // } else {
  //   console.log(2)
  //   console.log('Clearing search results')
  //   searchResults.value = []
  //   totalHits.value = 0
  //   return false
  // }
}

defineExpose({
  newSearch,
  resetSearchResults
})
</script>
