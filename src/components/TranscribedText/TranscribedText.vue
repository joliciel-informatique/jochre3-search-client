<template>
  <div class="column is-flex is-vcentered bookTitle m-2">
    <h1
      :class="{
        'rtl-align': preferences.needsRightToLeft
      }"
    >
      {{ bookTitle }}
    </h1>
  </div>
  <div class="columns transcribedText" role="navigation">
    <div class="column table-of-contents is-one-fifth box p-3">
      <p class="menu-label">{{ $t('transcribed-text.table-of-contents') }}</p>
      <aside class="menu p-2">
        <div class="p-2 mb-0 field has-addons">
          <p class="control">
            <a class="button is-static level-item">{{ $t('navigation.jump-to') }}</a>
          </p>
          <p class="control container">
            <input
              class="input is-normal is-rounded"
              type="number"
              :min="firstPage"
              :max="bookPages.length"
              v-model="currentPage"
              @change="scrollTo(currentPage)"
            />
          </p>
        </div>
        <hr />
        <ul class="menu-list m-2">
          <li v-for="page in bookPages" :key="page.page">
            <a @click="scrollTo(page.page)">
              {{ $t('transcribed-text.page', [page.label]) }}
              <span v-if="page.logicalNumber">{{
                $t('transcribed-text.logical-page', [page.logicalNumber])
              }}</span>
            </a>
          </li>
        </ul>
      </aside>
    </div>
    <div class="column is-1"></div>
    <div
      v-html="docText"
      class="column m-3 p-3"
      :class="{
        'rtl-align': preferences.needsRightToLeft
      }"
      role="article"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue'
import { onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRouter, useRoute } from 'vue-router'
import { fetchData } from '@/assets/fetchMethods'
import { type BookPages } from '@/assets/interfacesExternals'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

const router = useRouter()
const route = useRoute()

const docRef = ref('')
const pageNumber = ref()
const docText = ref('')
const bookBody = ref()
const bookTitle = ref('')
const bookPages = ref<Array<BookPages>>([])
const currentPage = ref()
const firstPage = ref()
const query = ref()
const strict = ref(false)

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
  })
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

  fetchData('text-as-html', 'get', params, 'text/html')
    .then((res) => res.text())
    .then((res) => (docText.value = res))
    .then(() => document.getElementById(`page${route.params.page}`)?.scrollIntoView())
    .then(() => {
      const footer = document.getElementsByClassName('footer')[0]
      footer.setAttribute('style', 'position:sticky;bottom:0')
    })
}

// Build table of contents
watch(docText, (newVal) => {
  bookBody.value = new DOMParser().parseFromString(newVal, 'text/html').body

  bookTitle.value = (bookBody.value.firstChild as HTMLElement).innerText

  const pages = Array.from(bookBody.value.querySelectorAll('div[id]:not([id=""])')).map((div) =>
    (div as HTMLDivElement).id.replace('page', '')
  )

  bookPages.value = pages.map((page: string, idx: number) => {
    const pageNum = /^[+-]?\d+(\.\d+)?$/.test(page) ? parseInt(page) : 1
    if (idx === 0) firstPage.value = page
    return {
      page: pageNum,
      label: page.replace('page', 'page '),
      logicalNumber: findPageNumber(pageNum)
    }
  })
})

const scrollTo = (page: number) => {
  const client = document.getElementById(`page${page}`)
  if (client) {
    const top = client.getBoundingClientRect().top + window.pageYOffset
    window.scrollTo({ top: top, behavior: 'smooth' })
  }
}

const findPageNumber = (number: number): number => {
  const currentElement = bookBody.value.querySelector(`div#page${number}`)
  if (!currentElement) return number
  const textFragments = []
  const walker = document.createTreeWalker(currentElement, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    textFragments.push(walker.currentNode)
  }

  const numbers = textFragments
    .map((fragment) =>
      /^[+-]?\d+(\.\d+)?$/.test((fragment as Text).data) ? (fragment as Text).data : null
    )
    .reverse()
    .filter((fragment) => fragment)

  return numbers.length && numbers[0] ? parseInt(numbers[0]) : 0
}

// When URL is changed manually?
onBeforeRouteUpdate(async () => {
  // react to route changes...
  updateText()
})
</script>
