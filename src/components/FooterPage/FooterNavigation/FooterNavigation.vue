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
    class="footerNavBar hero is-flex-direction-column is-align-items-center has-text-centered p-1 has-background-primary"
  >
    <!-- <HistoryNavigator @resetSearchResults="emit('resetSearchResults')" :totalHits /> -->
    <PageNumbering @newPage="emit('newPage')" v-model:page="page" v-model:total-hits="totalHits" />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const PageNumbering = defineAsyncComponent(() => import('./PageNumbering/PageNumbering.vue'))
// const SearchInfo = defineAsyncComponent(() => import('./SearchInfo/SearchInfo.vue'))
// import HistoryNavigator from './HistoryNavigator/HistoryNavigator.vue'

const emit = defineEmits(['newPage', 'resetSearchResults'])
const page = defineModel('page')
const totalHits = defineModel('totalHits')
</script>
