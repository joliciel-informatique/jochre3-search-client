import type { HighlightedDocument } from '@/assets/interfacesExternals'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { fetchData } from '@/assets/fetchMethods'
import { mostFrequentUsingMap } from '@/assets/functions'

export const useBookStore = defineStore('bookStore', () => {
  const bookData = ref<boolean | HighlightedDocument>(false)
  const docRef = ref('')
  const query = ref()
  const page = ref('1')
  const book = ref()
  const strict = ref(false)
  const firstIndexedPage = ref()
  const isLoading = ref(true)
  const pagesWithHighlights: Ref<number[]> = ref([])

  const defineSearchParams = () => {
    return Object.assign(
      {},
      query.value?.length ? { query: query.value.trim() } : null,
      strict.value.toString() !== null ? { strict: strict.value.toString() } : null
    )
  }

  const updateText = async () => {
    const params = new URLSearchParams(defineSearchParams())
    params.append('doc-ref', docRef.value)
    params.append('text-as-html', 'true')

    const res = await fetchData('highlighted-text', 'get', params).catch((err) => console.log(err))

    if (res && res.ok) {
      bookData.value = await res.json()
      const highlightedBook = bookData.value as HighlightedDocument
      if (highlightedBook.pages.length) {
        // Find the lowest physical page number
        firstIndexedPage.value = Math.min(
          ...highlightedBook.pages.map((page) => page.physicalPageNumber)
        )

        // A hacky way to fix incorrect logical page numbers based on most common difference between assigned logical and physical numbers
        const overallOffset = highlightedBook.pages.map(
          (p) => p.physicalPageNumber - (p.logicalPageNumber ?? 0)
        )
        const offset = mostFrequentUsingMap(overallOffset)
        if (offset) {
          highlightedBook.pages.forEach(
            (page) => (page.logicalPageNumber = page.physicalPageNumber - offset)
          )
        }

        pagesWithHighlights.value = []
        highlightedBook.pages.forEach((page) => {
          if (page.highlights && page.highlights.length > 0) {
            pagesWithHighlights.value.push(page.physicalPageNumber)
          }
        })
      }

      book.value = highlightedBook
    } else {
      book.value = false
    }
  }

  return {
    book,
    docRef,
    query,
    strict,
    page,
    isLoading,
    firstIndexedPage,
    pagesWithHighlights,
    updateText
  }
})
