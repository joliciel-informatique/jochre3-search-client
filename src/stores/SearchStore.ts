import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { usePreferencesStore } from '@/stores/PreferencesStore'

export const useSearchStore = defineStore('search', () => {
  const preferences = usePreferencesStore()
  const page = ref<number>(1)
  const totalHits = ref<number>(0)

  const firstResult = computed(() => (page.value - 1) * preferences.resultsPerPage + 1)
  const lastResult = computed(() => {
    const last = page.value * preferences.resultsPerPage
    return totalHits.value < last ? totalHits.value : last
  })

  const lastPage = computed(
    () => Math.floor((totalHits.value - 1) / preferences.resultsPerPage) + 1
  )

  return { page, totalHits, firstResult, lastResult, lastPage }
})
