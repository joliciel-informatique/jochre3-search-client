<template>
  <div v-if="!isBusy && hasSearch">
    <div>
      <span class="is-pulled-right" v-if="!searchResults">
        <div class="navbar-item" v-if="!searchResults">
          <strong>{{ $t('results.none') }}</strong>
        </div>
      </span>
      <span class="is-pulled-right" v-for="facet of facetsWithKey" :key="facet.key">
        <SingleFacet :facet="facet" />
      </span>
      <span class="is-pulled-left">
        <button @click="router.back()" class="button is-small is-light m-1">
          {{ $t('back') }}
        </button>
        <button @click="eventBus.emit('resetResults')" class="button is-small is-light m-1">
          {{ $t('results.reset') }}
        </button>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineModel, inject } from 'vue';
import { useRouter } from 'vue-router';
import SingleFacet from '@/_components/Facets/SingleFacet.vue';
import * as hash from 'object-hash';

const eventBus : any = inject('eventBus')

const router = useRouter();

const isBusy = defineModel('isBusy', { default : false, type : Boolean })
const hasSearch = defineModel('hasSearch', { default : false, type : Boolean })

const searchResults = defineModel('searchResults', { type : Array })
const facets = defineModel('facets', { default : [['', 0]], type : Object })
const facetsWithKey = facets.value.map((facet : Object) => ({ ...facet, key: hash.sha1(facet) }))
</script>