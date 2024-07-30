import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePreferencesStore = defineStore('preferences', () => {
  const language = ref('yi')
  const resultsPerPage = ref(10)
  const snippetsPerResult = ref(20)

  return { language, resultsPerPage, snippetsPerResult }
})
