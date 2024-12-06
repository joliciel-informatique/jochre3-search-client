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
              :min="bookStore.firstIndexedPage"
              :max="book.pages.length"
              v-model.lazy="currentPage"
              @change="scrollTo(currentPage)"
            />
          </p>
          <p class="control">
            <button class="button is-small" @click="scrollToPreviousHighlight()">
              <font-awesome-icon
                icon="chevron-up"
                :class="{ 'fa-flip-horizontal': !preferences.displayLeftToRight }"
              />
            </button>
          </p>
          <p class="control">
            <button class="button is-small" @click="scrollToNextHighlight()">
              <font-awesome-icon
                icon="chevron-down"
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
import { onUpdated, watch } from 'vue'
import { onMounted, ref, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { useBookStore } from '@/stores/BookStore'
import { isInViewOfDiv } from '@/assets/functions'
import { sha1 } from 'object-hash'
import { storeToRefs } from 'pinia'
import { hasOwn } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const preferences = usePreferencesStore()
const bookStore = useBookStore()
const { updateText } = bookStore

const { isMobile, isTablet } = storeToRefs(preferences)
const { book, docRef, page, pagesWithHighlights, query, strict, isLoading } = storeToRefs(bookStore)
const notification: Ref = defineModel('notification')

const router = useRouter()
const route = useRoute()

// Variables required for navigation with component
const pageNumber = ref()
const currentPage = ref()
const pageRangeInView = ref()

watch(currentPage, (newV) => scrollTo(newV))

const getPagesInView = () => {
  const pagesInView = Array.from(document.querySelectorAll('.box.page'))
    .map((page) => (isInViewOfDiv(page) ? parseInt(page.getAttribute('id')!) : null))
    .filter((x) => x)

  if (pagesInView.length) pageRangeInView.value = `${pagesInView[0]}`
}

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
  })

  document.getElementById('scroll-container')?.addEventListener('scroll', getPagesInView, false)
  document.getElementById(page.value)?.scrollIntoView()
})

onUpdated(() => {
  getPagesInView()
  document.getElementById('scroll-container')?.addEventListener('scroll', getPagesInView, false)
})

const scrollTo = (page: number) => {
  document.getElementById(page.toString())?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToPreviousHighlight = () => {
  getPagesInView()

  const prevHighlight = pagesWithHighlights.value
    .slice()
    .reverse()
    .find((num) => num < pageRangeInView.value)

  if (prevHighlight) {
    scrollTo(prevHighlight)
  } else {
    notification.value = {
      show: true,
      error: true,
      delay: 4000,
      msg: i18n.t('transcribed-text.no-more-highlights')
    }
  }
}

const scrollToNextHighlight = () => {
  getPagesInView()
  const nextHighlight = pagesWithHighlights.value.find((num) => num > pageRangeInView.value)
  if (nextHighlight) {
    scrollTo(nextHighlight)
  } else {
    notification.value = {
      show: true,
      error: true,
      delay: 4000,
      msg: i18n.t('transcribed-text.no-more-highlights')
    }
  }
}
</script>
