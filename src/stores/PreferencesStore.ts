import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePreferencesStore = defineStore('preferences', () => {
  const show = ref(false)
  const storePreferencesInCookie = ref(true)
  const language = ref('yi')
  const resultsPerPage = ref(10)
  const snippetsPerResult = ref(20)
  const authorFacetCount = ref(10)
  const corpusLanguage = ref('yi')
  const displayPerBook = ref(true)
  const updateFacetSortOption = ref('hits')

  const displayLeftToRight = computed(() => language.value !== 'yi')

  const corpusLeftToRight = computed(() => corpusLanguage.value !== 'yi')

  /**
   * Called by non top-level controls which are ALWAYS left-to-right (e.g. alternate author name)
   * Returns true if we need to add an explicit LTR class to a control.
   */
  const needsLeftToRight = computed(() => !displayLeftToRight.value)

  /**
   * Called by non top-level controls which are right-to-left IF the underlying corpus is right-to-left.
   *
   * Returns true if we need to add an explicit RTL class to a control.
   */
  const needsRightToLeft = computed(() => !corpusLeftToRight.value && displayLeftToRight.value)

  return {
    show,
    storePreferencesInCookie,
    language,
    resultsPerPage,
    snippetsPerResult,
    authorFacetCount,
    corpusLanguage,
    displayLeftToRight,
    needsLeftToRight,
    needsRightToLeft,
    corpusLeftToRight,
    displayPerBook,
    updateFacetSortOption
  }
})
