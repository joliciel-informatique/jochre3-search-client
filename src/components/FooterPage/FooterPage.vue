<template>
  <footer
    class="footer has-text-white mt-auto header-footer-content"
    :class="{
      'rtl-align': !preferences.displayLeftToRight,
      yiddish: !preferences.displayLeftToRight
    }"
  >
    <Transition name="slide-up" mode="out-in">
      <div v-if="totalHits">
        <FooterNavigation
          @newPage="emit('newPage')"
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
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const FooterDefault = defineAsyncComponent(() => import('./FooterDefault/FooterDefault.vue'))
const FooterNavigation = defineAsyncComponent(
  () => import('./FooterNavigation/FooterNavigation.vue')
)

const preferences = usePreferencesStore()

const emit = defineEmits(['newPage', 'resetSearchResults'])
const showFooterNavigation = ref(false)

const totalHits = defineModel('totalHits')
const page = defineModel('page')

/** Autohide footerbar upon scrolling */
const bottomVisible = () =>
  document.documentElement.clientHeight + window.scrollY >=
  (document.documentElement.scrollHeight || document.documentElement.clientHeight)

const hasScrollBar = () => document.body.scrollHeight > window.innerHeight

const autoHide = () =>
  (showFooterNavigation.value = hasScrollBar() && bottomVisible() ? false : true)

onMounted(() => window.addEventListener('scroll', autoHide))
</script>
