<!-- PageNumbering
Parent: SearchPage.vue
Children: None
Siblings: None

Props: search, page, totalHits
Variables: lastPage (computed), isBusy (boolean, imported), hasSearch (boolean, imported)
Methods: gotoPage (local)

Description: calculates and presents page numbers
-->
<template>
  <nav
    class="pagination p-1"
    role="navigation"
    aria-label="pagination"
    v-if="totalHits > 0 && !isBusy && hasSearch"
  >
    <div>
      <ul class="pagination-list">
        <li v-if="page - 1 > 1">
          <a @click="goToPage(1)" class="pagination-link is-small m-1" aria-label="Goto page 1"
            >1</a
          >
        </li>
        <li v-if="page - 1 > 2">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="page > 1">
          <a
            @click="goToPage(page - 1)"
            class="pagination-link is-small m-1"
            :aria-label="`Goto page ${page - 1}`"
            >{{ page - 1 }}</a
          >
        </li>
        <li>
          <a
            class="pagination-link is-current is-small m-1 has-text-white"
            :aria-label="`Page ${page}`"
            aria-current="page"
            >{{ page }}</a
          >
        </li>
        <li v-if="page < lastPage">
          <a
            @click="goToPage(page + 1)"
            class="pagination-link is-small m-1"
            :aria-label="`Goto page ${page + 1}`"
            >{{ page + 1 }}</a
          >
        </li>
        <li v-if="page + 1 < lastPage - 1">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="page + 1 < lastPage">
          <a
            @click="goToPage(lastPage)"
            class="pagination-link is-small m-1"
            :aria-label="`Goto page ${lastPage}`"
            >{{ lastPage }}</a
          >
        </li>
      </ul>
    </div>
    <div>
      <button
        @click="goToPage(page - 1)"
        :disabled="page - 1 < 1"
        class="pagination-previous is-small m-1"
      >
        {{ $t('pagination.previous') }}
      </button>
      <button
        @click="goToPage(page + 1)"
        :disabled="page >= lastPage"
        class="pagination-next is-small m-1"
      >
        {{ $t('pagination.next') }}
      </button>
    </div>
    <div v-tooltip:left="$t('results.result-current-tooltip')" class="navigation-current">
      {{ $t('results.result-current-book', [onScreenBook, lastResult]) }},
      {{ $t('results.result-current-snippet', [onScreenSnippet, onScreenTotalSnippets]) }}
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, type Ref } from 'vue'
import { preferences } from '@/assets/fetchMethods'
import { isBusy, hasSearch } from '@/assets/appState'
import { isInView } from '@/assets/functions'

const emit = defineEmits(['newSearch'])
const page: Ref = defineModel('page')
const totalHits: Ref = defineModel('totalHits')

const goToPage = (newPage: number) => {
  page.value = newPage
  onScreenBook.value = (newPage - 1) * preferences.resultsPerPage + 1
  emit('newSearch')
}

const lastPage = computed(() => Math.floor((totalHits.value - 1) / preferences.resultsPerPage) + 1)
const first = computed(() => (page.value - 1) * preferences.resultsPerPage + 1)

const onScreenBook = ref((page.value - 1) * preferences.resultsPerPage + 1)
const onScreenSnippet = ref(1)
const onScreenTotalSnippets = ref(1)

const lastResult = computed(() => {
  const last = page.value * preferences.resultsPerPage
  return totalHits.value < last ? totalHits.value : last
})

const check = () => {
  Array.from(document.querySelectorAll('.card.metadata')).every((doc, idx) => {
    if (isInView(doc as HTMLElement)) {
      onScreenBook.value = first.value + idx

      const docRef = doc.getAttribute('docRef')
      const totalSnippets = Array.from(document.querySelectorAll('.card.snippet')).filter(
        (snippet) => snippet.getAttribute('docRef') === docRef
      )
      onScreenTotalSnippets.value = totalSnippets.length
      Array.from(totalSnippets).every((snippet, idx) => {
        if (isInView(snippet as HTMLElement)) {
          onScreenSnippet.value = idx + 1
          return false
        }
        return true
      })
      return false
    }
    return true
  })
  window.removeEventListener('scroll', check)
  window.addEventListener('scroll', check)
}

onMounted(() => window.addEventListener('scroll', check))

// Keep tabs on what book/snippet is being viewed
onUpdated(() => window.addEventListener('scroll', check))
</script>
