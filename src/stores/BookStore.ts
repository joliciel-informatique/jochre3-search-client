import { type HighlightedDocument } from '@/assets/interfacesExternals'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authenticated, fetchData } from '@/assets/fetchMethods'
import { mostFrequentUsingMap } from '@/assets/functions'

export const useBookStore = defineStore('bookStore', () => {
  const docRef = ref('')
  const query = ref()
  const page = ref('1')
  const book = ref<HighlightedDocument>()
  const strict = ref(false)
  const firstIndexedPage = ref()
  const isLoading = ref(true)
  const pagesWithHighlights = ref<Array<number>>([]) // index = highlight, value = pagenumber

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
    const url = authenticated ? 'highlighted-text' : 'highlighted-text-no-auth'
    const res = await fetchData(url, 'get', params).catch((err) => console.log(err))

    if (res && res.ok) {
      book.value = await res.json()
      const highlightedBook = book.value as HighlightedDocument
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
            page.highlights.forEach(() => pagesWithHighlights.value.push(page.physicalPageNumber))
          }
        })
      }

      book.value = highlightedBook
    } else {
      book.value = undefined
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
