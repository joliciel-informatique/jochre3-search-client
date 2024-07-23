import { fetchData } from "@/assets/fetchMethods"
import { word, fixWordVisible, docRef, wordOffset, cachedImages } from "./FixWord-variables"

export const loadWordImage = (ref : string, page : number, offset: number) => {
    const img = cachedImages.find(ref, page, offset)
    console.log(img, ref, page, offset)
}
export const cacheWordImages = (ref : string, page : number, highlights : number[][]) => {
    highlights.forEach(highlight => {
        const params : URLSearchParams = new URLSearchParams({ 'doc-ref' : ref, 'word-offset' : highlight[0].toString() })

        fetchData('word-image', 'get', params, 'image/png', 'arraybuffer')
        .then(response => (response.status === 200) ? response.arrayBuffer()
        .then(buffer => 
            cachedImages.add({ 
                docRef : ref,
                page : page,
                offset : highlight[0], 
                image : `data:${response.headers.get('content-type')};base64,${btoa(Array.from(new Uint8Array(buffer)).map((b) => String.fromCharCode(b)).join(''))}` 
        })) : null)
    })
}
  
export const onSubmit = () => {
    const data = JSON.stringify({
        'docRef' : docRef.value,
        'offset' : +wordOffset.value,
        'suggestion': word.value
    })

    fetchData('suggest-word', 'post', data, 'application/json')
    .then(response => (response.status === 200) ? closeModal('success') : closeModal('fail'))
    .catch(error => closeModal('fail', error))
} 
  
export const closeModal = (message : string, error? : any) => {
    console.log(message, error)
    fixWordVisible.false()
}
  
export const onCancel = () => {
    fixWordVisible.false()
}