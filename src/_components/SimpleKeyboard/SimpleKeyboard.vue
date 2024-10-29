<template>
  <div class="keyboardClass" v-show="simpleKeyboard.show"></div>
  <div
    class="keyboardOverlay"
    v-show="simpleKeyboard.show"
    :id="`${attachTo}-keyboardOverlay`"
  ></div>
</template>
<script setup lang="ts">
import { onMounted, watch, type Ref } from 'vue'
import { type SimpleKeyboardType } from '@/assets/interfacesExternals'
import Keyboard, { SimpleKeyboard } from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
import keyboardYiddish from '@/assets/keyboardLayouts/keyboardYiddish'
import keyboardMobile from '@/assets/keyboardLayouts/keyboardMobile'

const { attachTo } = defineProps(['attachTo']) // The id of the HTML element it's attached to
const simpleKeyboard: Ref = defineModel<SimpleKeyboardType>('simpleKeyboard')

let keyboard: SimpleKeyboard

watch(
  simpleKeyboard,
  (newSimpleKeyboard) => {
    const iname = newSimpleKeyboard.attachTo
    keyboard.setOptions({ iname })

    // Position keyboard relative to element
    positionKeyboard()

    // Add eventListeners if keyboard opened, else remove eventListeners
    const el = document.getElementById(iname)
    if (newSimpleKeyboard.show) {
      addEventListeners()
      el?.classList.add('keyboard-is-open')
    } else {
      removeEventListeners()
      el?.classList.remove('keyboard-is-open')
    }
  },
  { deep: true }
)

const toggleKeyboard = () => (simpleKeyboard.value.show = !simpleKeyboard.value.show)

const switchLayout = (button: string) => {
  const layouts = ['default', 'numbers', 'shift', 'alt', 'chars']
  const targetLayout = button.substring(1, button.length - 1)
  const currentLayout = keyboard.options.layoutName
  const isValidLayout =
    layouts.filter((layout) => targetLayout.toLowerCase().includes(layout)).length !== 0
  if (!isValidLayout) return false
  const defaultKeyboard = currentLayout?.includes('mobile') ? 'keyboardMobile' : 'default'
  const layout = currentLayout === targetLayout ? defaultKeyboard : targetLayout
  keyboard.setOptions({ layoutName: layout })
  return true
}

const onKeyPress = (button: string) => {
  const el = document.getElementById(simpleKeyboard.value.attachTo) as HTMLInputElement // input element

  if (!switchLayout(button)) {
    let newVal = ''
    if (button === '{bksp}') {
      newVal = el.value.slice(0, -1)
    } else if (button === '{enter}') {
      newVal = el.value
      simpleKeyboard.value.show = false
    } else {
      newVal = `${el.value}${button}`
    }
    simpleKeyboard.value.ref.value = newVal
  }
}

const positionKeyboard = () => {
  const parent = document.getElementById(simpleKeyboard.value.attachTo)?.getBoundingClientRect()
  if (parent) {
    const { top, left, width, height } = parent as DOMRect
    const container = document.getElementsByClassName('keyboardClass')[0] as HTMLDivElement
    container.setAttribute('style', `top:${top + height}px;left:${left}px;width:${width - 2}px`)
  }
}

const addEventListeners = () => {
  document.addEventListener('click', closeOutside, true)
  document.addEventListener('keydown', closeOnEscape, true)
}

const removeEventListeners = () => {
  document.removeEventListener('click', closeOutside, true)
  document.removeEventListener('keydown', closeOnEscape, true)
}

const closeOutside = (e: MouseEvent) => {
  const keyboardClass = document.querySelector('.keyboardClass')
  const keyboardButton = document.getElementById(simpleKeyboard.value.attachTo)?.parentElement
    ?.nextElementSibling
  if (
    e.target instanceof Element &&
    !keyboardButton?.contains(e.target) &&
    !keyboardClass?.contains(e.target)
  ) {
    toggleKeyboard()
    document.removeEventListener('click', closeOutside, true)
  }
}

const closeOnEscape = (e: KeyboardEvent) => {
  e.key === 'Escape' ? toggleKeyboard() : null
  document.removeEventListener('keydown', closeOnEscape, true)
}

onMounted(() => {
  keyboard = new Keyboard('keyboardClass', {
    layoutName: 'default',
    inputName: attachTo,
    onKeyPress: onKeyPress,
    ...keyboardYiddish,
    rtl: true,
    autoUseTouchEvents: true
  })
})
</script>
