import { computed } from "vue"
// import { useRoute, useRouter } from "vue-router"
import { type SearchResult } from "@/assets/interfacesExternals"
import { facets, searchResults, images, totalHits, query, page, title, fromYear, toYear, docRefs, relatedWordForms, sortBy, updateHistory } from "./SearchPage-variables"
import { isBusy, hasSearch, showAdvancedSearchPanel, showErrorNotification } from "@/assets/appState"
import { fetchData, preferences } from "@/assets/fetchMethods"
import { authorList } from "@/_components/FindAuthors/FindAuthors-variables"
import { authors, authorInclude } from "@/_components/FindAuthors/FindAuthors-methods"

import { params } from "./SearchPage-variables"

const strict = computed(() => !relatedWordForms.value)

export const resetResults = () => {
    query.reset()
    page.set(1)
    title.set('')
    fromYear.set(0)
    toYear.set(0)
    docRefs.set('')
    relatedWordForms.true()
    sortBy.set('Score')
    authors.empty()
    showAdvancedSearchPanel.false()
    showErrorNotification.false()
    search()
}

export const newSearch = () => {
    console.log(authorList.value)
    page.set(1)
    showErrorNotification.false()
    search()
}

export const updateSearch = (facet: string) => {
    console.log(facet)
    // authors.add(facet)
    // authorInclude.true()
    // newSearch()
}

export const defineSearchParams = () => Object.assign(
    {},
    query.value.length ? { query: query.value.trim() } : null,
    strict.value.toString() !== null ? { strict: strict.value.toString() } : null,
    authorInclude.value.length ? { 'author-include': authorInclude.value } : null,
    page.value > 0 ? { page: page.value.toString() } : null,
    title.value.trim().length > 0 ? { title: title.value.trim() } : null,
    toYear.value != null && toYear.value > 0 ? { 'to-year': toYear.value.toString() } : null,
    fromYear.value != null && fromYear.value > 0 ? { 'from-year': fromYear.value.toString() } : null,
    authors.value.length ? { 'authors' : authors.value } : null,
    docRefs.value.length ? { 'doc-refs' : docRefs.value.split(/\W+/) } : null
)

export const search = () => {
    updateHistory.true()
    hasSearch.value =
        query.value.length > 0 ||
        authors.value.length > 0 ||
        title.value.length > 0 ||
        (fromYear.value != null && fromYear.value > 0) ||
        (toYear.value != null && toYear.value > 0) ||
        docRefs.value.length > 0

    if (hasSearch.value) {
        isBusy.true()
        // const params = new URLSearchParams(defineSearchParams())  
        const facetParams = new URLSearchParams({ ...Object.fromEntries(params) })

        params.append('first', ((page.value - 1) * preferences.resultsPerPage).toString())
        params.append('max', preferences.resultsPerPage.toString())
        params.append('sort', sortBy.value.trim())
        params.append('max-snippets', preferences.snippetsPerResult.toString())
        params.append('row-padding', '2')

        facets.empty()

        fetchData('search', 'get', params)
        .then((response) => response.json()
        .then(({results, totalCount}) => {
            
            // if (updateHistory) updateUrl()
            authors.add(results.map((result: SearchResult) => result.metadata.author))
            hasSearch.true()
            isBusy.false(),
            searchResults.value = results
            totalHits.set(totalCount)
            images.reset()
        }))
        .catch((error) => {
            console.error(error)
            ;(showErrorNotification.true()), (isBusy.false())
        })

        if (authors.value.length != 1) {
        facetParams.append('field', 'Author')
        facetParams.append('maxBins', '10')
        fetchData('aggregate', 'get', facetParams)
            .then((response) => response.json()
            .then((result) => facets.value = result.bins))
            .catch((error) => console.error(error))
        }
    } else {
        searchResults.empty()
        totalHits.reset()
        images.reset()
    }
    updateHistory.false()
}