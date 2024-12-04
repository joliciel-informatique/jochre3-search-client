<template>
  <div
    class="filterTag button is-info is-small p-2 m-1"
    :class="active ? 'is-warning' : ''"
    :id="'filterTag-' + label"
    :aria-label="`filter ${label}`"
    tabindex="0"
    @click="clicked"
    @keyup.enter="clicked"
  >
    <div :class="{ 'rtl-align': rightToLeft && preferences.needsRightToLeft }">
      {{ label }} {{ count && showCount ? ' (' + count + ')' : '' }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()
const { label, count, active, showCount, rightToLeft } = defineProps([
  'label',
  'count',
  'active',
  'showCount',
  'rightToLeft'
])
const emit = defineEmits(['func'])
const clicked = () => emit('func', { label: label, count: count, active: true })
</script>
