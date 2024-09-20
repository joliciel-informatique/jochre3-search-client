<template>
  <div class="box table-of-contents">
    <aside class="menu p-2 my-3">
      <p class="menu-label">Table of Contents</p>
      <ul class="menu-list">
        <li class="px-2" v-for="(result, index) of searchResults" :key="result">
          <div class="grid">
            <a @click="scrollTo(result.docRef)">
              <p class="cell is-size-7">{{ index + 1 }}|</p>
              <p class="cell is-size-7 is-col-min-2">
                {{
                  preferences.language === 'en'
                    ? result.metadata.titleEnglish
                    : result.metadata.title
                }}

                ({{
                  preferences.language === 'en'
                    ? result.metadata.authorEnglish ?? $t('results.result-unknown-author')
                    : result.metadata.author ?? $t('results.result-unknown-author')
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
import { type Ref } from 'vue'
const preferences = usePreferencesStore()

const searchResults: Ref = defineModel('searchResults')

const scrollTo = (docRef: string) => {
  const pos = document.getElementById(docRef)
  if (pos) {
    console.log(pos.offsetTop)
    // var bodyRect = document.body.getBoundingClientRect(),
    // elemRect = pos.getBoundingClientRect(),
    // offset   = elemRect.top - bodyRect.top;
    // console.log(pos.offsetTop, offset)
    window.scrollTo({ top: pos.offsetTop, behavior: 'smooth' })
  }
}
</script>
