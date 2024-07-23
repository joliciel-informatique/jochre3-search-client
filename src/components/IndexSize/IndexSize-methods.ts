import { fetchData } from "@/assets/fetchMethods"
import { isBusy } from "@/assets/appState"
import { indexSize } from "@/components/IndexSize/IndexSize-variables"

export const getIndexSize = () => {
    fetchData('size', 'get', undefined, 'json').then((response) => {
      response.json().then((result) => {
        indexSize.set(result.size)
        isBusy.false()
      })
    })
}  