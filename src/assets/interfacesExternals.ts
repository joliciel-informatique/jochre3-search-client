import type { ShallowRef } from 'vue'

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
  ref: ShallowRef
}

export interface Preferences {
  language: string
  resultsPerPage: number
  snippetsPerResult: number
  $i18n: {}
}

export interface SearchResult {
  [index: string]: string | Metadata | Snippet[]
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

export interface Metadata {
  [index: string]: string | string[] | undefined
  title?: string
  author?: string
  titleEnglish?: string
  authorEnglish?: string
  publicationYear?: string
  publisher?: string
  volume?: string
  url?: string
  collections?: Array<string>
}

export interface Highlight {
  start: number
  end: number
}

export interface HighlightedPage {
  physicalPageNumber: number
  logicalPageNumber?: number
  highlights?: Highlight[]
  text: string
}

export interface HighlightedDocument {
  title: string
  pages: HighlightedPage[]
}

export interface SearchError {
  code: string
  message: string
}
