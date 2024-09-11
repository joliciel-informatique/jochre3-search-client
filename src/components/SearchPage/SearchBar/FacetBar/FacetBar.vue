<!-- DisplayFacets
Parent: SearchPage.vue
Children: None
Siblings: None

Props: updateSearch, resetSearchResults, searchResults, facets
Variables: None
Methods: None

Description: presents the facet bar
-->
<template>
  <div
    id="facetBar"
    v-if="!isLoading && facets.length"
    class="container is-flex is-flex-direction-row is-justify-content-center is-flex-wrap-wrap"
  >
    <span v-for="facet of facets" v-bind:key="sha1(facet)">
      <FilterTag
        :label="facet.label"
        :count="facet.count"
        :active="facet.active"
        :showCount="true"
        @func="emit('newSearch', facet.label)"
      />
    </span>
  </div>
</template>
<script setup lang="ts">
import { type Ref } from 'vue'
import FilterTag from '@/_components/FilterTag/FilterTag.vue'
import { sha1 } from 'object-hash'

const isLoading = defineModel('isLoading')
const facets: Ref = defineModel('facets')

const emit = defineEmits(['newSearch'])
</script>
