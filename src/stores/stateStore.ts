import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useStateStore = defineStore('state', () => {
  const atTop = ref(true)

  watch(atTop, (newV) => {
    const snippetDiv = document.getElementsByClassName('scrollBody')
    if (snippetDiv) {
      newV
        ? snippetDiv[0].scrollTo({ top: 0, behavior: 'instant' })
        : snippetDiv[0].scrollTo({
            top: snippetDiv[0].scrollHeight,
            behavior: 'instant'
          })
    }
  })

  return { atTop }
})
