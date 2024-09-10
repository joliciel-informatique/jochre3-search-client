<template>
  <footer class="footer has-text-white has-text-weight-semibold mt-auto header-footer-content">
    <Transition name="slide-up" mode="out-in">
      <div v-if="showing">
        <FooterNavigation
          @newSearch="emit('newSearch')"
          @resetSearchResults="emit('resetSearchResults')"
          v-model:totalHits="totalHits"
          v-model:page="page"
        />
      </div>
      <div v-else-if="!showing">
        <FooterDefault />
      </div>
    </Transition>
  </footer>
</template>
<script setup lang="ts">
import { onMounted, onUpdated, watch } from 'vue'
import FooterDefault from './FooterDefault/FooterDefault.vue'
import FooterNavigation from './FooterNavigation/FooterNavigation.vue'

const totalHits = defineModel('totalHits')
const page = defineModel('page')
const showing = defineModel('showing')
const emit = defineEmits(['newSearch', 'resetSearchResults'])

/** Autohide footerbar upon scrolling */
const bottomVisible = () =>
  document.documentElement.clientHeight + window.scrollY >=
  (document.documentElement.scrollHeight || document.documentElement.clientHeight)

const autoHide = () => {
  console.log(bottomVisible())
  showing.value = !bottomVisible() ? true : false
}

onMounted(() => {
  window.addEventListener('scroll', autoHide)
})
</script>
