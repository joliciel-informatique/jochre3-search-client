<template>
    <div class="button is-small is-dark m-1" :id="'filterTag-'+label" @click="$emit('func', label)">
        <div>
            {{ label }} {{ count && showCount ? ' (' + count + ')' : '' }}
        </div>
    </div>
</template>

<script setup lang="ts">
const { label, count, showCount } = defineProps(['label', 'count', 'showCount'])
</script>