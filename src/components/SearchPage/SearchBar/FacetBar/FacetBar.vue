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
        <span
          ><p>
            Facets
            <span v-tooltip:bottom="$t('search.what-are-facets')">
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
            @func="emit('newSearch', facet.label)"
          />
        </span>
      </div>
    </div>
    <hr />
  </div>
</template>
<script setup lang="ts">
import { type Ref } from 'vue'
import FilterTag from '@/_components/FilterTag/FilterTag.vue'
import { sha1 } from 'object-hash'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const isLoading = defineModel('isLoading')
const facets: Ref = defineModel('facets')

const emit = defineEmits(['newSearch'])
</script>
