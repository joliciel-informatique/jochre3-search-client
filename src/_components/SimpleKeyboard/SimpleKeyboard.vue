<template>
  <p class="control keyboardButton" :id="`${attachTo}-keyboard`">
    <button
      class="button is-clickable is-info"
      @click="toggleKeyboard()"
      :alt="$t('search.keyboard')"
      :title="$t('search.keyboard')"
    >
      <span>
        <font-awesome-icon :icon="faKeyboard" />
      </span>
    </button>
  </p>

  <div class="keyboard" :id="`${attachTo}-keyboardClass`" v-show="openKeyboard">
    <div class="keyboardClass"></div>
  </div>
  <div class="keyboardOverlay" :id="`${attachTo}-keyboardOverlay`"></div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faKeyboard } from '@fortawesome/free-solid-svg-icons'
import Keyboard, { SimpleKeyboard } from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
import keyboardYiddish from '@/assets/keyboardLayouts/keyboardYiddish'
import keyboardMobile from '@/assets/keyboardLayouts/keyboardMobile'
import { onMounted, ref, watch } from 'vue'

const { attachTo } = defineProps(['attachTo']) // The id of the HTML element it's attached to
const value = defineModel('value', { type: String, default: '' }) // The variable that controls the input value
const openKeyboard = defineModel('openKeyboard')
let keyboard: SimpleKeyboard

watch(value, (newVal, oldVal) => {
  // console.log(newVal)
  // console.log(oldVal)
  // console.log(keyboard.getInput())
  keyboard.setInput(newVal ?? '')
})

const onChange = (input: string) => {
  const el = document?.getElementById(attachTo) as HTMLInputElement
  // console.log(input)

  if (el as HTMLInputElement) {
    const selectedText = el.value.substring(el.selectionStart ?? 0, el.selectionEnd ?? 0)
    if (selectedText.length) {
      input = input.replace(selectedText, input)
    }
    // console.log('selected', selectedText)
    // console.log('input', input)
    // console.log(keyboard.getInput())
    el.value = input
    keyboard.setInput(input)
    value.value = keyboard.getInput()
    // console.log(value.value)
  }
}

const switchLayout = (button: string) => {
  const layouts = ['default', 'numbers', 'shift', 'alt', 'chars']
  const targetLayout = button.substring(1, button.length - 1)
  const currentLayout = keyboard.options.layoutName
  const isValidLayout =
    layouts.filter((layout) => targetLayout.toLowerCase().includes(layout)).length !== 0
  if (!isValidLayout) return false
  console.log('layout button')
  const defaultKeyboard = currentLayout?.includes('mobile') ? 'keyboardMobile' : 'default'
  const layout = currentLayout === targetLayout ? defaultKeyboard : targetLayout
  keyboard.setOptions({ layoutName: layout })
}

const onKeyPress = (button: string) =>
  !switchLayout(button) && button === '{bksp}'
    ? keyboard.setInput(keyboard.getInput().slice(0, -1))
    : null

watch(openKeyboard, (newVal) => {
  if (newVal) positionKeyboard()
  document
    .getElementById(`${attachTo}-keyboardOverlay`)
    ?.setAttribute('style', `z-index:${newVal ? '1' : '-1'}`)
  document.getElementById(attachTo)?.setAttribute('style', `z-index:${newVal ? '2' : '1'}`)
})

const toggleKeyboard = () => (openKeyboard.value = !openKeyboard.value)

const positionKeyboard = () => {
  const parent = document.getElementById(attachTo)?.getBoundingClientRect()
  const { top, left, width } = parent as DOMRect
  const container = document.getElementsByClassName('keyboardClass')[0] as HTMLDivElement
  container.setAttribute('style', `top:${top + 40}px;left:${left}px;width:${width - 2}px`)
}

const addKeyboardEventListener = () => {
  const keyboardInput = document.getElementById(attachTo)
  const keyboardClass = document.getElementById(`${attachTo}-keyboardClass`)
  const keyboardOverlay = document.getElementById(`${attachTo}-keyboardOverlay`)

  keyboardOverlay?.addEventListener('click', (e) => {
    if (
      e.target instanceof Element &&
      openKeyboard.value &&
      keyboardOverlay?.contains(e.target) &&
      !keyboardClass?.contains(e.target) &&
      !keyboardInput?.contains(e.target)
    ) {
      toggleKeyboard()
    }
  })

  document.addEventListener('keydown', (event) =>
    event.key === 'Escape' ? toggleKeyboard() : null
  )

  document.addEventListener('keydown', (event) => (event.key === 'Enter' ? toggleKeyboard() : null))
}

onMounted(() => {
  keyboard = new Keyboard('keyboardClass', {
    layoutName: 'default',
    onChange: onChange,
    onKeyPress: onKeyPress,
    ...keyboardYiddish,
    rtl: true,
    autoUseTouchEvents: true
  })

  addKeyboardEventListener()
})
</script>
