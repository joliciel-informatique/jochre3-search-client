<template>
  <footer class="footer has-text-white mt-auto header-footer-content">
    <Transition name="slide-up" mode="out-in">
      <div v-if="showFooterNavigation">
        <FooterNavigation
          @newSearch="emit('newSearch')"
          @resetSearchResults="emit('resetSearchResults')"
          v-model:totalHits="totalHits"
          v-model:page="page"
        />
      </div>
      <div v-else-if="!totalHits">
        <FooterDefault />
      </div>
    </Transition>
  </footer>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import FooterDefault from './FooterDefault/FooterDefault.vue'
import FooterNavigation from './FooterNavigation/FooterNavigation.vue'

const totalHits = defineModel('totalHits')
const page = defineModel('page')
const showFooterNavigation = defineModel('showing')
const emit = defineEmits(['newSearch', 'resetSearchResults'])
const enableScrollBehavior = defineModel('enableScrollBehavior')

/** Autohide footerbar upon scrolling */
const bottomVisible = () =>
  document.documentElement.clientHeight + window.scrollY >=
  (document.documentElement.scrollHeight || document.documentElement.clientHeight)

const autoHide = () => (showFooterNavigation.value = !bottomVisible() ? true : false)

onMounted(() => (enableScrollBehavior.value ? window.addEventListener('scroll', autoHide) : null))
</script>
