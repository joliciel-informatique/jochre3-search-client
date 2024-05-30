<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

// Reload when back button pushed
window.onpopstate = function () {
  location.reload()
}
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
@import '@/assets/main.scss';
</style>
