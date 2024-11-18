<template>
  <header
    id="topbar"
    class="is-flex is-flex-direction-column-reverse"
    :class="{
      'rtl-align': !preferences.displayLeftToRight
    }"
  >
    <nav class="is-flex is-flex-direction-column navbar" id="navbar" role="navigation">
      <div class="navbar-brand is-flex is-flex-direction-row is-justify-content-space-between">
        <div class="navbar-item is-flex is-flex-direction-row is-flex-grow-5 is-flex-shrink-1">
          <SearchBar
            @newSearch="newSearch"
            @resetSearchResults="resetSearchResults"
            v-model:show-advanced-search-panel="showAdvancedSearchPanel"
            v-model:has-advanced-search-criteria="hasAdvancedSearchCriteria"
            v-model:query="query"
            v-model:strict="strict"
            v-model:is-loading="isLoading"
          />
        </div>
        <UserOptions
          v-model:show-advanced-search-panel="showAdvancedSearchPanel"
          v-model:open-nav-bar-mobile-menu="openNavBarMobileMenu"
        />
        <!-- <div class="navbar-item is-align-self-flex-start user-options is-hidden-touch">
        </div> -->
        <div
          class="navbar-burger is-flex is-flex-grow-1 has-text-white is-hidden-desktop"
          :class="openNavBarMobileMenu ? 'is-active' : ''"
          role="button"
          aria-label="menu"
          aria-expanded="false"
          @click="openNavBarMobileMenu = !openNavBarMobileMenu"
        >
          <div>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </div>
        </div>
        <!-- <div v-show="openNavBarMobileMenu" class="navbar-mobile" id="navbar-mobile">
          <div class="menu is-pulled-right panel">
            <UserOptions
              v-model:show-advanced-search-panel="showAdvancedSearchPanel"
              v-model:open-nav-bar-mobile-menu="openNavBarMobileMenu"
            />
          </div>
        </div> -->
      </div>
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
      <div class="is-hidden-touch">
        <PageNumbering @newPage="newPage()" v-model:totalHits="totalHits" v-model:page="page" />
      </div>
      <div class="is-hidden-desktop">
        <ContentsTable
          v-model:search-results="searchResults"
          v-model:page="page"
          v-model:image-modal="imageModal"
          v-model:metadata-modal="metadataModal"
          v-model:notification="notification"
          v-model:word-modal="wordModal"
          v-model:selected-entry="firstSearchResult"
          v-model:total-hits="totalHits"
          v-model:open-mobile-search-results-toc="openMobileSearchResultsToc"
          v-model:open-mobile-metadata-panel="openMobileMetadataPanel"
          v-model:open-mobile-facets="openMobileFacets"
          v-model:facets="facets"
          @new-page="newPage"
          @reset-search-results="resetSearchResults"
          @new-search="newSearch"
        />
      </div>
    </nav>
    <HeaderPage />
  </header>
  <main :class="preferences.displayLeftToRight ? '' : 'rtl-align'">
    <!-- Contents table on desktop -->
    <div
      v-if="query.length && searchResults?.length"
      class="is-flex is-flex-direction-row is-justify-content-space-between"
    >
      <div class="is-hidden-touch">
        <ContentsTable
          v-model:search-results="searchResults"
          v-model:page="page"
          v-model:image-modal="imageModal"
          v-model:metadata-modal="metadataModal"
          v-model:notification="notification"
          v-model:word-modal="wordModal"
          v-model:selected-entry="firstSearchResult"
          v-model:total-hits="totalHits"
          v-model:open-mobile-search-results-toc="openMobileSearchResultsToc"
          v-model:open-mobile-metadata-panel="openMobileMetadataPanel"
          v-model:open-mobile-facets="openMobileFacets"
          v-model:facets="facets"
          @new-page="newPage"
          @reset-search-results="resetSearchResults"
          @new-search="newSearch"
        />
      </div>
      <!-- Not loading, has query and results -->
      <DisplaySnippets
        v-model:image-modal="imageModal"
        v-model:notification="notification"
        v-model:word-modal="wordModal"
        v-model:selected-entry="firstSearchResult"
        v-model:search-results="searchResults"
        v-model:is-loading="isLoading"
        v-model:query="query"
        v-model:strict="strict"
      />
      <div class="is-hidden-touch">
        <FacetBar
          @newSearch="newSearch"
          v-model:facets="facets"
          v-model:open-mobile-facets="openMobileFacets"
        />
      </div>
    </div>
    <div
      v-else-if="isLoading && query && !searchResults?.length"
      class="is-flex is-flex-direction-column has-text-centered pt-5"
    >
      <!-- Loading with query, but no results -->
      <h1>{{ $t('loading') }}</h1>
    </div>

    <!-- Not loading, with query, but no results -->
    <div v-else-if="query.length && !isLoading && !searchResults?.length">
      <h1 class="column">
        <span class="no-results"> {{ $t('results.none') }}! </span>
        <div class="is-justify-content-center is-align-items-center no-results-image m-6">
          <font-awesome-icon class="fa-10x" icon="ban" />
        </div>
      </h1>
    </div>

    <!-- Not loading, no query, no results -->
    <IndexSize
      v-else
      v-model:is-loading="isLoading"
      v-model:notification="notification"
      v-model:total-hits="totalHits"
    />
  </main>
  <footer
    id="footer"
    v-show="!searchResults?.length"
    class="footer has-text-white mt-auto pt-5 p-2"
    :class="{
      'rtl-align': !preferences.displayLeftToRight
    }"
  >
    <FooterPage v-model:total-hits="totalHits" />
  </footer>
</template>
<script setup lang="ts">
import { onMounted, ref, defineExpose, type Ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchData } from '../../assets/fetchMethods'

// Import Child components
import SearchBar from './SearchBar/SearchBar.vue'
import AdvancedSearch from './SearchBar/AdvancedSearch/AdvancedSearch.vue'
import ContentsTable from './SearchResults/ContentsTable/ContentsTable.vue'
import DisplaySnippets from './SearchResults/DisplaySnippets/DisplaySnippets.vue'
import PageNumbering from './SearchBar/Navigation/PageNumbering/PageNumbering.vue'
import FacetBar from './SearchResults/FacetBar/FacetBar.vue'
import IndexSize from './SearchResults/IndexSize/IndexSize.vue'
import HeaderPage from '../HeaderPage/HeaderPage.vue'
import UserOptions from './UserOptions/UserOptions.vue'
import FooterPage from '../FooterPage/FooterPage.vue'

// Import interfaces
import { type SearchResult, type AggregationBin } from '../../assets/interfacesExternals'

// This is better kept in Pinia or something similar
import { hasSearch } from '../../assets/appState'

import { usePreferencesStore } from '../../stores/PreferencesStore'

const preferences = usePreferencesStore()

const { show, isTablet, isMobile, isPortrait } = storeToRefs(preferences)

import { storeToRefs } from 'pinia'

const { authorFacetCount } = storeToRefs(preferences)

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
const resultsPerPage = ref(10)

// Startup variables: may move to App.vue or HomeView.vue
const router = useRouter()
const route = useRoute()

const hasAdvancedSearchCriteria = ref(false)
const showAdvancedSearchPanel = ref(false)
const openMobileSearchResultsToc = ref(false)
const openMobileMetadataPanel = ref(false)
const openMobileFacets = ref(false)
const openNavBarMobileMenu = ref(false)

const facets = ref<Array<AggregationBin>>([])

onMounted(() => {
  window.addEventListener('click', (e: MouseEvent | TouchEvent) => {
    if (openNavBarMobileMenu.value) {
      const navbarMobile = document.getElementById('navbar-mobile')
      const navbarMobileBtn = document.getElementsByClassName('navbar-burger')[0]
      if (
        e.target instanceof Element &&
        !navbarMobile?.contains(e.target) &&
        !navbarMobileBtn?.contains(e.target)
      )
        openNavBarMobileMenu.value = false
    }
  })

  window.addEventListener('click', (e: MouseEvent | TouchEvent) => {
    const navbarMobileMenu = document.getElementById('navbar-mobile')
    const navbarAdvancedSearchBtn = document.getElementById('advancedSearchBtn')
    if (showAdvancedSearchPanel.value) {
      const advancedSearchPanel = document.getElementById('advancedSearchPanel')
      if (
        e.target instanceof Element &&
        !navbarAdvancedSearchBtn?.contains(e.target) &&
        !navbarMobileMenu?.contains(e.target) &&
        !advancedSearchPanel?.contains(e.target)
      ) {
        showAdvancedSearchPanel.value = false
      }
    }
  })

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

    newSearch()
  })
})

const newPage = () => runSearch()
const newSearch = () => (page.value = 1) && runSearch()

const runSearch = () => {
  hasAdvancedSearchCriteria.value = false
  search().then((res) => {
    isLoading.value = res ? true : false
    // positionSnippets()
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

watch(searchResults, (newV) => {
  const header = document.getElementById('header')
  const navbar = document.getElementById('navbar')
  if (newV?.length) {
    header?.setAttribute('style', 'display:none')
    //     // navbar?.classList.add('is-fixed-top')
  } else {
    header?.setAttribute('style', 'display:flex')
    //     // navbar?.classList.remove('is-fixed-top')
  }
})

watch(excludeFromSearch, () => (authorInclude.value = !excludeFromSearch.value))
watch(resultsPerPage, () => search())
watch(authorFacetCount, () => searchFacets())

// Close all other panels on Mobile
watch(showAdvancedSearchPanel, (newV) => {
  if (newV) {
    openMobileSearchResultsToc.value = false
    openMobileMetadataPanel.value = false
    openMobileFacets.value = false
    openNavBarMobileMenu.value = false
    preferences.show = false
  }
})

watch(openMobileSearchResultsToc, (newV) => {
  if (newV) {
    showAdvancedSearchPanel.value = false
    openMobileMetadataPanel.value = false
    openMobileFacets.value = false
    openNavBarMobileMenu.value = false
    preferences.show = false
  }
})
watch(openMobileMetadataPanel, (newV) => {
  if (newV) {
    showAdvancedSearchPanel.value = false
    openMobileSearchResultsToc.value = false
    openMobileFacets.value = false
    openNavBarMobileMenu.value = false
    preferences.show = false
  }
})
watch(openNavBarMobileMenu, (newV) => {
  if (newV) {
    showAdvancedSearchPanel.value = false
    openMobileSearchResultsToc.value = false
    openMobileMetadataPanel.value = false
    openMobileFacets.value = false
    preferences.show = false
  }
})

watch(show, (newV) => {
  if (newV) {
    showAdvancedSearchPanel.value = false
    openMobileSearchResultsToc.value = false
    openMobileMetadataPanel.value = false
    openMobileFacets.value = false
    openNavBarMobileMenu.value = false
  }
})

watch(openMobileFacets, (newV) => {
  if (newV) {
    showAdvancedSearchPanel.value = false
    openMobileSearchResultsToc.value = false
    openMobileMetadataPanel.value = false
    openNavBarMobileMenu.value = false
    preferences.show = false
  }
})

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

  if (!hasSearch.value) return

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
  searchParams.append('max-snippets', '10')
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
        if (results && results.length) {
          searchResults.value = results
          firstSearchResult.value = results[0]
          totalHits.value = totalCount
        }
        if (!hasActiveFacets) {
          searchFacets()
            .then((results) => {
              q?.parentElement?.classList.remove('is-loading')
              q?.removeAttribute('disabled')
              return false
            })
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
