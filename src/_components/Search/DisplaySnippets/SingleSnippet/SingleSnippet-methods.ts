import { images, imageBusy } from '@/components/SearchPage/SearchPage-variables'
import { fetchData } from '@/assets/fetchMethods';
import { docRef, fixWordVisible, wordOffset, word, wordImage, cachedImages } from '@/_components/Modals/FixWord/FixWord-variables';

export const toggleImageSnippet = (
    docRef: string,
    reference: string,
    snippetStart: number,
    snippetEnd: number,
    highlights: []) => {
  if (images.value.has(reference)) {
    console.log(`Deleting image ${reference}`)
    images.value.delete(reference)
  } else {
    console.log(`Creating image ${reference}`)
    imageBusy.value.add(reference)

    const params: URLSearchParams = new URLSearchParams({
      'doc-ref': docRef,
      'start-offset': `${snippetStart}`,
      'end-offset': `${snippetEnd}`
    })

    highlights.forEach((highlight: Array<Number>) => {
      params.append('highlight', `[${highlight[0]},${highlight[1]}]`)
    })

    fetchData('image-snippet', 'get', params, 'image/png', 'arraybuffer')
      .then((response) => response.status === 200 ? response.arrayBuffer()
      .then((buffer) => {
              images.value.set(
                reference,
                `data:${response.headers.get('content-type')};base64,${btoa(String.fromCharCode(...new Uint8Array(buffer)))}`
              )
              imageBusy.value.delete(reference)
            })
      : null)
      .catch((error) => {
        console.error(error)
        imageBusy.value.delete(reference)
      })
  }
}

export const getSelectedWord = (ref: string, page : number, snippet: string) => {
    const sel = window.getSelection()
    if (sel && sel.anchorNode) {

        const div1 = document.createElement('div');
        div1.innerHTML = snippet.trim();

        // Get the parent span
        let parentElement = sel.anchorNode

        while (parentElement.nodeType != Node.ELEMENT_NODE) {
          parentElement = parentElement.parentNode as ParentNode
        }

        let parentSpan = parentElement as HTMLElement
        while (parentSpan.tagName != 'SPAN') {
          parentSpan = parentSpan.parentElement as HTMLElement
        }

        if (parentSpan.tagName === 'SPAN') {

          const offset = parentSpan.getAttribute('offset') ?? '0'

          docRef.set(ref)
          wordOffset.set(parseInt(offset))

          // Pull the image from the cache
          const img : { docRef : string, page : number, offset : number, image : string } | undefined = cachedImages.find(ref, page, wordOffset.value)
          if (img !== undefined) {

            // Pull text from the DOM-cached snippet
            wordImage.set(img.image)
            
            const selectedWord = div1.querySelector(`span[offset="${wordOffset.value}"]`)
            
            if (selectedWord !== null && selectedWord.textContent !== null) {
              word.value = selectedWord.textContent
            }

          } else {

            // Else set selected text
            if (sel.anchorNode.textContent) {
              word.value = sel.anchorNode.textContent.substring(sel.anchorOffset, sel.focusOffset).trim()
              wordImage.set('')
            }

          }
          fixWordVisible.true() // Show modal
        }
    }
}