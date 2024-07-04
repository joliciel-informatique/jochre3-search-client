<template>
  <nav class="pagination p-1" role="navigation" aria-label="pagination" v-if="totalCount > 0">
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
      <li v-if="page + 1 < lastPage">
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
import { computed, defineProps, inject } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const eventBus: any = inject('eventBus')
const gotoPage = (newPage: number) => eventBus.emit('updatePage', newPage)

const preferences = usePreferencesStore()
const props = defineProps(['page', 'totalCount'])

const lastPage = computed(() => {
  const totalCount: number = props.totalCount
  const lastPage: number = Math.floor((totalCount - 1) / preferences.resultsPerPage) + 1
  return lastPage
})
</script>
