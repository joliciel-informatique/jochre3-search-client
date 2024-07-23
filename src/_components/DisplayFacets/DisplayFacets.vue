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
  <div v-if="!isBusy && hasSearch">
    <div>
      <span class="is-pulled-right" v-if="searchResults.length == 0">
        <div class="navbar-item">
          <strong>{{ $t('results.none') }}</strong>
        </div>
      </span>
      <span class="is-pulled-right" v-for="facet of facets" v-bind:key="sha1(facet)">
        <FilterTag 
          :label="facet.label" 
          :count="facet.count" 
          :showCount="true" 
          @func="emit('search', facet.label)"
        />
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
  import FilterTag from '../Filter/FilterTag.vue';
  import { sha1 } from 'object-hash';
  import { isBusy, hasSearch } from '@/assets/appState';

  const { searchResults, facets } = defineProps(['searchResults', 'facets'])
  
  const emit = defineEmits(['search', 'resetSearchResults'])
</script>
