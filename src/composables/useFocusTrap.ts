// Adapted from https://www.telerik.com/blogs/how-to-trap-focus-modal-vue-3

import { customRef } from 'vue'

const focusableElementsSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

const useFocusTrap = () => {
  let focusableElements: Array<Element> = []
  let $firstFocusable: HTMLElement
  let $lastFocusable: HTMLElement
  const trapRef = customRef((track, trigger) => {
    let $trapEl: HTMLElement | null = null
    return {
      get() {
        track()
        return $trapEl
      },
      set(value) {
        $trapEl = value
        value ? initFocusTrap() : clearFocusTrap()
        trigger()
      }
    }
  })

  function keyHandler(e: KeyboardEvent) {
    const isTabPressed = e.key === 'Tab'

    if (!isTabPressed) return

    if (e.shiftKey) {
      if (document.activeElement === $firstFocusable) {
        $lastFocusable.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === $lastFocusable) {
        $firstFocusable.focus()
        e.preventDefault()
      }
    }
  }

  function initFocusTrap() {
    // Bail out if there is no value
    if (!trapRef.value) return
    focusableElements = Array.from(trapRef.value.querySelectorAll(focusableElementsSelector))
    $firstFocusable = focusableElements[0] as HTMLElement
    $lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement
    document.addEventListener('keydown', keyHandler)
    $firstFocusable.focus()
  }

  function clearFocusTrap() {
    document.removeEventListener('keydown', keyHandler)
  }

  return {
    trapRef,
    initFocusTrap,
    clearFocusTrap
  }
}

export default useFocusTrap
