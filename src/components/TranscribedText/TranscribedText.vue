<template>
  <div v-if="book" class="transcribed-text panel">
    <div
      class="panel-heading is-flex is-justify-content-space-between m-2"
      :class="
        (isMobile && !isTablet) || (!isMobile && isTablet)
          ? 'is-flex-direction-column is-align-items-end'
          : 'is-flex-direction-row is-align-items-center '
      "
      id="panel-heading"
    >
      <h1
        class="book-title"
        :class="{
          'rtl-align': preferences.needsRightToLeft
        }"
      >
        <span>{{ book.title }}</span>
      </h1>
      <div
        class="is-flex"
        :class="
          (isMobile && !isTablet) || (!isMobile && isTablet)
            ? 'is-flex-direction-column is-align-items-end'
            : 'is-flex-direction-row is-align-items-center'
        "
      >
        <span class="is-size-6 p-2">
          {{ $t('navigation.currently-viewing-pages', [pageRangeInView, book.pages.length]) }}
        </span>
        <div class="is-flex is-size-6 is-flex-direction-row pb-0 mb-0 field has-addons">
          <p class="control">
            <a class="button is-size-6 p-2 is-static">{{ $t('navigation.jump-to') }}</a>
          </p>
          <p class="control">
            <input
              class="input is-small p-2 is-size-6 has-text-centered"
              type="number"
              :min="firstIndexedPage"
              :max="book.pages.length"
              v-model.lazy="currentPage"
              @change="scrollTo(currentPage)"
            />
          </p>
        </div>
        <nav class="pagination" role="navigation">
          <div class="control">
            <button
              class="pagination-previous is-small m-1 has-text-white"
              @click="scrollToPreviousHighlight()"
              v-tooltip:bottom="$t('transcribed-text.prev-match-tooltip')"
            >
              {{ $t('transcribed-text.prev-match') }}
            </button>
          </div>
          <div class="control">
            <button
              class="pagination-next is-small m-1 has-text-white"
              @click="scrollToNextHighlight()"
              v-tooltip:bottom="$t('transcribed-text.next-match-tooltip')"
            >
              {{ $t('transcribed-text.next-match') }}
            </button>
          </div>
        </nav>
      </div>
    </div>
    <div
      class="panel-block box m-3 px-3 is-flex is-flex-direction-column is-justify-content-center"
      :class="{
        'rtl-align': preferences.needsRightToLeft
      }"
      role="article"
    >
      <div
        class="scroll-container is-flex is-flex-direction-column is-align-content-center"
        id="scroll-container"
        v-show="!isLoading"
      >
        <div
          v-for="page in book.pages"
          :key="sha1(!page)"
          class="doc-text is-inline-flex is-flex-direction-column is-align-content-center is-flex-wrap-wrap mb-2"
        >
          <div class="box page" :id="page.index">
            <span class="physical-page-number has-text-left has-text-weight-semibold">
              {{ page.index }} ({{ page.logicalPageNumber }})
              <hr />
            </span>
            <div
              class="is-flex is-flex-direction-column is-flex-wrap-wrap m-2"
              :class="preferences.isMobile ? '' : 'is-align-content-start'"
            >
              <p class="page-text is-size-6" v-html="page.text"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="is-flex is-flex-direction-column has-text-centered p-5">
    <!-- Generating a book view -->
    <span class="m-5"
      ><h1>{{ $t('transcribed-text.generating-book-view') }}</h1></span
    >
    <div class="loader-wrapper is-active mt-5">
      <div class="loader is-loading is-active"></div>
      <font-awesome-icon icon="book-open" color="grey" size="2xl" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onUpdated } from 'vue'
import { onMounted, ref, type Ref } from 'vue'
import { onBeforeRouteUpdate, useRouter, useRoute } from 'vue-router'
import { fetchData } from '@/assets/fetchMethods'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { isInView, isInViewOfDiv, mostFrequentUsingMap } from '@/assets/functions'
import { sha1 } from 'object-hash'
import { storeToRefs } from 'pinia'
import type { HighlightedDocument } from '@/assets/interfacesExternals'

const preferences = usePreferencesStore()
const firstIndexedPage = ref()

const { isMobile, isDesktop, isPortrait, isTablet } = storeToRefs(preferences)

const router = useRouter()
const route = useRoute()

const docRef = ref('')
const pageNumber = ref()
const book = ref()

const currentPage = ref()
const query = ref()
const strict = ref(false)
const pageRangeInView = ref()
const isLoading = ref(true)
const pagesWithHighlights: Ref<number[]> = ref([])

const getPagesInView = () => {
  const pagesInView = Array.from(document.querySelectorAll('.box.page'))
    .map((page) => (isInViewOfDiv(page) ? parseInt(page.getAttribute('id')!) : null))
    .filter((x) => x)

  if (pagesInView.length) pageRangeInView.value = `${pagesInView[0]}`
}

onMounted(() => {
  docRef.value = route.params.docRef as string
  pageNumber.value = /^[+-]?\d+(\.\d+)?$/.test(route.params.page.toString())
    ? parseInt(route.params.page as string)
    : 1
  currentPage.value = pageNumber.value

  router.isReady().then(() => {
    if (route.query['query']) query.value = (route.query['query'] as string).trim()
    if (route.query['strict']) strict.value = route.query['strict'] === 'true'
    updateText()
    document.getElementById('scroll-container')?.addEventListener('scroll', getPagesInView, false)
  })
})

onUpdated(() => {
  getPagesInView()
  document.getElementById('scroll-container')?.addEventListener('scroll', getPagesInView, false)
})

const defineSearchParams = () => {
  return Object.assign(
    {},
    query.value?.length ? { query: query.value.trim() } : null,
    strict.value.toString() !== null ? { strict: strict.value.toString() } : null
  )
}

const updateText = () => {
  const params = new URLSearchParams(defineSearchParams())
  params.append('doc-ref', docRef.value)
  params.append('text-as-html', 'true')

  fetchData('highlighted-text', 'get', params)
    .then((res) => res.json())
    .then((bookData) => {
      const highlightedBook = bookData as HighlightedDocument
      if (highlightedBook.pages.length) {
        // Find the lowest index page number: index is physical page
        firstIndexedPage.value = Math.min(...highlightedBook.pages.map((page) => page.index))

        // A hacky way to fix incorrect logical page numbers based on most common difference between assigned logical and physical numbers
        const overallOffset = highlightedBook.pages.map((p) => p.index - (p.logicalPageNumber ?? 0))
        const offset = mostFrequentUsingMap(overallOffset)
        if (offset) {
          highlightedBook.pages.forEach((page) => (page.logicalPageNumber = page.index - offset))
        }

        pagesWithHighlights.value = []
        highlightedBook.pages.forEach((page) => {
          if (page.highlights && page.highlights.length > 0) {
            pagesWithHighlights.value.push(page.index)
          }
        })
      }

      book.value = highlightedBook
    })
    .then(() => document.getElementById(`${route.params.page}`)?.scrollIntoView())
  isLoading.value = false
}

const scrollTo = (page: number) =>
  document.getElementById(page.toString())?.scrollIntoView({ behavior: 'smooth' })

const scrollToPreviousHighlight = () => {
  getPagesInView()

  const pageInView = pageRangeInView.value
  const reversePages = pagesWithHighlights.value.slice().reverse()
  const prevHighlight = reversePages.find((num) => num < pageInView)
  console.log(`Pages with highlights: ${reversePages.join(',')}`)
  console.log(`Page in view: ${pageInView}. Previous highlight: ${prevHighlight}`)
  if (prevHighlight) {
    scrollTo(prevHighlight)
  }
}

const scrollToNextHighlight = () => {
  getPagesInView()

  const pageInView = pageRangeInView.value
  const nextHighlight = pagesWithHighlights.value.find((num) => num > pageInView)
  console.log(`Pages with highlights: ${pagesWithHighlights.value.join(',')}`)
  console.log(`Page in view: ${pageInView}. Next highlight: ${nextHighlight}`)
  if (nextHighlight) {
    scrollTo(nextHighlight)
  }
}

// When URL is changed manually?
onBeforeRouteUpdate(async () => updateText())
</script>
