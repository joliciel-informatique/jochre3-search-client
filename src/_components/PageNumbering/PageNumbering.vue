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
    <HistoryNavigator @resetSearchResults="resetSearchResults" />
    <div>
      <!-- <button
        @click="gotoPage(page - 1)"
        :disabled="page < 1"
        class="pagination-previous has-text-white has-background-info"
      >
        {{ $t('pagination.previous') }}
      </button> -->
      <button @click="gotoPage(page - 1)" :disabled="page < 1" class="button is-info is-small m-1">
        {{ $t('pagination.previous') }}
      </button>
      <!-- <button
        @click="gotoPage(page + 1)"
        :disabled="page >= lastPage"
        class="pagination-next has-text-white has-background-info"
      >
        {{ $t('pagination.next') }}
      </button> -->
      <button
        @click="gotoPage(page + 1)"
        :disabled="page >= lastPage"
        class="button is-info is-small m-1"
      >
        {{ $t('pagination.next') }}
      </button>
    </div>
    <div>
      <ul class="pagination-list">
        <li v-if="page - 1 > 1">
          <a @click="gotoPage(1)" class="button is-info is-small m-1" aria-label="Goto page 1">1</a>
        </li>
        <li v-if="page - 1 > 2">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="page > 1">
          <a
            @click="gotoPage(page - 1)"
            class="button is-info is-small m-1"
            :aria-label="`Goto page ${page - 1}`"
            >{{ page - 1 }}</a
          >
        </li>
        <li>
          <a
            class="button is-info is-small m-1 has-text-white"
            :aria-label="`Page ${page}`"
            aria-current="page"
            >{{ page }}</a
          >
        </li>
        <li v-if="page < lastPage">
          <a
            @click="gotoPage(page + 1)"
            class="button is-info is-small m-1"
            :aria-label="`Goto page ${page + 1}`"
            >{{ page + 1 }}</a
          >
        </li>
        <li v-if="page + 1 < lastPage - 1">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="page + 1 < lastPage">
          <a
            @click="gotoPage(lastPage)"
            class="button is-info is-small m-1"
            :aria-label="`Goto page ${lastPage}`"
            >{{ lastPage }}</a
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, type Ref } from 'vue'
import { preferences } from '@/assets/fetchMethods'
import { isBusy, hasSearch } from '@/assets/appState'
import HistoryNavigator from '../HistoryNavigator/HistoryNavigator.vue'
const { resetSearchResults } = defineProps(['resetSearchResults'])

const emit = defineEmits(['search'])

const page: Ref = defineModel('page')
const totalHits: Ref = defineModel('totalHits')

const gotoPage = (newPage: number) => {
  page.value = newPage
  emit('search')
}

const lastPage = computed(() => Math.floor((totalHits.value - 1) / preferences.resultsPerPage) + 1)
</script>
