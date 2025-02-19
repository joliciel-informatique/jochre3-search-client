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
          {{ $t('navigation.currently-viewing-pages', [pageRangeInView, lastPage]) }}
        </span>
        <div class="pb-0 mb-0 field has-addons">
          <p class="control">
            <a class="button is-size-6 is-small is-static">{{ $t('navigation.jump-to') }}</a>
          </p>
          <p class="control">
            <input
              class="input is-small p-2 is-size-6 has-text-centered"
              type="number"
              :min="bookStore.firstIndexedPage"
              :max="book.pages.length"
              v-model.lazy="currentPage"
              @change="scrollTo(currentPage)"
              @keyup.enter="scrollTo(currentPage)"
            />
          </p>
          <p class="control">
            <button
              class="button is-small"
              @click="currentHighlightIdx = 0"
              :disabled="currentHighlightIdx === 0"
            >
              <font-awesome-icon icon="angles-up" />
            </button>
          </p>
          <p class="control">
            <button
              class="button is-small"
              @click="currentHighlightIdx--"
              :disabled="currentHighlightIdx === 0"
            >
              <font-awesome-icon icon="chevron-up" />
            </button>
          </p>
          <p class="control">
            <button
              class="button is-small"
              @click="currentHighlightIdx++"
              :disabled="currentHighlightIdx === pagesWithHighlights.length - 1"
            >
              <font-awesome-icon icon="chevron-down" />
            </button>
          </p>
          <p class="control">
            <button
              class="button is-small"
              @click="currentHighlightIdx = pagesWithHighlights.length - 1"
              :disabled="currentHighlightIdx === pagesWithHighlights.length - 1"
            >
              <font-awesome-icon icon="angles-down" />
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
          <div class="box page" :id="`${page.physicalPageNumber}`">
            <span class="physical-page-number has-text-left has-text-weight-semibold">
              {{ page.physicalPageNumber }}
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
  <div v-else-if="!book && !isLoading" class="m-5 has-text-centered">
    <h1
      class="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
    >
      <span class="no-results"> {{ $t('transcribed-text.book-not-found', [docRef]) }} </span>
      <div class="is-flex is-justify-content-center is-align-items-center no-results-image m-6">
        <font-awesome-icon icon="ban" size="2xl" />
      </div>
    </h1>
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
import { computed, onUpdated, watch } from 'vue'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { useBookStore } from '@/stores/BookStore'
import { isInViewOfDiv } from '@/assets/functions'
import { sha1 } from 'object-hash'
import { storeToRefs } from 'pinia'
import { hasOwn } from '@vueuse/core'

const preferences = usePreferencesStore()
const bookStore = useBookStore()
const { updateText } = bookStore

const { isMobile, isTablet } = storeToRefs(preferences)
const { book, docRef, page, query, strict, isLoading, pagesWithHighlights } = storeToRefs(bookStore)

const router = useRouter()
const route = useRoute()

// Variables required for navigation with component
const pageNumber = ref()
const currentPage = ref()
const pageRangeInView = ref()
const lastPage = computed(
  () => book.value?.pages.map((page) => page.physicalPageNumber)[book.value?.pages.length - 1]
)

const currentHighlightIdx = ref(0)

onMounted(async () => {
  router.isReady().then(async () => {
    isLoading.value = true
    query.value =
      hasOwn(route.query, 'query') && typeof route.query.query === 'string'
        ? route.query.query.trim()
        : ''
    strict.value = hasOwn(route.query, 'strict') && route.query.strict ? true : false
    docRef.value =
      hasOwn(route.params, 'docRef') && typeof route.params.docRef === 'string'
        ? route.params.docRef
        : ''

    await updateText()

    isLoading.value = false

    pageNumber.value = /^[+-]?\d+(\.\d+)?$/.test(route.params.page.toString())
      ? parseInt(route.params.page as string)
      : 1
    currentPage.value = pageNumber.value

    currentHighlightIdx.value = pagesWithHighlights.value.indexOf(pageNumber.value)

    // Add ids to all highlights
    const highlights = document.querySelectorAll('.highlight')
    highlights.forEach((highlight, key) => {
      highlight.addEventListener('click', () => (currentHighlightIdx.value = key))
      highlight.id = `highlight-${key}`
    })

    highlight(currentHighlightIdx.value)
  })

  document.getElementById('scroll-container')?.addEventListener('scroll', getPagesInView, false)
  document.getElementById(page.value)?.scrollIntoView()
})

onUpdated(() => {
  getPagesInView()
  document.getElementById('scroll-container')?.addEventListener('scroll', getPagesInView, false)
})

// If current page is updated
watch(currentPage, (newV) => {
  // Set first highlight of new page as active
  const highLightIdx = pagesWithHighlights.value.indexOf(newV)
  if (highLightIdx !== -1) {
    currentHighlightIdx.value = highLightIdx
  } else {
    // Set nearest highlight active if no highlights on the page
    let idx = getClosestPageIndexWithHighlights(newV)
    const highLightIdx = pagesWithHighlights.value.indexOf(idx)
    currentHighlightIdx.value = highLightIdx
  }
  scrollTo(newV)
})

// If buttons are pressed
watch(currentHighlightIdx, (newV) => highlight(newV))

const getClosestPageIndexWithHighlights = (idx: number) =>
  Array.from(new Set(pagesWithHighlights.value.map((p: number) => p))).reduce(
    (prev, curr) => (Math.abs(curr - idx) < Math.abs(prev - idx) ? curr : prev),
    0
  )

const highlight = (highLightIndex: number, scroll: boolean = true) => {
  document
    .querySelectorAll('.highlight.active')
    .forEach((highlight) => highlight.classList.remove('active'))
  const highlight = document.getElementById(`highlight-${highLightIndex}`)
  console.log(highlight)
  if (highlight) highlight.classList.add('active')
  if (highlight && scroll) highlight.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const getPagesInView = () => {
  const pagesInView = Array.from(document.querySelectorAll('.box.page'))
    .map((page) => (isInViewOfDiv(page) ? parseInt(page.getAttribute('id')!) : null))
    .filter((x) => x)

  if (pagesInView.length) pageRangeInView.value = `${pagesInView[0]}`
}

const scrollTo = (page: number) =>
  document.getElementById(page.toString())?.scrollIntoView({ behavior: 'smooth' })
</script>
