<template>
    <button @click="eventBus.emit('addFacetToQuery', facet)" class="button is-small is-dark m-1">
        {{ facet.facet.label }} ({{ facet.facet.count }})
    </button>
</template>

<script setup lang="ts">
import { inject } from 'vue';
const eventBus : any = inject('eventBus')
const facet = defineProps(['facet'])
</script>