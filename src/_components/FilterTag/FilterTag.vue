<template>
  <div
    :id="'filterTag-' + label"
    class="button is-info has-text-white is-small m-1"
    :aria-label="`filter ${label}`"
    :class="active ? 'is-warning' : ''"
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
