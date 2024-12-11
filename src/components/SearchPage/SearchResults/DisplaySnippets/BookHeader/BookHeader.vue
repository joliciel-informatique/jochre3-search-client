<template>
  <div class="card mb-4">
    <header class="card-header py-3 has-background-warning">
      <p class="card-header-title snippet-header has-text-white" tabindex="0">
        Snippets from next book: {{ title }}{{ author }}
      </p>
    </header>
  </div>
</template>
<script setup lang="ts">
const { title, author } = defineProps(['title', 'author', 'bookIndex'])
</script>
