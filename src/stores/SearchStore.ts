import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', () => {
  const page = ref(1)
  const hasSearch = ref(false)
  const isLoading = ref(false)

  return { page, hasSearch, isLoading }
})
