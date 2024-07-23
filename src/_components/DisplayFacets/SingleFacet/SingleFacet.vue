<template>
    <button @click="addFacetToSearch(facet.facet.label)" class="button is-small is-dark m-1">
        {{ facet.facet.label }} ({{ facet.facet.count }})
    </button>
</template>

<script setup lang="ts">
import { authors, authorInclude } from '@/_components/FindAuthors/FindAuthors-methods';
import { newSearch } from '@/components/SearchPage/SearchPage-methods';

const facet = defineProps(['facet'])
const addFacetToSearch = (facet: string) => {
    authors.add(facet)
    authorInclude.true()
    newSearch()
}
</script>