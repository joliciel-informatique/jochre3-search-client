<template>
  <span :tooltip="tooltipText" :position="position"><slot /></span>
</template>

<script setup lang="ts">
defineProps(['tooltipText', 'position'])
</script>
<script>
export default {
  name: 'ToolTip'
}
</script>
