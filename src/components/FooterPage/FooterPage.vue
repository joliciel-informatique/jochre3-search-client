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
import { hasSearch } from '@/assets/appState'

const totalHits = defineModel('totalHits')
const page = defineModel('page')
const showFooterNavigation = defineModel('showing')
console.log(hasSearch.value, showFooterNavigation.value, totalHits.value)
const emit = defineEmits(['newSearch', 'resetSearchResults'])

/** Autohide footerbar upon scrolling */
const bottomVisible = () =>
  document.documentElement.clientHeight + window.scrollY >=
  (document.documentElement.scrollHeight || document.documentElement.clientHeight)

const autoHide = () => {
  console.log(bottomVisible())
  showFooterNavigation.value = !bottomVisible() ? true : false
}

onMounted(() => {
  window.addEventListener('scroll', autoHide)
})
</script>
