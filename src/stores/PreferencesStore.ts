import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePreferencesStore = defineStore('preferences', () => {
  const language = ref('yi')
  const resultsPerPage = ref(10)
  const snippetsPerResult = ref(20)
  const corpusLanguage = ref('yi')

  const isLeftToRight = computed(() => language.value !== 'yi')

  /**
   * Called by non top-level controls which are ALWAYS left-to-right (e.g. alternate author name)
   * Returns true if we need to add an explicit LTR class to a control.
   */
  const needsLeftToRight = computed(() => !isLeftToRight.value)

  /**
   * Called by non top-level controls which are right-to-left IF the underlying corpus is right-to-left.
   *
   * Returns true if we need to add an explicit RTL class to a control.
   */
  const needsRightToLeft = computed(() => corpusLanguage.value === 'yi' && isLeftToRight.value)

  return {
    language,
    resultsPerPage,
    snippetsPerResult,
    corpusLanguage,
    isLeftToRight,
    needsLeftToRight,
    needsRightToLeft
  }
})
