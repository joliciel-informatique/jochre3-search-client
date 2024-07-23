import { authorList, authorText, authorDropdownItems } from "./FindAuthors-variables"
import { fetchData } from "@/assets/fetchMethods"
import { reactive } from "vue"

export const delAuthor = (value: string) => authorList.del(value)

export const findAuthors = () => {
    if (authorText.value.length > 0) {
        const params: URLSearchParams = new URLSearchParams({
            'prefix': authorText.value,
            'maxBins': '10'
        })
        fetchData('authors', 'get', params)
        .then((response) => response.json().then((result) => {
            authorDropdownItems.replace(result.bins)
        }))

    } else {
        authorDropdownItems.reset()
    }
}

export const addAuthor = (author: { label: string, count : number }) => {
    authorList.add(author)
    authorText.value = ''
    authorDropdownItems.reset()
}

export const authors = reactive({
    value: new Array<string>(),
    add(value: string) { this.value.push(value) },
    del(value: string) { 
        const index = this.value.indexOf(value, 0)
        if (index > -1) {
            this.value.splice(index, 1) 
        }
    },
    empty() { this.value = [] }
})

export const authorInclude = reactive({
    value: 'false',
    true() { this.value = 'true' },
    false() { this.value = 'false' }
})