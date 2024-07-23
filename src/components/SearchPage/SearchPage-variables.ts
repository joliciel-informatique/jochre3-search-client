import { reactive } from 'vue'
import { type AggregationBin, type SearchResult } from '@/assets/interfacesExternals'

import { defineSearchParams } from './SearchPage-methods'

export const authorDropdownItems = reactive({
    value: new Array<string>(),
    add(value: string) { this.value.push(value) },
    replace(value: Array<string>, field: string|any|undefined) { (field === undefined) ? this.value = value : value.map(val => val[field]) },
    del(value: string) { 
        const index = this.value.indexOf(value, 0)
        if (index > -1) {
            this.value.splice(index, 1) 
        }
    },
    empty() { this.value = [] }
})

export const updateHistory = reactive({
    value: false,
    true() { this.value = true },
    false() { this.value = false }
})

export const query = reactive({
    value: '',
    set(value: string) { this.value = value },
    reset() { this.value = ''}
})

export const relatedWordForms = reactive({
    value: true,
    true() { this.value = true },
    false() { this.value = false }
})

export const page = reactive({
    value: 1,
    set(value: number) { this.value = value },
    increment() { 
        this.value++ 
        return this.value
    },
    decrement() {
        this.value--
        return this.value
    }
})

export const totalHits = reactive({
    value: 0,
    set(value: number) { this.value = value },
    reset() { this.value = 0 }
})

export const title = reactive({
    value: 'Enter a title',
    set(value: string) { this.value = value },
    reset() { this.value = ''}
})

export const fromYear = reactive({
    value: 1700,
    set(value: number) { this.value = value },
    str() { return this.value.toString()}
})

export const toYear = reactive({
    value: 2000,
    set(value: number) { this.value = value },
    str() { return this.value.toString()}
})

export const docRefs = reactive({
    value: '',
    set(value: string) { this.value = value },
    reset() { this.value = ''}
})

export const sortBy = reactive({
    value: 'Score',
    set(value: string) { this.value = value },
    reset() { this.value = ''}
})

export const searchResults = reactive({
    value: <SearchResult[]>[],
    empty() { this.value = [] }
})

export const facets = reactive({
    value: <AggregationBin[]>[],
    empty() { this.value = [] }
})

export const images = reactive({
    value: new Map(),
    reset() { this.value = new Map()}
})

export const imageBusy = reactive({
    value: new Set()
})

export const params = new URLSearchParams(defineSearchParams())