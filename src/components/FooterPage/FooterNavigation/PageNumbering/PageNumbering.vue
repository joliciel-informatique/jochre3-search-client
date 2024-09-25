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
          <a @click="page = 1" class="pagination-link is-small m-1" aria-label="go to page 1">1</a>
        </li>
        <li v-if="page - 1 > 2">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="page > 1">
          <a
            @click="page--"
            class="pagination-link is-small m-1"
            :aria-label="`go to page ${page - 1}`"
            >{{ page - 1 }}</a
          >
        </li>
        <li>
          <a
            class="pagination-link is-current is-small m-1 has-text-white"
            :aria-label="`go to page ${page}`"
            aria-current="page"
            >{{ page }}</a
          >
        </li>
        <li v-if="page < lastPage">
          <a
            @click="page++"
            class="pagination-link is-small m-1"
            :aria-label="`go to page ${page + 1}`"
            >{{ page + 1 }}</a
          >
        </li>
        <li v-if="page + 1 < lastPage - 1">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="page + 1 < lastPage">
          <a
            @click="page = lastPage"
            class="pagination-link is-small m-1"
            :aria-label="`go to lastpage ${lastPage}`"
            >{{ lastPage }}</a
          >
        </li>
      </ul>
    </div>
    <div>
      <button class="pagination-previous is-small m-1" :disabled="page - 1 < 1" @click="page--">
        {{ $t('pagination.previous') }}
      </button>
      <button class="pagination-next is-small m-1" :disabled="page >= lastPage" @click="page++">
        {{ $t('pagination.next') }}
      </button>
      <button class="pagination-previous is-small m-1" @click="toTop">
        {{ $t('pagination.top') }}
      </button>
      <button class="pagination-previous is-small m-1" @click="toBottom">
        {{ $t('pagination.bottom') }}
      </button>
    </div>
    <div
      class="navigation-current"
      :aria-label="`current position: book ${onScreenBook}, snippet ${onScreenSnippet}`"
      v-tooltip:left="$t('results.result-current-tooltip')"
    >
      {{
        $t('results.result-current-book-and-snippet', [
          onScreenBook,
          lastResult,
          onScreenSnippet,
          onScreenTotalSnippets,
          totalHits
        ])
      }}
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, watch, type Ref } from 'vue'
import { preferences } from '@/assets/fetchMethods'
import { isBusy, hasSearch } from '@/assets/appState'
import { isInView } from '@/assets/functions'

const emit = defineEmits(['newPage'])
const page: Ref = defineModel('page')
const totalHits: Ref = defineModel('totalHits')

watch(page, (newVal) => {
  onScreenBook.value = (newVal - 1) * preferences.resultsPerPage + 1
  emit('newPage')
})

const lastPage = computed(() => Math.floor((totalHits.value - 1) / preferences.resultsPerPage) + 1)
const first = computed(() => (page.value - 1) * preferences.resultsPerPage + 1)

const onScreenBook = ref((page.value - 1) * preferences.resultsPerPage + 1)
const onScreenSnippet = ref(1)
const onScreenTotalSnippets = ref(1)

const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
const toBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })

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

// Keep tabs on what book/snippet is being viewed
onMounted(() => window.addEventListener('scroll', check))
onUpdated(() => window.addEventListener('scroll', check))
</script>
