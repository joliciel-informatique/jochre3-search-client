<template>
  <div v-if="!isBusy.value && hasSearch.value">
    <div>
      <span class="is-pulled-right" v-if="searchResults.value.length == 0">
        <div class="navbar-item">
          <strong>{{ $t('results.none') }}</strong>
        </div>
      </span>
      <span class="is-pulled-right" v-for="facet of facets.value" v-bind:key="sha1(facet)">
        <!-- <FilterTag :label="facet.label" :count="facet.count" :showCount="true" :include="true" @addFn="updateSearch"/> -->
        <!-- <SingleFacet :facet="facet" /> -->
      </span>
      <span class="is-pulled-left">
        <button @click="router.back()" class="button is-small is-light m-1">
          {{ $t('back') }}
        </button>
        <button @click="router.forward()" class="button is-small is-light m-1">
          {{ $t('forward') }}
        </button>
        <button @click="resetResults()" class="button is-small is-light m-1">
          {{ $t('results.reset') }}
        </button>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { sha1 } from 'object-hash';
  import { isBusy, hasSearch } from '@/assets/appState';
  import FilterTag from '../Filter/FilterTag.vue';
  import { authorInclude, authors } from '../FindAuthors/FindAuthors-methods';
  import { searchResults, facets } from '../../components/SearchPage/SearchPage-variables';
  import { resetResults, updateSearch } from '../../components/SearchPage/SearchPage-methods';
  import SingleFacet from './SingleFacet/SingleFacet.vue'
  const router = useRouter()
</script>
