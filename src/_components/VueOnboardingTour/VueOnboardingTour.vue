<template>
  <div v-if="currentStep" v-show="displayTour" class="vueOnboardingTour fixed">
    <!-- Overlay Background -->
    <div :style="overlayStyle" class="overlay"></div>

    <!-- Popup Container -->
    <div
      id="popupContainer"
      ref="popupContainer"
      class="popupContainer"
      :style="popupStyle"
      :data-id="currentStep?.id"
    >
      <!-- Default Template Content -->
      <div class="card is-flex is-flex-direction-column">
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
            <span
              :class="!completedSteps?.length ? 'disabled' : ''"
              class="mr-auto is-clickable"
              @click="prevStep"
            >
              <font-awesome-icon color="white" icon="circle-arrow-left" size="xl" />
            </span>

            <!-- Step Indicators (Dots) -->
            <div class="is-flex is-flex-grow-1 is-justify-content-center">
              <span
                v-for="(step, idx) in [...completedSteps, ...remainingSteps]"
                :key="`dot_step_${idx}`"
                class="mx-1"
                :id="`dot_step_${idx}`"
              >
                <font-awesome-icon
                  color="white"
                  size="xl"
                  :icon="step.id === currentStep.id ? 'dot-circle' : 'circle'"
                />
              </span>
            </div>

            <!-- Next Step Icon / End Tour -->
            <span v-if="remainingSteps.length > 1" class="ml-auto is-clickable" @click="nextStep"
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
// import { type MaybeElement, useElementBounding } from '@vueuse/core'
import { ref, watch, computed, onMounted, type Ref } from 'vue'
import type { Tour } from '@/assets/interfacesExternals'
import { storeToRefs } from 'pinia'
import { useTourStore } from '@/stores/TourStore'

const tourStore = useTourStore()
const { completedSteps, remainingSteps, displayTour } = storeToRefs(tourStore)
const { checkDOM } = tourStore
// const remainingSteps = ref<Array<Tour>>([])

// const displayTour = ref(false)

// let domObserverTarget: MutationObserver
// let domObserverScrollable: MutationObserver

// Binding the target element
const targetElement: Ref<Element | null> = ref(null)
// const popupElement: Ref<Element | null> = ref(null)
// const targetElementBound = computed(() => useElementBounding(targetElement.value as MaybeElement))
// const popupElementBound = computed(() => useElementBounding(popupElement.value as MaybeElement))
// const scrollableContainerElement: Ref<Element | null> = ref(null)

const currentStep = ref<Tour | undefined>(undefined)
const popupContainer = ref()

const targetElementPosition = ref()
const containerPosition = ref({ height: 0, width: 0 })

// Computed styles
const overlayStyle = computed(() => {
  return {
    width: `${(targetElementPosition.value.width ?? 0) + 24}px`,
    height: `${(targetElementPosition.value.height ?? 0) + 24}px`,
    top: `${(targetElementPosition.value.top ?? 0) - 12}px`,
    left: `${(targetElementPosition.value.left ?? 0) - 12}px`
  }
})

const popupStyle = ref({
  top: '',
  left: '',
  bottom: '',
  height: '',
  maxWidth: '20vw',
  width:
    (targetElementPosition.value && targetElementPosition.value.left) ??
    0 + containerPosition.value.width >= window.innerWidth - 10
      ? `${window.innerWidth - targetElementPosition.value.left - 10}px`
      : 'auto'
})

const startTour = () => {
  checkDOM()
  if (remainingSteps.value.length) nextStep()
}

const nextStep = () => {
  if (currentStep.value) completedSteps.value.push(remainingSteps.value.shift())
  currentStep.value = remainingSteps.value.length === 0 ? undefined : remainingSteps.value[0]
}

const prevStep = () => {
  remainingSteps.value.unshift(completedSteps.value.pop())
  currentStep.value = remainingSteps.value[0]
}

const endTour = () => (displayTour.value = false)

const getStyles = () => {
  setTimeout(() => {
    if (currentStep.value) {
      targetElement.value = document.querySelector(currentStep.value.id)
      if (targetElement.value) {
        targetElementPosition.value = targetElement.value?.getBoundingClientRect()
        currentStep.value.position = setPopupPosition()
        if (currentStep.value.position === 'left') positionPopupLeft()
        if (currentStep.value.position === 'right') positionPopupRight()
        if (currentStep.value.position === 'above') positionPopupTop()
        if (currentStep.value.position === 'below') positionPopupBelow()
      }
    }
  }, 50)
}

// Helper methods to determine popup position
const setPopupPosition = () => {
  if (currentStep.value?.position) return currentStep.value.position
  // if (targetLeft - container.width - 40 > 0) return 'left'
  // if (targetRight + container.width + 40 < window.innerWidth) return 'right'
  // if (targetTop - container.height - 40 > 0) return 'top'
  return 'below' // Default to bottom placement if all else fails
}

const positionPopupLeft = () => {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  popupStyle.value.top = `${targetElementPosition.value.top}px`
  popupStyle.value.left = `${targetElementPosition.value.left - (vw / 100) * 20 - 20}px`
}

const positionPopupRight = () => {
  popupStyle.value.top = `${targetElementPosition.value.top}px`
  popupStyle.value.left = `${targetElementPosition.value.width + targetElementPosition.value.left + 20}px`
}

const positionPopupTop = () => {
  popupStyle.value.bottom = `${targetElementPosition.value.top - targetElementPosition.value.height}px`
  popupStyle.value.left = `${targetElementPosition.value.left}px`
}

const positionPopupBelow = () => {
  popupStyle.value.top = `${targetElementPosition.value.top + targetElementPosition.value.height + 20}px`
  popupStyle.value.left = `${targetElementPosition.value.left}px`
}

// const scrollableContainerBound = computed(
//   () =>
//     scrollableContainerElement.value &&
//     useElementBounding(scrollableContainerElement.value as MaybeElement)
// )

/** METHODS */
// const checkAutoScroll = () => {
//   if (currentStep.value?.target) {
//     const { top: targetTop, left: targetLeft } =
//       document.querySelector(currentStep.value?.target)?.getBoundingClientRect() ?? {}
//     const popupPos = popup.value?.getBoundingClientRect()
//     if (
//       targetTop &&
//       targetLeft &&
//       popupPos &&
//       (targetTop < 0 ||
//         targetTop > window.innerHeight ||
//         targetLeft < 0 ||
//         targetLeft > window.innerWidth)
//     ) {
//       const top =
//         targetTop < 0 || targetTop > window.innerHeight
//           ? targetTop - popupPos.height - 60
//           : undefined
//       const left = targetLeft < 0 || targetLeft > window.innerWidth ? targetLeft : undefined
//       if (scrollableContainerElement.value) {
//         scrollableContainerElement.value.scrollBy({
//           left:
//             left && scrollableContainerBound.value?.left
//               ? left - scrollableContainerBound.value?.left?.value
//               : undefined,
//           top:
//             top && scrollableContainerBound.value?.left
//               ? top - scrollableContainerBound.value?.left?.value
//               : undefined,
//           behavior: 'smooth'
//         })
//       } else {
//         window.scrollBy({
//           left: left,
//           top: top,
//           behavior: 'smooth'
//         })
//       }
//     }
//   }
// }

// const getTargetElement = () => {
// if (currentStep.value && currentStep.value.id) {
// Element may or may not be in DOM, and may not yet be shown or fully loaded
// Add observer to wait for dom generation if element not directly in DOM
// console.log(remainingSteps.value, currentStep.value.id)
// if (document.querySelector(currentStep.value?.id)) {
// targetElement.value = document.querySelector(currentStep.value?.id)
// console.log(targetElement.value)
// } else {
//   console.log('not in dom')
//   const targetNode = document.body
//   const config = { childList: true, subtree: true }
//   domObserverTarget = new MutationObserver((mutationsList) => {
//     for (const mutation of mutationsList) {
//       if (mutation.type === 'childList') {
//         const externalElement =
//           currentStep.value?.id && document.querySelector(currentStep.value?.id)
//         if (externalElement) {
//           targetElement.value = externalElement
//           domObserverTarget.disconnect()
//         }
//       }
//     }
//   })

//   domObserverTarget.observe(targetNode, config) // Start observing
// }
// }
// }

// const getScrollableContainerElement = () => {
//   if (tour.value && typeof tour.value === 'object') {
//     if (tour.value.scrollableContainerSelector) {
//       //Add observer to wait for dom generation if element not directly in DOM
//       if (document.querySelector(tour.value.scrollableContainerSelector)) {
//         scrollableContainerElement.value = document.querySelector(
//           tour.value.scrollableContainerSelector
//         )
//       } else {
//         const targetNode = document.body
//         const config = { childList: true, subtree: true }
//         domObserverScrollable = new MutationObserver((mutationsList) => {
//           for (const mutation of mutationsList) {
//             if (
//               mutation.type === 'childList' &&
//               tour.value &&
//               typeof tour.value === 'object' &&
//               tour.value.scrollableContainerSelector
//             ) {
//               const externalElement =
//                 tour.value.scrollableContainerSelector &&
//                 document.querySelector(tour.value.scrollableContainerSelector)
//               if (externalElement) {
//                 scrollableContainerElement.value = externalElement
//                 domObserverScrollable.disconnect()
//               }
//             }
//           }
//         })

//         domObserverScrollable.observe(targetNode, config) // Start observing
//       }
//     }
//   }
// }

// const resizeEventListener = () => {
//   if (displayOnboardingTour.value) {
//     getStyles()

//     checkAutoScroll()
//   }
// }

// const scrollEventListener = () => {
//   if (displayOnboardingTour.value) {
//     getStyles()
//   }
// }

/** LIFECYCLE */
// onMounted(() => {
// if (tour.value && typeof tour.value === 'object') {
// getStyles()
// nextTick(() => getStyles())
// window.addEventListener('resize', resizeEventListener)
// window.addEventListener('scroll', scrollEventListener)
// console.log(currentStep.value)
// if (currentStep.value?.startEvent)
// window.addEventListener(currentStep.value.startEvent, startTour)
// getTargetElement()
// getScrollableContainerElement()
// }
// })

// onUnmounted(() => {
// window.removeEventListener('resize', resizeEventListener)
// window.removeEventListener('scroll', scrollEventListener)
// if (tour.value && typeof tour.value === 'object') {
//   if (currentStep.value?.startEvent)
//     window.removeEventListener(currentStep.value.startEvent, startTour)
// }
//   if (domObserverTarget) {
//     domObserverTarget.disconnect() // Clean up when component is destroyed
//   }
//   if (domObserverScrollable) {
//     domObserverScrollable.disconnect() // Clean up when component is destroyed
//   }
// })

const keyListeners = (e: KeyboardEvent) => {
  if (e.key === 'Escape') displayTour.value = false
  if (e.key === 'ArrowLeft') prevStep()
  if (e.key === 'ArrowRight') nextStep()
}

onMounted(() => {
  window.addEventListener('keyup', keyListeners, true)
  displayTour.value = true // Trigger startTour in watch
})

watch(currentStep, () => getStyles())
watch(displayTour, (newV) => {
  if (newV) {
    console.log('starting tour')
    startTour()
  }
})

watch(currentStep, (newV) => {
  if (!newV) {
    console.log('ending tour')
    endTour()
  }
})
</script>
