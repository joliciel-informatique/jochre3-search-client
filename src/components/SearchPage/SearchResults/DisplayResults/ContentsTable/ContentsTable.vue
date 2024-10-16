<template>
  <div class="box table-of-contents" role="navigation" tabindex="1">
    <aside class="menu p-2 my-3">
      <p class="menu-label">{{ $t('results.contents-table-header') }}</p>
      <ul class="menu-list">
        <li class="px-2" v-for="(result, index) of searchResults" :key="result">
          <div class="grid">
            <a @click="scrollTo(result.docRef)" @keyup.enter="scrollTo(result.docRef)" tabindex="0">
              <p class="cell is-size-4">{{ index + pageNumberOffset }}|</p>
              <p class="cell is-size-5 is-col-min-2">
                {{ result.metadata.title }} ({{
                  result.metadata.author ?? $t('results.result-unknown-author')
                }})
              </p>
            </a>
          </div>
        </li>
      </ul>
    </aside>
  </div>
</template>
<script setup lang="ts">
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { computed, type Ref } from 'vue'
const preferences = usePreferencesStore()

const searchResults: Ref = defineModel('searchResults')
const page: Ref = defineModel('page')

const pageNumberOffset = computed(() => (page.value - 1) * preferences.resultsPerPage + 1) // Same line as in SearchInfo: firstResult

const scrollTo = (docRef: string) => {
  const pos = document.getElementById(docRef)
  if (pos) {
    window.scrollTo({ top: pos.offsetTop, behavior: 'smooth' })
  }
}
</script>
