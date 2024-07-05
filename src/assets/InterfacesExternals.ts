export default interface Snippet {
  text: string
  page: number
  start: number
  end: number
  highlights: number[][]
  deepLink: string
  key: string
}

export default interface SizeResponse {
  size: number
}

export interface SearchResult {
  docRef: string
  metadata: Metadata
  snippets: Snippet[]
}

export default interface SearchResponse {
  results: SearchResult[]
  totalCount: number
}

export interface AggregationBin {
  label: string
  count: number
}

export default interface AggregationBins {
  bins: AggregationBin[]
}

export default interface WordText {
  text: string
}

export default interface UserPreferences {
  language: string
  resultsPerPage: number
  snippetsPerResult: number
}


interface Metadata {
  title: string
  author: string
  titleEnglish: string
  authorEnglish: string
  publicationYear: string
  publisher: string
  volume: string
  url: string
}
