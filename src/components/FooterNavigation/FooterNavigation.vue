<!-- FooterNavigation
Parent: SearchPage.vue
Children: PageNumbering, HistoryNavigator
Siblings: None

Props: search, resetSearchResults, searchResults, page, totalHits
Variables: lastPage (computed), isBusy (boolean, imported), hasSearch (boolean, imported)
Methods: gotoPage (local)

Description: calculates and presents page numbers
-->
<template>
  <div
    class="footerNavBar has-background-primary"
    v-if="searchResults.length > 0 && query.length > 0"
  >
    <PageNumbering
      @search="search"
      @resetSearchResults="resetSearchResults"
      v-model:page="page"
      v-model:totalHits="totalHits"
    />
  </div>
</template>
<script setup lang="ts">
import PageNumbering from '@/_components/PageNumbering/PageNumbering.vue'
// import HistoryNavigator from '@/_components/HistoryNavigator/HistoryNavigator.vue'

const { search, resetSearchResults, searchResults } = defineProps([
  'query',
  'search',
  'resetSearchResults',
  'searchResults'
])
const page = defineModel('page')
const totalHits = defineModel('totalHits')
</script>
<!-- <style module></style> -->
