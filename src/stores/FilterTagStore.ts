import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStateStore = defineStore('tagStore', () => {
  const filterTags = ref([])

  return { filterTags }
})
