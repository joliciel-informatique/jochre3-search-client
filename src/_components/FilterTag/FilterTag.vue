<template>
  <div
    class="button is-info is-normal p-2 m-1"
    :class="active ? 'is-warning' : ''"
    :id="'filterTag-' + label"
    :aria-label="`filter ${label}`"
    tabindex="0"
    @click="clicked"
    @keyup.enter="clicked"
  >
    <div>{{ label }} {{ count && showCount ? ' (' + count + ')' : '' }}</div>
  </div>
</template>
<script setup lang="ts">
const { label, count, active, showCount } = defineProps(['label', 'count', 'active', 'showCount'])
const emit = defineEmits(['func'])
const clicked = () => {
  emit('func', { label: label, count: count, active: true })
}
</script>
