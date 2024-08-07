<template>
  <transition name="slide-in">
    <FooterNavigation
      @search="search"
      @resetSearchResults="resetSearchResults"
      :query="query"
      :searchResults="searchResults"
      v-model:page="page"
      v-model:totalHits="totalHits"
    />
  </transition>
  <transition name="slide-out">
    <footer
      class="footer has-text-white has-background-primary has-text-weight-semibold mt-auto header-footer-content"
      v-show="searchResults !== undefined && !searchResults.length"
    >
      <div class="columns">
        <div class="column">
          {{ $t('footer.powered-by') }}
          <a href="https://github.com/urieli/jochre/" target="_blank">
            <img
              src="/images/jochreLogo.png"
              style="width: 150px; border: none"
              :alt="$t('Jochre')"
            />
          </a>
        </div>
        <div class="column" v-html="$t('footer.credits')"></div>
        <div class="column">
          <div v-html="$t('footer.credits-column-2')"></div>
          <div v-html="$t('footer.privacy')"></div>
        </div>
      </div>
    </footer>
  </transition>
</template>
<script setup lang="ts">
import type { SearchResult } from '@/assets/interfacesExternals'
import FooterNavigation from './FooterNavigation/FooterNavigation.vue'
const { query, search, resetSearchResults } = defineProps(['query', 'search', 'resetSearchResults'])
const page = defineModel('page')
const totalHits = defineModel('totalHits')
const searchResults = defineModel<Array<SearchResult>>('searchResults')
</script>
<style scoped>
.slide-in-enter-active,
.slide-in-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.slide-in-enter-from,
.slide-in-leave-to {
  opacity: 0;
}

.slide-out-enter-active,
.slide-out-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-out-enter-from,
.slide-out-leave-to {
  transform: translateY(4rem);
  opacity: 0;
}
</style>
