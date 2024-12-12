<template>
  <div
    v-if="displayOnboardingTour"
    data-test="onboardingTour"
    class="vueOnboardingTour"
    :class="{ fixed: overlay }"
  >
    <!-- Overlay Background -->
    <div v-if="overlay" :style="styleOverlay" data-test="overlay" class="overlay"></div>

    <!-- Popup Container -->
    <div
      ref="popup"
      :style="stylePopup"
      :class="[targetElementVisible ? 'opacity-100' : 'opacity-0']"
      class="popupContainer z-[9999] fixed"
    >
      <!-- Slot for Custom Content -->
      <slot :currentStep="currentStep" :currentStepIndex="currentStepIndex"></slot>

      <!-- Default Template Content -->
      <div v-if="defaultTemplate" class="card is-flex is-flex-direction-column">
        <div
          class="card-header is-size-5 p-3 has-text-white is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
        >
          <!-- Chevron (Arrow Pointer) -->
          <!-- <span class="absolute" :class="styleChevron">
            <font-awesome-icon icon="chevron-right" v-if="popupPosition === 'left'" />
            <font-awesome-icon icon="chevron-up" v-if="popupPosition === 'down'" />
            <font-awesome-icon icon="chevron-down" v-if="popupPosition === 'top'" />
            <font-awesome-icon icon="chevron-left" v-if="popupPosition === 'right'" />
          </span> -->

          <!-- Step Tag (Optional) -->
          <div v-if="currentStep?.tag" class="is-small font-medium">
            {{ currentStep.tag }}
          </div>

          <!-- Step Title -->
          <div v-if="currentStep?.title" class="is-large font-semibold">
            {{ currentStep.title }}
          </div>
          <!-- Close Icon -->
          <button class="absolute is-clickable" @click="endTour">
            <font-awesome-icon icon="xmark-circle" size="xl" />
          </button>
        </div>

        <div class="card-content">
          <!-- Step Description -->
          <div v-if="currentStep?.description" class="is-small">
            {{ currentStep.description }}
          </div>
        </div>

        <div class="card-footer">
          <!-- Navigation and Control -->
          <div class="is-flex is-justify-items-space-between p-4">
            <!-- Previous Step Icon -->
            <span v-if="isPreviousStepEnabled" class="mr-auto is-clickable" @click="goPreviousStep"
              ><font-awesome-icon color="white" icon="circle-arrow-left" size="xl"
            /></span>

            <!-- Step Indicators (Dots) -->
            <div class="is-flex is-flex-grow-1 is-justify-content-center">
              <span
                v-for="(_, idx) in steps.length"
                :key="`dot_step_${idx}`"
                class="mx-1"
                @click="setStep(idx)"
                ><font-awesome-icon
                  color="white"
                  :icon="idx === currentStepIndex ? 'dot-circle' : 'circle'"
                  size="xl"
              /></span>
            </div>

            <!-- Next Step Icon / End Tour -->
            <span v-if="isNextStepEnabled" class="ml-auto is-clickable" @click="goNextStep"
              ><font-awesome-icon color="white" icon="circle-arrow-right" size="xl"
            /></span>
            <span class="ml-auto is-clickable" v-else @click="endTour">
              <font-awesome-icon color="white" icon="xmark-circle" size="xl" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type MaybeElement, useElementBounding } from '@vueuse/core'
import { ref, onMounted, watch, computed, nextTick, onUnmounted, type Ref } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import type { Tour } from '@/assets/interfacesExternals'

const props = withDefaults(defineProps<Tour>(), {
  overlay: true,
  cookieStorage: false,
  defaultTemplate: true,
  startEvent: undefined,
  endDate: undefined,
  scrollableContainerSelector: undefined,
  labelTerminate: 'close'
})

const displayTour = ref(false)
const currentStepIndex = ref(0)
const stylePopup = ref({})
const styleOverlay = ref({})
const popupPosition = ref('left')
const popup: Ref<HTMLDivElement | null> = ref(null)
const cookies = useCookies()

const emits = defineEmits(['startTour', 'endTour'])

let domObserverTarget: MutationObserver
let domObserverScrollable: MutationObserver

const targetElement: Ref<Element | null> = ref(null)
const scrollableContainerElement: Ref<Element | null> = ref(null)

/** COMPUTED */
const currentStep = computed(() =>
  props.steps?.length > 0 ? props.steps[currentStepIndex.value] : undefined
)

const targetElementBound = computed(() => useElementBounding(targetElement.value as MaybeElement))

const scrollableContainerBound = computed(
  () =>
    scrollableContainerElement.value &&
    useElementBounding(scrollableContainerElement.value as MaybeElement)
)

const targetElementVisible = computed(() => {
  return (
    targetElementBound.value &&
    ((targetElementBound.value.top.value >= 0 &&
      targetElementBound.value.top.value <= window.innerHeight) ||
      (targetElementBound.value.bottom.value >= 0 &&
        targetElementBound.value.bottom.value <= window.innerHeight) ||
      (targetElementBound.value.bottom.value >= window.innerHeight &&
        targetElementBound.value.top.value <= 0)) &&
    ((targetElementBound.value.left.value >= 0 &&
      targetElementBound.value.left.value <= window.innerWidth) ||
      (targetElementBound.value.right.value >= 0 &&
        targetElementBound.value.right.value <= window.innerWidth) ||
      (targetElementBound.value.right.value >= window.innerWidth &&
        targetElementBound.value.left.value <= 0))
  )
})

const styleChevron = computed(() => {
  switch (popupPosition.value) {
    case 'left':
      return '-right-2 top-3'
    case 'right':
      return '-left-2 top-3'
    case 'top':
      return 'left-3 -bottom-2'
    case 'bottom':
      return 'left-3 -top-2'
    default:
      return '-right-2 top-3'
  }
})

const isNextStepEnabled = computed(() => currentStepIndex.value < props.steps?.length - 1)

const isPreviousStepEnabled = computed(() => currentStepIndex.value > 0)

const displayOnboardingTour = computed(
  () => displayTour.value && props.steps && props.steps.length > 0 && targetElement.value
)

// const displayOnboardingTour = ref(true)

/** METHODS */
const updateStylePopupLeftRight = (left: number, targetTop: number, popupPos: DOMRect) => {
  let top
  if (targetTop + popupPos.height > window.innerHeight) {
    top = window.innerHeight - popupPos.height
  } else if (targetTop <= 0) {
    top = 0
  } else {
    top = targetTop
  }
  stylePopup.value = {
    top: `${top}px`,
    left: `${left}px`
  }
}

const getStyles = () => {
  const targetElPos =
    currentStep.value?.target &&
    document.querySelector(currentStep.value?.target)?.getBoundingClientRect()
  const popupPos = popup.value?.getBoundingClientRect()

  if (targetElPos && popupPos) {
    const {
      top: targetTop,
      left: targetLeft,
      bottom: targetBottom,
      right: targetRight,
      width: targetWidth,
      height: targetHeight
    } = targetElPos

    styleOverlay.value = {
      position: 'fixed',
      width: `${targetWidth + 24}px`,
      // 'max-width': '20vw',
      height: `${targetHeight + 24}px`,
      top: `${targetTop - 12}px`,
      left: `${targetLeft - 12}px`,
      // right: `${targetRight + 12}px`,
      boxShadow:
        'inset 0px 0px 10px 0px rgba(255, 255, 255, 1), 0px 0px 0px 9999px rgba(0, 0, 0, 0.5)',
      userEvent: 'none',
      borderRadius: '10px',
      zIndex: 9999
    }

    // stylePopup.value = {
    //   top: `${targetTop - popupPos.height - 40}px`,
    //   left: `${targetLeft}px`,
    //   width:
    //     targetLeft + popupPos.width >= window.innerWidth - 10
    //       ? `${window.innerWidth - targetLeft - 10}px`
    //       : 'auto',
    //   'max-width': '20vw'
    // }
    if (targetLeft - popupPos.width - 40 > 0) {
      //LEFT
      updateStylePopupLeftRight(targetLeft - popupPos.width - 40, targetTop, popupPos)
      popupPosition.value = 'left'
    } else if (targetRight + popupPos.width + 40 < window.innerWidth) {
      //RIGHT
      updateStylePopupLeftRight(targetRight + 40, targetTop, popupPos)
      popupPosition.value = 'right'
    } else if (targetTop - popupPos.height - 40 > 0) {
      //TOP
      stylePopup.value = {
        top: `${targetTop - popupPos.height - 40}px`,
        left: `${targetLeft}px`,
        width:
          targetLeft + popupPos.width >= window.innerWidth - 10
            ? `${window.innerWidth - targetLeft - 10}px`
            : 'auto',
        'max-width': '20vw'
      }
      popupPosition.value = 'top'
    } else {
      //BOTTOM
      stylePopup.value = {
        top:
          targetBottom + popupPos.height + 40 < window.innerHeight
            ? `${targetBottom + 40}px`
            : `${window.innerHeight - popupPos.height}px`,
        left: `${targetLeft}px`,
        width:
          targetLeft + popupPos.width >= window.innerWidth - 10
            ? `${window.innerWidth - targetLeft - 10}px`
            : 'auto'
      }
      popupPosition.value = 'bottom'
    }
  }
}

const goNextStep = () => {
  if (currentStepIndex.value < props.steps?.length - 1) currentStepIndex.value += 1
}

const goPreviousStep = () => {
  if (currentStepIndex.value > 0) currentStepIndex.value -= 1
}

const setStep = (index: number) => {
  if (index >= 0 && index <= props.steps?.length) currentStepIndex.value = index
}

const validateStartTour = () => {
  if (props.endDate) {
    if (new Date() <= props.endDate) {
      return !(props.cookieStorage && cookies.get(`vue_onboarding_tour_${props.tourId}`))
    } else {
      return false
    }
  } else {
    return !(props.cookieStorage && cookies.get(`vue_onboarding_tour_${props.tourId}`))
  }
}

const startTour = () => {
  if (validateStartTour()) {
    displayTour.value = true
    emits('startTour')
  }
}

const endTour = () => {
  if (props.cookieStorage) {
    const options = {
      expires: props.endDate
        ? props.endDate
        : (() => {
            const date = new Date()

            date.setDate(date.getDate() + 365)

            return date
          })()
    }
    cookies.set(`vue_onboarding_tour_${props.tourId}`, true, options)
  }
  displayTour.value = false
  currentStepIndex.value = 0
  stylePopup.value = {}
  styleOverlay.value = {}
  targetElement.value = null
  emits('endTour')
}

const checkAutoScroll = () => {
  if (currentStep.value?.target) {
    const { top: targetTop, left: targetLeft } =
      document.querySelector(currentStep.value?.target)?.getBoundingClientRect() ?? {}
    const popupPos = popup.value?.getBoundingClientRect()
    if (
      targetTop &&
      targetLeft &&
      popupPos &&
      (targetTop < 0 ||
        targetTop > window.innerHeight ||
        targetLeft < 0 ||
        targetLeft > window.innerWidth)
    ) {
      const top =
        targetTop < 0 || targetTop > window.innerHeight
          ? targetTop - popupPos.height - 60
          : undefined
      const left = targetLeft < 0 || targetLeft > window.innerWidth ? targetLeft : undefined
      if (scrollableContainerElement.value) {
        scrollableContainerElement.value.scrollBy({
          left:
            left && scrollableContainerBound.value?.left
              ? left - scrollableContainerBound.value?.left?.value
              : undefined,
          top:
            top && scrollableContainerBound.value?.left
              ? top - scrollableContainerBound.value?.left?.value
              : undefined,
          behavior: 'smooth'
        })
      } else {
        window.scrollBy({
          left: left,
          top: top,
          behavior: 'smooth'
        })
      }
    }
  }
}

const getTargetElement = () => {
  if (currentStep.value?.target) {
    //Add observer to wait for dom generation if element not directly in DOM
    if (document.querySelector(currentStep.value?.target)) {
      targetElement.value = document.querySelector(currentStep.value?.target)
    } else {
      const targetNode = document.body
      const config = { childList: true, subtree: true }
      domObserverTarget = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const externalElement =
              currentStep.value?.target && document.querySelector(currentStep.value?.target)
            if (externalElement) {
              targetElement.value = externalElement
              domObserverTarget.disconnect()
            }
          }
        }
      })

      domObserverTarget.observe(targetNode, config) // Start observing
    }
  }
}

const getScrollableContainerElement = () => {
  if (props.scrollableContainerSelector) {
    //Add observer to wait for dom generation if element not directly in DOM
    if (document.querySelector(props.scrollableContainerSelector)) {
      scrollableContainerElement.value = document.querySelector(props.scrollableContainerSelector)
    } else {
      const targetNode = document.body
      const config = { childList: true, subtree: true }
      domObserverScrollable = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const externalElement =
              props.scrollableContainerSelector &&
              document.querySelector(props.scrollableContainerSelector)
            if (externalElement) {
              scrollableContainerElement.value = externalElement
              domObserverScrollable.disconnect()
            }
          }
        }
      })

      domObserverScrollable.observe(targetNode, config) // Start observing
    }
  }
}

const resizeEventListener = () => {
  if (displayOnboardingTour.value) {
    getStyles()

    checkAutoScroll()
  }
}

const scrollEventListener = () => {
  if (displayOnboardingTour.value) {
    getStyles()
  }
}

defineExpose({ startTour, endTour, goNextStep, goPreviousStep, setStep })

/** LIFECYCLE */
onMounted(() => {
  console.log(props)
  nextTick(() => getStyles())
  window.addEventListener('resize', resizeEventListener)
  window.addEventListener('scroll', scrollEventListener)
  if (props.startEvent) window.addEventListener(props.startEvent, startTour)
  getTargetElement()
  getScrollableContainerElement()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeEventListener)
  window.removeEventListener('scroll', scrollEventListener)
  if (props.startEvent) window.removeEventListener(props.startEvent, startTour)
  if (domObserverTarget) {
    domObserverTarget.disconnect() // Clean up when component is destroyed
  }
  if (domObserverScrollable) {
    domObserverScrollable.disconnect() // Clean up when component is destroyed
  }
})

/** WATCH */
watch(
  [targetElementBound, scrollableContainerBound, displayTour],
  () => {
    if (displayTour.value) {
      nextTick(() => {
        getStyles()
      })
    }
  },
  { deep: true }
)

watch([currentStepIndex, displayTour], () => {
  if (displayTour.value) {
    if (currentStep.value?.beforeScript) {
      currentStep.value?.beforeScript()
    }
    getTargetElement()
    if (currentStep.value?.afterScript) {
      currentStep.value?.afterScript()
    }
  }
})

watch(targetElement, () => {
  if (displayTour.value) {
    nextTick(() => {
      checkAutoScroll()
    })
  }
})
</script>
