<template>
  <footer
    class="footer has-text-white mt-auto header-footer-content"
    :class="{
      'rtl-align': !preferences.displayLeftToRight
    }"
  >
    <Transition name="slide-up" mode="out-in">
      <div v-if="!totalHits">
        <FooterDefault />
      </div>
    </Transition>
  </footer>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FooterDefault from './FooterDefault/FooterDefault.vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

const showFooterNavigation = ref(false)
const totalHits = defineModel('totalHits')

/** Autohide footerbar upon scrolling */
const bottomVisible = () =>
  document.documentElement.clientHeight + window.scrollY >=
  (document.documentElement.scrollHeight || document.documentElement.clientHeight)

const hasScrollBar = () => document.body.scrollHeight > window.innerHeight

const autoHide = () =>
  (showFooterNavigation.value = hasScrollBar() && bottomVisible() ? false : true)

onMounted(() => window.addEventListener('scroll', autoHide))
</script>
