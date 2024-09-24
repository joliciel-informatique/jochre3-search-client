export interface Snippet {
  text: string
  page: number
  start: number
  end: number
  highlights: number[][]
  deepLink: string
  key: string
}

export interface SizeResponse {
  size: number
}

export interface BookPages {
  page: number
  label: string
  logicalNumber: number
}

export interface SimpleKeyboardType {
  show: boolean
  attachTo: string
  input: string
}

export interface Preferences {
  language: string
  resultsPerPage: number
  snippetsPerResult: number
  $i18n: {}
}

export interface SearchResult {
  docRef: string
  metadata: Metadata
  snippets: Snippet[]
}

export interface SearchResponse {
  results: SearchResult[]
  totalCount: number
}

export interface AggregationBin {
  label: string
  count: number
  active: boolean
}

export interface AggregationBins {
  bins: AggregationBin[]
}

export interface WordText {
  text: string
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
