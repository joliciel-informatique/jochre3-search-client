<!-- DisplayFacets
Parent: SearchPage.vue
Children: None
Siblings: None

Props: updateSearch, resetSearchResults, searchResults, facets
Variables: None
Methods: None

Description: presents the search bar
-->
<template>
  <div id="facetBar" v-if="!isBusy && hasSearch" class="is-align-content-stretch">
    <span v-for="facet of facets" v-bind:key="sha1(facet)">
      <FilterTag
        :label="facet.label"
        :count="facet.count"
        :showCount="true"
        @func="emit('search', facet.label)"
      />
    </span>
  </div>
</template>
<script setup lang="ts">
import FilterTag from '../Filter/FilterTag.vue'
import { sha1 } from 'object-hash'
import { isBusy, hasSearch } from '@/assets/appState'

const { searchResults, facets } = defineProps(['searchResults', 'facets'])

const emit = defineEmits(['search', 'resetSearchResults'])
</script>
