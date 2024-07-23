<template>
  <ul>
    <li v-for="(snippet, index) in snippets" :key="sha1(snippet)">
      <SingleSnippet
        :snippet="snippet"
        :docRef="docRef"
        :index="index"
        :url="url"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import SingleSnippet from './SingleSnippet/SingleSnippet.vue'
import { sha1 } from 'object-hash';

defineProps(['snippets', 'docRef', 'url'])
</script>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>
