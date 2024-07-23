<template>
    <div class="button is-small is-dark m-1" :id="'filterTag-'+label">
        <div>
            {{ label }} {{ count && showCount ? ' (' + count + ')' : '' }}
        </div>
        <div>
            <button v-if="!include" class="delete" aria-label="remove" @click="emit('delFn', label)"></button>
            <button v-if="include" class="include" aria-label="include" @click="emit('addFn', label)"></button>
        </div>
    </div>
</template>

<script setup lang="ts">
const { label, count, showCount, include } = defineProps(['label', 'count', 'showCount', 'include'])
const emit = defineEmits(['delFn', 'addFn'])
</script>