<template>
  <div v-if="currentStep" v-show="displayTour" class="vueOnboardingTour fixed">
    <!-- Overlay Background -->
    <div :style="overlayStyle" class="overlay"></div>
    <div :style="overlayHighlightStyle" class="overlay-highlight spinner spinner-1"></div>

    <!-- Popup Container -->
    <div
      v-show="showPopup"
      id="popupContainer"
      class="popupContainer"
      :style="popupStyle"
      :data-id="currentStep?.id"
    >
      <!-- Default Template Content -->
      <div class="card is-flex is-flex-direction-column">
        <div
          class="card-header is-size-5 p-3 has-text-white is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
        >
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
          <div class="is-flex is-flex-grow-1 is-justify-items-space-between p-4">
            <!-- Previous Step Icon -->
            <span v-if="completedSteps?.length" class="ml-auto is-clickable" @click="prevStep"
              ><font-awesome-icon color="white" icon="circle-arrow-left"
            /></span>
            <span class="ml-auto is-clickable" v-else @click="endTour">
              <font-awesome-icon color="white" icon="xmark-circle" />
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
                  :icon="step?.id === currentStep?.id ? 'dot-circle' : 'circle'"
                />
              </span>
            </div>

            <!-- Next Step Icon / End Tour -->
            <span v-if="remainingSteps.length > 1" class="ml-auto is-clickable" @click="nextStep"
              ><font-awesome-icon color="white" icon="circle-arrow-right"
            /></span>
            <span class="ml-auto is-clickable" v-else @click="endTour">
              <font-awesome-icon color="white" icon="xmark-circle" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, type Ref } from 'vue'
import type { TourStep } from '@/assets/interfacesExternals'
import { storeToRefs } from 'pinia'
import { useTourStore } from '@/stores/TourStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'
const { isMobile, displayLeftToRight } = storeToRefs(usePreferencesStore())

const tourStore = useTourStore()
const { remainingSteps, completedSteps, displayTour } = storeToRefs(tourStore)

const targetElement: Ref<Element | null> = ref(null)

const currentStep = ref<TourStep | undefined>(undefined)

const vw = ref(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0))

// const popupContainer = ref({
//   bottom: 0,
//   height: 0,
//   left: 0,
//   right: 0,
//   top: 0,
//   width: 0,
//   x: 0,
//   y: 0
// })

const targetElementPosition = ref({
  width: 0,
  height: 0,
  top: 0,
  left: 0
})

const showPopup = ref(false)

const containerPosition = ref({ height: 0, width: 0 })

const overlayStyle = computed(() => {
  return {
    width: `${targetElementPosition.value.width + 24}px`,
    height: `${targetElementPosition.value.height + 24}px`,
    top: `${targetElementPosition.value.top - 12}px`,
    left: `${targetElementPosition.value.left - 12}px`
  }
})

const clearPopupStyle = () => ({
  top: `${targetElementPosition.value.top + targetElementPosition.value.height / 2}px`,
  left: '',
  right: '',
  bottom: '',
  height: '',
  maxWidth: isMobile ? '' : '20vw',
  width: 'auto'
  // (targetElementPosition.value && targetElementPosition.value.left) ??
  // 0 + containerPosition.value.width >= window.innerWidth - 10
  //   ? `${window.innerWidth - targetElementPosition.value.left - 10}px`
  //   : 'auto'
})

const popupStyle = ref()

const overlayHighlightStyle = ref({
  top: '',
  left: '',
  bottom: '',
  height: '',
  width:
    (targetElementPosition.value && targetElementPosition.value.left) ??
    0 + containerPosition.value.width >= window.innerWidth - 10
      ? `${window.innerWidth - targetElementPosition.value.left - 10}px`
      : 'auto',
  display: 'none'
})

const startTour = () => (remainingSteps.value.length ? nextStep() : endTour())

const nextStep = () => {
  showPopup.value = false
  if (currentStep.value) completedSteps.value.push(remainingSteps.value.shift())
  currentStep.value = remainingSteps.value.length === 0 ? undefined : remainingSteps.value[0]
}

const prevStep = () => {
  showPopup.value = false
  remainingSteps.value.unshift(completedSteps.value.pop())
  currentStep.value = remainingSteps.value[0]
}

const endTour = () => {
  showPopup.value = false
  remainingSteps.value = []
  overlayHighlightStyle.value.display = 'none'
  displayTour.value = false
}

// Order of assigning position and alignment matters!
const getStyles = () => {
  if (currentStep.value) {
    targetElement.value = document.querySelector(currentStep.value.id)
    // if (document.defaultView && document.defaultView.getComputedStyle)
    if (targetElement.value) {
      // console.log(targetElement.value.computedStyleMap().get('opacity'))
      targetElementPosition.value = targetElement.value?.getBoundingClientRect()
      setPopupPosition()

      if (!currentStep.value.align) {
        // console.log('no alignment, setting maxwidth')
        popupStyle.value.maxWidth = overlayStyle.value.width
      } else {
        if (currentStep.value.align.includes('right')) alignPopupRight()
        if (currentStep.value.align.includes('middle')) alignPopupMiddle()
        if (currentStep.value.align.includes('left')) alignPopupLeft()
      }
      setHighlights()
    } else {
      // Element not in DOM; remove from remainingSteps and move on
      nextStep()
    }
  }
}

const setPopupPosition = () => {
  popupStyle.value = clearPopupStyle()
  if (currentStep.value) {
    // const element = document.querySelector('.popupContainer')
    if (currentStep.value.position) {
      const position = currentStep.value.position
      // const popupRect = element.getBoundingClientRect()
      // console.log(element, popupRect.left, window.innerWidth)

      const valid = { left: false, right: false, bottom: false, top: false }
      valid.left = popupStyle.value.left > 0
      valid.right = popupStyle.value.left + popupStyle.value.width < window.innerWidth
      valid.top = popupStyle.value.top > 0
      valid.bottom = popupStyle.value.top + popupStyle.value.height < window.innerHeight

      if (position.includes('left') && valid.left) positionPopupLeft()
      if (position.includes('right') && valid.right) positionPopupRight()
      if (position.includes('top') && valid.top) positionPopupTop()
      if (position.includes('bottom') && valid.bottom) positionPopupBottom()
    }
  }
}

const positionPopupLeft = () => {
  console.log('positioning left')
  popupStyle.value.left = overlayStyle.value.left
}

const positionPopupRight = () => {
  console.log('positioning right')
  // popupStyle.value.top = overlayStyle.value.top
  // popupStyle.value.right = `${parseInt(overlayStyle.value.left) + parseInt(overlayStyle.value.width)}px`
  // popupStyle.value.width =
  popupStyle.value.left = `${parseInt(overlayStyle.value.left) + parseInt(overlayStyle.value.width)}px`
}

const positionPopupTop = () => {
  console.log('positioning top')
  popupStyle.value.top = overlayStyle.value.top
  // popupStyle.value.bottom = `${parseInt(overlayStyle.value.top) - parseInt(overlayStyle.value.height)}px`
}

const positionPopupBottom = () => {
  console.log('positioning bottom')
  popupStyle.value.top = `${parseInt(overlayStyle.value.top) + parseInt(overlayStyle.value.height)}px`
}

const alignPopupRight = () => {
  console.log('aligning right')
  popupStyle.value.maxWidth = overlayStyle.value.width
  // popupStyle.value.left = overlayStyle.value.left <
  // popupStyle.value.maxWidth = overlayStyle.value.width
  // Assign popupStyle.value.left to overlayStyle.value.left
  // Find most right point of overlayStyle as limit: overlayStyle.value.width + overlayStyle.value.left
  // Check popupStyle.value.left + overlayStyle.value.width < right point
  // If so popupStyle.value.width = popupStyle.value.left + overlayStyle.value.width
  // Else popupStyle.value.width = overlayStyle.value.width + overlayStyle.value.left
  const limit = parseInt(overlayStyle.value.width) + parseInt(overlayStyle.value.left)
  console.log(limit, popupStyle.value.left, overlayStyle.value.width)
  if (parseInt(popupStyle.value.left) + parseInt(overlayStyle.value.width) > limit) {
    popupStyle.value.width = `${parseInt(popupStyle.value.left) + parseInt(overlayStyle.value.width)}px`
  } else {
    popupStyle.value.width = `${parseInt(overlayStyle.value.width) + parseInt(overlayStyle.value.left)}px`
  }

  // popupStyle.value.width =
  //   parseInt(overlayStyle.value.width) >
  //   parseInt(popupStyle.value.right) - parseInt(overlayStyle.value.left)
  //     ? `${parseInt(popupStyle.value.right) - parseInt(overlayStyle.value.left)}px`
  //     : popupStyle.value.right
}

const alignPopupMiddle = () => {
  console.log('aligning middle')
  const cont = document.querySelector('.popupContainer')
  console.log(cont?.getBoundingClientRect())
  popupStyle.value.width = `${parseInt(overlayStyle.value.width) / 2}px`
}
const alignPopupLeft = () => {
  popupStyle.value.right = `${vw.value - (parseInt(overlayStyle.value.left) + parseInt(overlayStyle.value.width) / 2)}px`
  console.log(
    'aligning left',
    parseInt(overlayStyle.value.width) >
      parseInt(popupStyle.value.right) - parseInt(overlayStyle.value.left),
    parseInt(overlayStyle.value.width),
    parseInt(popupStyle.value.right) - parseInt(overlayStyle.value.left),
    parseInt(overlayStyle.value.left)
  )
  popupStyle.value.width =
    parseInt(overlayStyle.value.width) >
    parseInt(popupStyle.value.right) - parseInt(overlayStyle.value.left)
      ? `${parseInt(popupStyle.value.right) - parseInt(overlayStyle.value.left)}px`
      : popupStyle.value.right
}

// Helper methods to make sure popup does not fall off screen
// PopupContainer aligns ltr/rtl on element

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

const setHighlights = () => {
  if (currentStep.value && currentStep.value.highlight) {
    const currentStepHighlight = currentStep.value.highlight
    const element = document.querySelector(currentStepHighlight)
    if (element) {
      const elementRect = element.getBoundingClientRect()

      const centerOfElementY = elementRect.top - 16 + elementRect.height / 2 // 16 is absolute based on icon
      const centerOfElementX = elementRect.x - 16 + elementRect.width / 2

      overlayHighlightStyle.value.width = `16px`
      overlayHighlightStyle.value.height = `16px`
      overlayHighlightStyle.value.top = `${centerOfElementY}px`
      overlayHighlightStyle.value.left = `${centerOfElementX}px`
      overlayHighlightStyle.value.display = 'block'
    }
  } else {
    overlayHighlightStyle.value.display = 'none'
  }
  showPopup.value = true
}

const keyListeners = (e: KeyboardEvent) => {
  if (e.key === 'Escape') displayTour.value = false
  if (e.key === 'ArrowLeft') prevStep()
  if (e.key === 'ArrowRight') nextStep()
}

onMounted(() => window.addEventListener('keyup', keyListeners, true))

watch(remainingSteps, (newV) => (displayTour.value = newV.length ? true : false))

watch(displayTour, (newV) => (newV ? startTour() : endTour()))
watch(currentStep, (newV) => (newV ? getStyles() : (remainingSteps.value = [])), { deep: true })
</script>
