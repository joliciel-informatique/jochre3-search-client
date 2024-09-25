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
    tabindex="2"
    v-if="totalHits > 0 && !isBusy && hasSearch"
  >
    <div>
      <ul class="pagination-list">
        <li v-if="page - 1 > 1">
          <a
            @click="page = 1"
            @keyup.enter="page = 1"
            class="pagination-link is-small m-1"
            aria-label="Goto page 1"
            tabindex="2"
            >1</a
          >
        </li>
        <li v-if="page - 1 > 2">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="page > 1">
          <a
            class="pagination-link is-small m-1"
            :aria-label="`Goto page ${page - 1}`"
            tabindex="2"
            @click="page--"
            @keyup.enter="page--"
            >{{ page - 1 }}</a
          >
        </li>
        <li>
          <a
            class="pagination-link is-current is-small m-1 has-text-white"
            :aria-label="`Page ${page}`"
            aria-current="page"
            tabindex="2"
            >{{ page }}</a
          >
        </li>
        <li v-if="page < lastPage">
          <a
            @click="page++"
            @keyup.enter="page++"
            class="pagination-link is-small m-1"
            :aria-label="`Goto page ${page + 1}`"
            tabindex="2"
            >{{ page + 1 }}</a
          >
        </li>
        <li v-if="page + 1 < lastPage - 1">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="page + 1 < lastPage">
          <a
            @click="page = lastPage"
            @keyup.enter="page = lastPage"
            class="pagination-link is-small m-1"
            :aria-label="`Goto page ${lastPage}`"
            tabindex="2"
            >{{ lastPage }}</a
          >
        </li>
      </ul>
    </div>
    <div>
      <button
        @click="page--"
        @keyup.enter="page--"
        :disabled="page - 1 < 1"
        class="pagination-previous is-small m-1"
      >
        {{ $t('pagination.previous') }}
      </button>
      <button
        @click="page++"
        @keyup.enter="page++"
        :disabled="page >= lastPage"
        class="pagination-next is-small m-1"
      >
        {{ $t('pagination.next') }}
      </button>
      <button @click="toTop" @keyup.enter="toTop" class="pagination-previous is-small m-1">
        {{ $t('pagination.top') }}
      </button>
      <button @click="toBottom" @keyup.enter="toBottom" class="pagination-previous is-small m-1">
        {{ $t('pagination.bottom') }}
      </button>
    </div>
    <div v-tooltip:left="$t('results.result-current-tooltip')" class="navigation-current">
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
