<template>
  <div>
    <div>
      <span class="is-pulled-right" v-if="searchResults.length == 0">
        <div class="navbar-item">
          <strong>{{ $t('results.none') }}</strong>
        </div>
      </span>
      <span class="is-pulled-right" v-for="facet of facets" :key="facet">
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
import { defineProps, inject } from 'vue'
import { useRouter } from 'vue-router'
import SingleFacet from '@/_components/Facets/SingleFacet.vue'

const eventBus: any = inject('eventBus')

const router = useRouter()

defineProps(['searchResults', 'facets'])
</script>
