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
      <button
        @click="toTop"
        @keyup.enter="toTop"
        class="pagination-previous is-small m-1 has-text-white"
      >
        {{ $t('pagination.top') }}
      </button>
    </div>
    <div v-show="!preferences.displayPerBook">
      <button
        @click="page--"
        @keyup.enter="page--"
        class="pagination-previous is-small m-1"
        :class="page - 1 < 1 ? 'has-text-grey-darker' : 'has-text-white'"
        :disabled="page - 1 < 1"
      >
        {{ $t('pagination.previous') }}
      </button>
    </div>
    <div v-show="!preferences.displayPerBook">
      <ul class="pagination-list">
        <li v-if="page - 1 > 1">
          <a
            @click="page = 1"
            @keyup.enter="page = 1"
            class="pagination-link is-small m-1"
            aria-label="go to page 1"
            tabindex="2"
            >1</a
          >
        </li>
        <li v-if="page - 1 > 2">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="page > 1">
          <a
            class="pagination-link is-small m-1 has-text-white"
            tabindex="2"
            @click="page--"
            @keyup.enter="page--"
            :aria-label="`go to page ${page - 1}`"
            >{{ page - 1 }}</a
          >
        </li>
        <li>
          <a
            class="pagination-link is-current is-small m-1 has-text-white"
            :aria-label="`go to page ${page}`"
            aria-current="page"
            tabindex="2"
            >{{ page }}</a
          >
        </li>
        <li v-if="page < lastPage">
          <a
            @click="page++"
            @keyup.enter="page++"
            class="pagination-link is-small m-1 has-text-white"
            :aria-label="`go to page ${page + 1}`"
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
            class="pagination-link is-small m-1 has-text-white"
            :aria-label="`go to lastpage ${lastPage}`"
            tabindex="2"
            >{{ lastPage }}</a
          >
        </li>
      </ul>
    </div>
    <div v-show="!preferences.displayPerBook">
      <button
        @click="page++"
        @keyup.enter="page++"
        class="pagination-next is-small m-1"
        :class="page >= lastPage ? 'has-text-grey-darker' : 'has-text-white'"
        :disabled="page >= lastPage"
      >
        {{ $t('pagination.next') }}
      </button>
    </div>
    <div>
      <button
        @click="toBottom"
        @keyup.enter="toBottom"
        class="pagination-previous is-small m-1 has-text-white"
      >
        {{ $t('pagination.bottom') }}
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, watch, type Ref } from 'vue'
import { preferences } from '@/assets/fetchMethods'
import { isBusy, hasSearch } from '@/assets/appState'

const emit = defineEmits(['newPage'])
const page: Ref = defineModel('page')
const lastPage = computed(() => Math.floor((totalHits.value - 1) / preferences.resultsPerPage) + 1)
const totalHits: Ref = defineModel('totalHits')
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
const toBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })

watch(page, () => emit('newPage'))
</script>
