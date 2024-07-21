<template>
  <div>
    <div>
      <strong
        >{{ $t('results.result-count', [totalCount]) }}
        {{ $t('results.result-range', [firstResult, lastResult]) }}</strong
      >
    </div>
    <ul>
      <li v-for="(result, index) of searchResults" :key="index">
        <SingleResult :result="result" />
      </li>
      <hr />
    </ul>
  </div>
</template>

<script setup lang="ts">
import SingleResult from './SingleResult/SingleResult.vue'

defineProps(['searchResults', 'totalCount', 'firstResult', 'lastResult'])
</script>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>
