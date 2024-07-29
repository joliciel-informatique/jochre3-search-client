<template>
  <div v-if="isBusy">
    <img src="/images/loading.gif" />
  </div>
</template>
<script setup lang="ts">
import { isBusy } from '../assets/appState'
</script>
