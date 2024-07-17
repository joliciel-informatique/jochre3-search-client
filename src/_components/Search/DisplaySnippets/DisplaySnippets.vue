<template>
  <ul>
    <li v-for="(snippet, index) in snippets" :key="snippet">
      <SingleSnippet :snippet="snippet" :docRef="docRef" :index="index" :url="url" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import SingleSnippet from './SingleSnippet/SingleSnippet.vue'

defineProps(['snippets', 'docRef', 'url'])
</script>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>
