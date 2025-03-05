import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFilterTagStore = defineStore('tagStore', () => {
  const filterTags = ref([])

  return { filterTags }
})
