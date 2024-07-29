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
  <nav class="pagination p-1" role="navigation" aria-label="pagination" v-if="totalHits > 0 && !isBusy && hasSearch">
    <button @click="gotoPage(page - 1)" :disabled="page < 1" class="pagination-previous">
      {{ $t('pagination.previous') }}
    </button>
    <button @click="gotoPage(page + 1)" :disabled="page >= lastPage" class="pagination-next">
      {{ $t('pagination.next') }}
    </button>
    <ul class="pagination-list">
      <li v-if="page - 1 > 1">
        <a @click="gotoPage(1)" class="pagination-link" aria-label="Goto page 1">1</a>
      </li>
      <li v-if="page - 1 > 2">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-if="page > 1">
        <a
          @click="gotoPage(page - 1)"
          class="pagination-link"
          :aria-label="`Goto page ${page - 1}`"
          >{{ page - 1 }}</a
        >
      </li>
      <li>
        <a
          class="pagination-link is-current current-page-color"
          :aria-label="`Page ${page}`"
          aria-current="page"
          >{{ page }}</a
        >
      </li>
      <li v-if="page < lastPage">
        <a
          @click="gotoPage(page + 1)"
          class="pagination-link"
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
          class="pagination-link"
          :aria-label="`Goto page ${lastPage}`"
          >{{ lastPage }}</a
        >
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed, type Ref } from 'vue'
import { preferences } from '@/assets/fetchMethods';
import { isBusy, hasSearch } from '@/assets/appState';

// const { totalHits } = defineProps(['page', 'totalHits'])
const emit = defineEmits(['search'])

const page: Ref = defineModel('page')
const totalHits : Ref = defineModel('totalHits')

const gotoPage = (newPage: number) => { 
  page.value = newPage
  emit('search')
}

const lastPage = computed(() => Math.floor((totalHits.value - 1) / preferences.resultsPerPage) + 1)
</script>