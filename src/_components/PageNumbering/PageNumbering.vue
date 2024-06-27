<template>
  <nav class="pagination p-1" role="navigation" aria-label="pagination">
    <button @click="gotoPage(page - 1)" :disabled="page <= 1" class="pagination-previous">
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
import { computed, defineModel, defineEmits } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'
const preferences = usePreferencesStore()

const emit = defineEmits(['update-page'])

const page = defineModel('page', { 
  type : Number, 
  default : 1
 })
const totalCount = defineModel('totalCount', { type : Number, default : 0 })
const lastPage = computed(() => Math.floor((totalCount.value - 1) / preferences.resultsPerPage) + 1)

const gotoPage = (newPage: number) => {
  emit('update-page', newPage)
}

</script>