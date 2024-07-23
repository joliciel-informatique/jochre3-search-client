<template>
  <nav class="pagination p-1" role="navigation" aria-label="pagination" v-if="totalHits.value > 0 && !isBusy.value && hasSearch.value">
    <button @click="gotoPage(page.decrement())" :disabled="page.value < 1" class="pagination-previous">
      {{ $t('pagination.previous') }}
    </button>
    <button @click="gotoPage(page.increment())" :disabled="page.value >= lastPage" class="pagination-next">
      {{ $t('pagination.next') }}
    </button>
    <ul class="pagination-list">
      <li v-if="page.value - 1 > 1">
        <a @click="gotoPage(1)" class="pagination-link" aria-label="Goto page 1">1</a>
      </li>
      <li v-if="page.value - 1 > 2">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-if="page.value > 1">
        <a
          @click="gotoPage(page.decrement())"
          class="pagination-link"
          :aria-label="`Goto page ${page.value - 1}`"
          >{{ page.value - 1 }}</a
        >
      </li>
      <li>
        <a
          class="pagination-link is-current current-page-color"
          :aria-label="`Page ${page.value}`"
          aria-current="page"
          >{{ page.value }}</a
        >
      </li>
      <li v-if="page.value < lastPage">
        <a
          @click="gotoPage(page.increment())"
          class="pagination-link"
          :aria-label="`Goto page ${page.value + 1}`"
          >{{ page.value + 1 }}</a
        >
      </li>
      <li v-if="page.value + 1 < lastPage - 1">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-if="page.value + 1 < lastPage">
        <a
          @click="gotoPage(lastPage)"
          class="pagination-link"
          :aria-label="`Goto page ${lastPage}`"
          >{{ lastPage }}</a
        >
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { preferences } from '@/assets/fetchMethods';
import { page, totalHits } from '@/components/SearchPage/SearchPage-variables';
import { search } from '@/components/SearchPage/SearchPage-methods';
import { isBusy, hasSearch } from '@/assets/appState';

const gotoPage = (newPage: number) => { 
  page.set(newPage)
  search()
}

const lastPage = computed(() => Math.floor((totalHits.value - 1) / preferences.resultsPerPage) + 1)
</script>