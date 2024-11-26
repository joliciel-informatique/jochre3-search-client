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
        <div class="pb-0 mb-0 field has-addons">
          <p class="control">
            <a class="button is-size-6 is-small is-static">{{ $t('navigation.jump-to') }}</a>
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
          <p class="control">
            <button class="button is-small" @click="scrollToPreviousHighlight()">
              <svg
                class="svg-inline--fa fa-magnifying-glass-arrow-left"
                :class="{ 'fa-flip-horizontal': !preferences.displayLeftToRight }"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="magnifying-glass-arrow-left"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  class
                  fill="currentColor"
                  d="M 416.321 207.697 C 416.321 253.597 401.421 295.997 376.321 330.397 L 502.921 457.097 C 515.421 469.597 515.421 489.897 502.921 502.397 C 490.421 514.897 470.121 514.897 457.621 502.397 L 331.021 375.697 C 296.621 400.897 254.221 415.697 208.321 415.697 C 93.421 415.697 0.321 322.597 0.321 207.697 C 0.321 92.797 93.421 -0.303 208.321 -0.303 C 323.221 -0.303 416.321 92.797 416.321 207.697 Z M 175.129 118.579 L 103.129 190.579 C 93.729 199.879 93.729 215.079 103.129 224.479 L 175.129 296.479 C 184.429 305.879 199.629 305.779 209.029 296.479 C 218.429 287.179 218.429 271.979 209.029 262.579 L 178.029 231.579 L 296.129 231.579 C 309.429 231.579 320.129 220.879 320.129 207.579 C 320.129 194.279 309.429 183.579 296.129 183.579 L 178.029 183.579 L 209.029 152.579 C 218.429 143.279 218.329 128.079 209.029 118.679 C 199.729 109.279 184.529 109.279 175.129 118.679 Z"
                ></path>
              </svg>
            </button>
          </p>
          <p class="control">
            <button class="button is-small" @click="scrollToNextHighlight()">
              <font-awesome-icon
                icon="magnifying-glass-arrow-right"
                :class="{ 'fa-flip-horizontal': !preferences.displayLeftToRight }"
              />
            </button>
          </p>
        </div>
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
          <div class="box page" :id="page.physicalPageNumber">
            <span class="physical-page-number has-text-left has-text-weight-semibold">
              {{ page.physicalPageNumber }} ({{ page.logicalPageNumber }})
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
import { isInViewOfDiv, mostFrequentUsingMap } from '@/assets/functions'
import { sha1 } from 'object-hash'
import { storeToRefs } from 'pinia'
import type { HighlightedDocument } from '@/assets/interfacesExternals'

const preferences = usePreferencesStore()
const firstIndexedPage = ref()

const { isMobile, isTablet } = storeToRefs(preferences)

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
        // Find the lowest physical page number
        firstIndexedPage.value = Math.min(
          ...highlightedBook.pages.map((page) => page.physicalPageNumber)
        )

        // A hacky way to fix incorrect logical page numbers based on most common difference between assigned logical and physical numbers
        const overallOffset = highlightedBook.pages.map(
          (p) => p.physicalPageNumber - (p.logicalPageNumber ?? 0)
        )
        const offset = mostFrequentUsingMap(overallOffset)
        if (offset) {
          highlightedBook.pages.forEach(
            (page) => (page.logicalPageNumber = page.physicalPageNumber - offset)
          )
        }

        pagesWithHighlights.value = []
        highlightedBook.pages.forEach((page) => {
          if (page.highlights && page.highlights.length > 0) {
            pagesWithHighlights.value.push(page.physicalPageNumber)
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
  const prevHighlight = pagesWithHighlights.value
    .slice()
    .reverse()
    .find((num) => num < pageRangeInView.value)
  if (prevHighlight) scrollTo(prevHighlight)
}

const scrollToNextHighlight = () => {
  getPagesInView()
  const nextHighlight = pagesWithHighlights.value.find((num) => num > pageRangeInView.value)
  if (nextHighlight) scrollTo(nextHighlight)
}

// When URL is changed manually?
onBeforeRouteUpdate(async () => updateText())
</script>
