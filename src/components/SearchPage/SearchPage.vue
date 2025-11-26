<template>
  <header id="topbar" class="is-flex is-flex-direction-column-reverse">
    <nav class="is-flex is-flex-direction-column navbar" id="navbar" role="navigation">
      <div
        class="is-flex is-flex-direction-column"
        :class="interfaceStyle == 'new' ? 'navbar-brand' : ''"
      >
        <div
          class="navbar-item is-flex is-flex-direction-row is-place-self-stretch is-align-items-center"
        >
          <a
            href="/"
            class="is-flex is-flex-direction-column is-align-self-flex-start is-align-self-flex-stretch"
            v-if="searchResults.length"
          >
            <img :src="$t('header.logo')" :alt="$t('header.title')" :title="$t('header.title')" />
          </a>
          <SearchBar @newSearch="newSearch" @resetSearchResults="resetSearchResults" />
          <UserOptions
            v-if="authenticated"
            v-model:open-nav-bar-mobile-menu="openNavBarMobileMenu"
          />
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
        </div>
        <div class="is-hidden-touch">
          <PageNumbering @newPage="newPage()" />
        </div>
        <div
          class="navbar-item is-flex is-flex-direction-column"
          style="top: 0; overflow-y: auto; max-height: 92vh"
          v-if="showAdvancedSearchPanel"
        >
          <AdvancedSearch
            @newSearch="newSearch"
            @resetSearchResults="resetSearchResults"
            v-model:facets="facets"
          />
        </div>
        <!-- </div> -->
      </div>
      <div class="is-hidden-desktop">
        <ContentsTable
          v-if="hasSearch"
          v-model:open-mobile-search-results-toc="openMobileSearchResultsToc"
          v-model:open-mobile-metadata-panel="openMobileMetadataPanel"
          v-model:open-mobile-facets="openMobileFacets"
          v-model:facets="facets"
          @active-facets-changed="activeFacetsChanged"
          @new-page="newPage"
        />
      </div>
    </nav>
    <HeaderPage />
  </header>
  <main>
    <!-- Contents table on desktop -->

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="search-results is-flex is-flex-direction-column has-text-centered pt-5"
    >
      <h1>{{ $t('results.loading') }}</h1>
      <div class="loader-wrapper is-active mt-5">
        <div class="loader is-loading is-active"></div>
        <font-awesome-icon icon="book-open" color="grey" size="2xl" />
      </div>
    </div>

    <div
      v-else-if="hasSearch && searchResults.length && interfaceStyle == 'new'"
      class="search-results is-flex is-flex-direction-row snippets is-justify-content-center"
    >
      <div class="is-hidden-touch">
        <ContentsTable
          v-model:open-mobile-search-results-toc="openMobileSearchResultsToc"
          v-model:open-mobile-metadata-panel="openMobileMetadataPanel"
          v-model:open-mobile-facets="openMobileFacets"
          v-model:facets="facets"
          @active-facets-changed="activeFacetsChanged"
          @new-page="newPage"
        />
      </div>
      <!-- Not loading, has query and results -->
      <DisplaySnippets />
      <div class="is-hidden-touch">
        <FacetBar
          @active-facets-changed="activeFacetsChanged"
          v-model:facets="facets"
          v-model:open-mobile-facets="openMobileFacets"
        />
      </div>
    </div>
    <div v-else-if="hasSearch && searchResults.length && interfaceStyle == 'old'">
      <div class="is-flex is-flex-direction-row is-flex-wrap-nowrap is-justify-content-center">
        <!-- Not loading, has query and results -->
        <div class="search-results is-flex is-flex-direction-column">
          <h1 class="ml-2 mr-2 mt-2">
            {{ $t('toc.contents-table-subheader', [totalHits, firstResult, lastResult]) }}
          </h1>
          <DisplaySnippets />
        </div>
        <div class="is-hidden-touch">
          <FacetBar
            @active-facets-changed="activeFacetsChanged"
            v-model:facets="facets"
            v-model:open-mobile-facets="openMobileFacets"
          />
        </div>
      </div>

      <PageNumbering @newPage="newPage()" />
    </div>

    <!-- Not loading, with query, but error -->
    <div v-else-if="hasSearch && searchError" class="m-5 has-text-centered">
      <h1
        class="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center has-background-danger"
      >
        <div class="has-text-weight-bold">
          {{ $t('results.error') }} : {{ $t(`errors.${searchError.code}.title`) }}
        </div>
        <div class="is-size-6">
          {{ $t(`errors.${searchError.code}.message`, [searchError.message]) }}
        </div>
      </h1>
      <div class="is-flex is-justify-content-center is-align-items-center no-results-image m-6">
        <font-awesome-icon icon="ban" size="2xl" />
      </div>
    </div>

    <!-- Not loading, with query, but no results -->
    <div v-else-if="hasSearch && !searchResults.length" class="m-5 has-text-centered">
      <h1
        class="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
      >
        <span class="no-results"> {{ $t('results.none') }}! </span>
        <div class="is-flex is-justify-content-center is-align-items-center no-results-image m-6">
          <font-awesome-icon icon="ban" size="2xl" />
        </div>
      </h1>
    </div>

    <!-- Not loading, no search, no results -->
    <IndexSize v-else />
  </main>
  <footer
    id="footer"
    v-show="!searchResults?.length"
    class="footer has-text-white mt-auto pt-5 p-2"
    :class="{
      'rtl-align': !preferences.displayLeftToRight
    }"
  >
    <FooterPage />
  </footer>
</template>
<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, type Ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authenticated, fetchData } from '@/assets/fetchMethods'

// Import Child components
import PageNumbering from '@/components/SearchPage/SearchBar/Navigation/PageNumbering/PageNumbering.vue'
import DisplaySnippets from '@/components/SearchPage/SearchResults/DisplaySnippets/DisplaySnippets.vue'
import FacetBar from '@/components/SearchPage/SearchResults/FacetBar/FacetBar.vue'
import ContentsTable from '@/components/SearchPage/SearchResults/ContentsTable/ContentsTable.vue'

const SearchBar = defineAsyncComponent(
  () => import('@/components/SearchPage/SearchBar/SearchBar.vue')
)

const AdvancedSearch = defineAsyncComponent(
  () => import('@/components/SearchPage/SearchBar/AdvancedSearch/AdvancedSearch.vue')
)

const IndexSize = defineAsyncComponent(
  () => import('@/components/SearchPage/SearchResults/IndexSize/IndexSize.vue')
)
const HeaderPage = defineAsyncComponent(() => import('@/components/HeaderPage/HeaderPage.vue'))
const FooterPage = defineAsyncComponent(() => import('@/components/FooterPage/FooterPage.vue'))
const UserOptions = defineAsyncComponent(
  () => import('@/components/SearchPage/UserOptions/UserOptions.vue')
)

// Import interfaces
import { type AggregationBin, type SearchError } from '@/assets/interfacesExternals'

// This is better kept in Pinia or something similar
import { hasSearch } from '@/assets/appState'

import { usePreferencesStore } from '@/stores/PreferencesStore'
import { useSearchStore } from '@/stores/SearchStore'
import { useModalStore } from '@/stores/ModalStore'
import { storeToRefs } from 'pinia'

const searchStore = useSearchStore()
const {
  query,
  strict,
  title,
  fromYear,
  toYear,
  docRefs,
  sortBy,
  includeAuthors,
  authorList,
  isLoading,
  page,
  searchResults,
  totalHits,
  firstResult,
  lastResult,
  selectedEntryIdx,
  hasAdvancedSearchCriteria,
  showAdvancedSearchPanel
} = storeToRefs(searchStore)
const preferences = usePreferencesStore()

const { initializeMedia } = preferences

const { interfaceStyle, authorFacetCount } = storeToRefs(preferences)

const searchError = ref<SearchError | null>()

const modalStore = useModalStore()
const { notification, showPreferencesModal } = storeToRefs(modalStore)

const resultsPerPage = ref(10)

// Startup variables: may move to App.vue or HomeView.vue
const router = useRouter()
const route = useRoute()

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
      const dropdownList = document.getElementById('advanced-search-authors-author-dropdown-list')
      const dropdownContent = document.getElementById('advanced-search-authors-author-tags')
      const dropdownItems = Array.from(document.querySelectorAll('.filterTag'))
      if (
        e.target instanceof Element &&
        !navbarAdvancedSearchBtn?.contains(e.target) &&
        !navbarMobileMenu?.contains(e.target) &&
        !advancedSearchPanel?.contains(e.target) &&
        !dropdownList?.contains(e.target) &&
        !dropdownContent?.contains(e.target) &&
        dropdownItems.every((tag: Element) =>
          document.getElementById((tag as HTMLElement).id)?.contains(e.target as Element)
        )
      ) {
        console.log('clicking not inside areas', e.target)
        showAdvancedSearchPanel.value = false
      }
    }
  })

  initializeMedia()

  router.isReady().then(() => {
    if (route.query['query']) query.value = (route.query['query'] as string).trim()
    if (route.query['strict']) strict.value = route.query['strict'] === 'true'
    if (route.query['page']) page.value = Number(route.query['page'])
    if (route.query['author-include']) {
      includeAuthors.value = route.query['author-include'] as unknown as boolean
    } else {
      includeAuthors.value = true
    }
    if (route.query['title']) title.value = (route.query['title'] as string).trim()
    if (route.query['from-year'])
      fromYear.value = Number((route.query['from-year'] as string).trim())
    if (route.query['to-year']) toYear.value = Number((route.query['to-year'] as string).trim())
    if (route.query['doc-refs']) {
      if (Array.isArray(route.query['doc-refs'])) {
        docRefs.value = (route.query['doc-refs'] as string[]).join(', ')
      } else {
        docRefs.value = (route.query['doc-refs'] as string).trim()
      }
    }
    if (route.query['sort']) sortBy.value = (route.query['sort'] as string).trim()
    if (route.query['authors']) {
      if (Array.isArray(route.query['authors'])) {
        authorList.value = (route.query['authors'] as string[]).map((authorName) => {
          return { label: authorName, count: 10, active: false }
        })
      } else {
        authorList.value = [
          { label: (route.query['authors'] as string).trim(), count: 10, active: false }
        ]
      }
    }

    runSearch(false)

    if (route.query['show-advanced']) {
      showAdvancedSearchPanel.value = route.query['show-advanced'] === 'true'
    }
  })
})

const newPage = () => runSearch()
const newSearch = () => {
  //notification.value = { error: false, delay: 4000, msg: 'Running search...' }
  clearSearchResults()
  runSearch()
}
const activeFacetsChanged = () => {
  runSearch()
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

const clearSearchResults = () => {
  facets.value = []
  searchResults.value = []
  totalHits.value = 0

  page.value = 1
}

const resetSearchResults = () => {
  clearSearchResults()
  query.value = ''
  isLoading.value = false
  hasSearch.value = false

  title.value = ''
  fromYear.value = null
  toYear.value = null
  docRefs.value = ''
  strict.value = false
  sortBy.value = 'Score'
  authorList.value = []
  hasAdvancedSearchCriteria.value = false
  showAdvancedSearchPanel.value = false

  history.pushState({}, document.title, '/')
}

watch(searchResults, (newV) => {
  const header = document.getElementById('header')
  if (newV?.length) {
    header?.setAttribute('style', 'display:none')
  } else {
    header?.setAttribute('style', 'display:flex')
  }
})

watch(resultsPerPage, () => runSearch(false))
watch(authorFacetCount, () => searchFacets())

// Close all other panels on Mobile
watch(showAdvancedSearchPanel, (newV) => {
  if (newV) {
    openMobileSearchResultsToc.value = false
    openMobileMetadataPanel.value = false
    openMobileFacets.value = false
    openNavBarMobileMenu.value = false
    showPreferencesModal.value = false
  }
})

watch(openMobileSearchResultsToc, (newV) => {
  if (newV) {
    showAdvancedSearchPanel.value = false
    openMobileMetadataPanel.value = false
    openMobileFacets.value = false
    openNavBarMobileMenu.value = false
    showPreferencesModal.value = false
  }
})
watch(openMobileMetadataPanel, (newV) => {
  if (newV) {
    showAdvancedSearchPanel.value = false
    openMobileSearchResultsToc.value = false
    openMobileFacets.value = false
    openNavBarMobileMenu.value = false
    showPreferencesModal.value = false
  }
})
watch(openNavBarMobileMenu, (newV) => {
  if (newV) {
    showAdvancedSearchPanel.value = false
    openMobileSearchResultsToc.value = false
    openMobileMetadataPanel.value = false
    openMobileFacets.value = false
    showPreferencesModal.value = false
  }
})

watch(showPreferencesModal, (newV) => {
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
    showPreferencesModal.value = false
  }
})

const searchFacets = async () => {
  const facetParams = new URLSearchParams(params.value.toString())
  facetParams.append('field', 'Author')
  if (preferences.authorFacetCount > 0)
    facetParams.append('maxBins', preferences.authorFacetCount.toString())

  const url = authenticated ? 'aggregate' : 'aggregate-no-auth'
  return fetchData(url, 'get', facetParams).then((response) =>
    response.json().then((result) => {
      console.log(`Found ${result.bins.length} author facets`)
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

const runSearch = async (addHistory: boolean = true) => {
  isLoading.value = true
  searchError.value = null

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
    isLoading.value = false
    return
  }

  const searchParams = new URLSearchParams(defineSearchParams())

  authorsToSearch.forEach((author) => searchParams.append('authors', author))
  if (addAuthorInclude) searchParams.append('author-include', includeAuthors.value.toString())
  if (docRefs.value)
    docRefs.value.split(/\W+/).forEach((docRef) => searchParams.append('doc-refs', docRef))

  searchParams.append(
    'first',
    page.value ? ((page.value - 1) * resultsPerPage.value).toString() : '10'
  )
  searchParams.append('max', resultsPerPage.value.toString())
  searchParams.append('sort', sortBy.value.trim())
  searchParams.append('max-snippets', '10')
  searchParams.append('row-padding', '2')
  searchParams.append('physical-newlines', 'false')

  if (!hasActiveFacets && addHistory) {
    const urlParams = new URLSearchParams({ ...Object.fromEntries(searchParams) })
    urlParams.delete('authors')
    urlParams.delete('author-include')
    authorList.value.forEach((author) => urlParams.append('authors', author.label))
    urlParams.append('author-include', includeAuthors.value.toString())

    urlParams.delete('doc-refs')
    if (docRefs.value)
      docRefs.value.split(/\W+/).forEach((docRef) => urlParams.append('doc-refs', docRef))

    const url = route.path + '?' + urlParams.toString()
    history.pushState({}, '', url)
  }

  const q: HTMLElement | null = document.getElementById('query')
  isLoading.value
    ? q?.parentElement?.classList.add('is-loading')
    : q?.parentElement?.classList.remove('is-loading')
  isLoading.value ? q?.setAttribute('disabled', 'disabled') : q?.removeAttribute('disabled')

  params.value = searchParams

  const searchUrl = authenticated ? 'search' : 'search-no-auth'
  return fetchData(searchUrl, 'get', searchParams)
    .then((response) => {
      if (response.status === 200) {
        return response.json().then(({ results, totalCount }) => {
          console.log(`Found ${totalCount} results`)

          q?.parentElement?.classList.remove('is-loading')
          q?.removeAttribute('disabled')
          isLoading.value = false

          if (results && results.length) {
            console.log(`Setting ${totalCount} results`)
            searchResults.value = results
            selectedEntryIdx.value = 0
            // selectedEntry.value = results[selectedEntryIdx.value]
            totalHits.value = totalCount

            if (!hasActiveFacets) {
              searchFacets()
                .then((results) => {
                  q?.parentElement?.classList.remove('is-loading')
                  q?.removeAttribute('disabled')
                  isLoading.value = false
                  return false
                })
                .catch((error) => {
                  console.error(`Error fetching facets: ${error}`)
                  notification.value = {
                    error: true,
                    delay: 4000,
                    msg: `Error: ${error}`
                  }
                })
            }
          } else {
            console.log(`No results found, clearing`)
            clearSearchResults()
          }
          return true
        })
      } else if (response.status === 400) {
        return response.json().then((error: SearchError) => {
          console.error(`Bad request ${response.status}: ${error.code} - ${error.message}`)
          searchError.value = error
          clearSearchResults()
          q?.parentElement?.classList.remove('is-loading')
          q?.removeAttribute('disabled')
          isLoading.value = false
          return false
        })
      } else if (response.status === 503) {
        // Forbidden, typically caused by Cloudfare requiring a new challenge
        console.error(`503 Forbidden response`)
        searchError.value = {
          code: 'Forbidden',
          message: 'Your login has expired, please refresh the page'
        }
        clearSearchResults()
        q?.parentElement?.classList.remove('is-loading')
        q?.removeAttribute('disabled')
        isLoading.value = false
        return false
      } else {
        return response.json().then((json) => {
          const error = 'message' in json ? json['message'] : 'An unexpected error occurred'
          console.error(`Response status ${response.status}: ${error}`)
          clearSearchResults()
          notification.value = {
            error: true,
            delay: 4000,
            msg: `Error: ${error}`
          }
          q?.parentElement?.classList.remove('is-loading')
          q?.removeAttribute('disabled')
          isLoading.value = false
          return false
        })
      }
    })
    .catch((error) => {
      console.error(`Error running search: ${error}`)
      clearSearchResults()
      notification.value = {
        error: true,
        delay: 4000,
        msg: `Error: ${error}`
      }
      q?.parentElement?.classList.remove('is-loading')
      q?.removeAttribute('disabled')
      isLoading.value = false
      return false
    })
}

// defineExpose({
//   newSearch,
//   newPage,
//   resetSearchResults
// })
</script>
