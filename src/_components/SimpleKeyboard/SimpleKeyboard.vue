<template>
  <p class="control" :id="`${attachTo}-keyboard-btn`" :key="`${attachTo}-keyboard-btn`">
    <button
      class="button is-clickable"
      @click="toggleKeyboard"
      :alt="$t('search.keyboard')"
      :title="$t('search.keyboard')"
    >
      <span>
        <font-awesome-icon icon="keyboard" />
      </span>
    </button>
  </p>
  <div v-show="show" class="keyboardClass has-text-primary is-family-primary">
    <div
      :id="`${attachTo}-keyboard`"
      class="hg-theme-default hg-layout-default"
      :class="`${attachTo}-keyboard-container`"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Keyboard, { SimpleKeyboard } from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
import keyboardYiddish from '@/assets/keyboardLayouts/keyboardYiddish'
import keyboardMobile from '@/assets/keyboardLayouts/keyboardMobile'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { storeToRefs } from 'pinia'

const show = ref(false)
const reference = defineModel('reference')
const attachTo = defineModel<string>('attachTo', { default: '' })
const preferences = usePreferencesStore()

const { isMobile, isPortrait, isTablet, isDesktop } = storeToRefs(preferences)

const emit = defineEmits(['onEnter'])

let keyboard: SimpleKeyboard

const positionKeyboard = () => {
  const parent = document.getElementById(attachTo.value)?.getBoundingClientRect()
  if (parent) {
    const { top, left, width, height } = parent as DOMRect
    const container = document.getElementById(`${attachTo.value}-keyboard`) as HTMLDivElement
    if ((isTablet.value && isMobile.value) || isPortrait.value) {
      container.setAttribute('style', `top:${top + height}px;width: ${width - 2}`)
    } else {
      container.setAttribute(
        'style',
        `top:${top + height}px;left:${left}px;width:${width - 2}px;position:fixed`
      )
    }
  }
}

const toggleKeyboard = () => (show.value = !show.value)

const switchLayout = (button: string) => {
  const layouts = ['default', 'numbers', 'shift', 'alt', 'chars']
  const targetLayout = button.substring(1, button.length - 1)
  const currentLayout = keyboard.options.layoutName
  const isValidLayout =
    layouts.filter((layout) => targetLayout.toLowerCase().includes(layout)).length !== 0
  if (!isValidLayout) return false
  const defaultKeyboard = currentLayout?.includes('mobile') ? currentLayout : 'default'
  const layout = currentLayout === targetLayout ? defaultKeyboard : targetLayout
  keyboard.setOptions({ layoutName: layout })
  return true
}

const onKeyPress = (button: string) => {
  const el = document.getElementById(attachTo.value) as HTMLInputElement // input element

  if (!switchLayout(button)) {
    let newVal = ''
    if (button === '{bksp}') {
      newVal = el.value.slice(0, -1)
    } else if (button === '{enter}') {
      newVal = el.value
      show.value = !show.value
      emit('onEnter')
    } else if (button === '{space}') {
      newVal = `${el.value} `
    } else {
      newVal = `${el.value}${button}`
    }
    reference.value = newVal
  }
}

const onKeyReleased = () => document.getElementById(attachTo.value)?.focus()

const addEventListeners = () => {
  document.addEventListener('click', closeOutside, true)
  document.addEventListener('keydown', closeOnEscape, true)
}

const removeEventListeners = () => {
  document.removeEventListener('click', closeOutside, true)
  document.removeEventListener('keydown', closeOnEscape, true)
}

const closeOutside = (e: MouseEvent) => {
  const keyboardElement = document.getElementById(`${attachTo.value}-keyboard`)
  const keyboardButton = document.getElementById(`${attachTo.value}-keyboard-btn`)
  if (
    e.target instanceof Element &&
    !keyboardButton?.contains(e.target) &&
    !keyboardElement?.contains(e.target) &&
    show.value
  ) {
    show.value = false
    document.removeEventListener('click', closeOutside, true)
  }
}

const closeOnEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && show.value) show.value = false
  document.removeEventListener('keydown', closeOnEscape, true)
}

watch(show, (newV) => {
  if (newV) {
    addEventListeners()
    positionKeyboard()
  } else {
    removeEventListeners()
  }
})

window.addEventListener('resize', () => positionKeyboard())

watch([isMobile, isTablet, isPortrait, isDesktop], () => positionKeyboard())

onMounted(() => {
  const keyboardLayout = isMobile || isPortrait || isTablet ? keyboardMobile : keyboardYiddish
  const keyboardLayoutName = isMobile || isPortrait || isTablet ? 'mobileDefault' : 'default'
  keyboard = new Keyboard(`${attachTo.value}-keyboard-container`, {
    layoutName: keyboardLayoutName,
    inputName: 'default',
    onKeyPress: onKeyPress,
    onKeyReleased: onKeyReleased,
    ...keyboardLayout,
    // rtl: true,
    autoUseTouchEvents: true
  })
  addEventListeners()
  positionKeyboard()
})
</script>
