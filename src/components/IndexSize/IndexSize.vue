<template>
    <div v-if="!isBusy.value && !hasSearch.value && searchResults.value.length == 0">
        <div v-html="$t('search.about')"></div>
        <div>{{ $t('search.index-size', [indexSize.value]) }}</div>
    </div>
</template>
<script setup lang="ts">
    import { indexSize } from './IndexSize-variables';
    import { getIndexSize } from './IndexSize-methods'
    import { isBusy, hasSearch } from '@/assets/appState';
    import { searchResults } from '../SearchPage/SearchPage-variables';
    getIndexSize()
</script>