<template>
  <div>
    <div v-if="!isBusy && hasSearch && searchResults.length > 0">
        <strong>{{ $t('results.result-count', [totalCount]) }} {{ $t('results.result-range', [firstResult, lastResult]) }}</strong>
    </div>
    <ul>
      <li v-for="(result, index) of searchResults" :key="index">
        <SingleResult :singleResult="result" />
      </li>
      <hr />
    </ul>
  </div>
</template>

<script setup lang="ts">
import SingleResult from './SingleResult/SingleResult.vue'

const isBusy = defineModel('isBusy', { default : false, type : Boolean })
const hasSearch = defineModel('hasSearch', { default : false, type : Boolean })
const searchResults = defineModel('searchResults', { type : [String, Object, Object]})
const totalCount = defineModel('totalCount', { default : 0, type : Number })
const firstResult = defineModel('firstResult', { default : 0, type : Number })
const lastResult = defineModel('lastResult', { default : 0, type : Number })
</script>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>
