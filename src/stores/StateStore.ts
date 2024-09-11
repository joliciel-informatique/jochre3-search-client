import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStateStore = defineStore('state', () => {
  // App is loading
  const isLoading = ref(false)
  const notLoading = () => (isLoading.value = false)
  const loading = () => (isLoading.value = true)

  const hasSearch = ref(false)
  const hasNoSearchParams = () => (hasSearch.value = false)
  const hasSearchParams = () => (hasSearch.value = true)

  const query = ref('')
  const page = ref(1)
  const title = ref('')
  const fromYear = ref(0)
  const toYear = ref(0)
  const docRefs = ref('')
  const relatedWordForms = ref(false)
  const sortBy = ref('Score')
  const authorList = ref([])
  const showAdvancedSearchPanel = ref(false)

  const resetSearchResults = () => {
    query.value = ''
    notLoading
    hasSearch.value = false
    facets.value = []
    searchResults.value = []

    page.value = 1
    title.value = ''
    fromYear.value = 0
    toYear.value = 0
    docRefs.value = ''
    relatedWordForms.value = false
    sortBy.value = 'Score'
    authorList.value = []
    showAdvancedSearchPanel.value = false

    window.history.replaceState({}, document.title, '/')
  }

  // page.value = 1
  // title.value = ''
  // fromYear.value = 0
  // toYear.value = 0
  // docRefs.value = ''
  // relatedWordForms.value = false
  // sortBy.value = 'Score'
  // authorList.value = []
  // showAdvancedSearchPanel.value = false

  return { isLoading, notLoading, loading, hasSearch }
})
