<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

// Reload when back button pushed
window.onpopstate = function () {
  location.reload()
}
</script>

<style lang="scss">
@import '@/assets/main.scss';
</style>
