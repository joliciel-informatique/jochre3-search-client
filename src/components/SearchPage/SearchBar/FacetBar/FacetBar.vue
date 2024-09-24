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
  <div id="facetBar" v-if="!isLoading && facets.length">
    <hr />
    <div class="columns has-text-centered is-vcentered">
      <div class="column is-one-fifth">
        <span>
          <p>
            {{ $t('search.facets') }}
            <span v-tooltip:top="$t('search.what-are-facets')">
              <FontAwesomeIcon icon="question-circle" />
            </span>
          </p>
        </span>
      </div>
      <div
        class="column container is-flex is-flex-direction-row is-justify-content-start is-flex-wrap-wrap"
      >
        <span v-for="facet of facets" v-bind:key="sha1(facet)">
          <FilterTag
            :label="facet.label"
            :count="facet.count"
            :active="facet.active"
            :showCount="true"
            @func="toggleFacet(facet)"
          />
        </span>
      </div>
    </div>
    <hr />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, type Ref } from 'vue'
import { sha1 } from 'object-hash'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { AggregationBin } from '@/assets/interfacesExternals'

const FilterTag = defineAsyncComponent(() => import('@/_components/FilterTag/FilterTag.vue'))

const isLoading = defineModel('isLoading')
const facets: Ref = defineModel('facets')

const emit = defineEmits(['newSearch'])

const toggleFacet = (facet: AggregationBin) => {
  facet.active = facet.active ? false : true
  emit('newSearch')
}
</script>
