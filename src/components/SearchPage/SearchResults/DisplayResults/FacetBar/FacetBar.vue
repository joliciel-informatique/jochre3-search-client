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
  <div class="box table-of-contents" role="navigation" tabindex="1">
    <aside class="menu p-2 my-3">
      <div id="facetBar" v-if="!isLoading && facets.length">
        <div class="columns">
          <span
            class="column"
            :class="preferences.displayLeftToRight ? 'has-text-left' : 'has-text-right'"
          >
            <p>
              {{ $t('search.facets') }}
              <span v-tooltip:top="$t('search.what-are-facets')">
                <FontAwesomeIcon icon="question-circle" />
              </span>
            </p>
          </span>
        </div>
        <div class="columns">
          <div
            class="column container is-flex is-flex-direction-column is-justify-content-start is-flex-wrap-wrap"
            :class="
              preferences.displayLeftToRight !== preferences.corpusLeftToRight
                ? 'is-align-items-flex-end'
                : 'is-align-items-flex-start'
            "
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
      </div>
    </aside>
  </div>
</template>
<script setup lang="ts">
import { type Ref } from 'vue'
import FilterTag from '@/_components/FilterTag/FilterTag.vue'
import { sha1 } from 'object-hash'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { AggregationBin } from '@/assets/interfacesExternals'
import { preferences } from '@/assets/fetchMethods'

const isLoading = defineModel('isLoading')
const facets: Ref = defineModel('facets')

const emit = defineEmits(['newSearch'])

const toggleFacet = (facet: AggregationBin) => {
  facet.active = facet.active ? false : true
  emit('newSearch')
}
</script>
