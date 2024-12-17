import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { i18n } from '@/config/i18n'
import type { Tour } from '@/assets/interfacesExternals'
// import type { VueMessageType } from 'vue-i18n'

export const useTourStore = defineStore('tours', () => {
  const displayTour = ref(false)
  const tours = ref<Array<Tour>>([])
  const completedSteps = ref<Array<Tour>>([])
  const tourNames = computed(() => {
    const names: Array<string> = []
    for (const tour in tours.value) {
      names.push(tour)
    }
    return names
  })

  const currentTour = ref()
  const remainingSteps = ref()
  const stepsInDOM = ref()

  const loadTours = async () => {
    if (!i18n) return false
    currentTour.value = i18n.global.tm(`tours`)
    console.log('Loaded tours from translation files')
  }

  const checkDOM = () => {
    remainingSteps.value = Object.entries(currentTour.value)
      .map(([key]) => {
        if (!document.querySelector(key)) return null // Exclude if not in DOM
        if (completedSteps.value.map((steps) => steps.id).includes(key)) return null // Exclude if already done
        return { id: key, ...currentTour.value[key] }
      })
      .filter((k) => k) // Filter out null values

    // If items have a group assigned we prioritise grouped items and without group
    remainingSteps.value.sort((a: Tour, b: Tour) => {
      console.log(a, b)
      if (
        !Object.prototype.hasOwnProperty.call(a, 'group') &&
        !Object.prototype.hasOwnProperty.call(b, 'group')
      ) {
        console.log(1)
        return null
      }
      if (
        Object.prototype.hasOwnProperty.call(a, 'group') &&
        !Object.prototype.hasOwnProperty.call(b, 'group')
      ) {
        console.log(2)
        return a
      }
      if (
        !Object.prototype.hasOwnProperty.call(a, 'group') &&
        Object.prototype.hasOwnProperty.call(b, 'group')
      ) {
        console.log(3)
        return b
      }
      if (
        Object.prototype.hasOwnProperty.call(a, 'group') &&
        Object.prototype.hasOwnProperty.call(b, 'group') &&
        typeof a.group === 'string' &&
        typeof b.group === 'string'
      ) {
        return a.group.localeCompare(b.group)
      }
    })

    console.log(
      // remainingSteps.value,
      // '\n| Completed',
      // completedSteps.value.length,
      // completedSteps.value,
      '\n| Remaining:',
      remainingSteps.value.length,
      remainingSteps.value
    )
    completedSteps.value = []
  }

  // Play all tours for the user or only a specific step
  // const tour = (tourId: string = '', popupPosition: string | undefined = undefined) => {
  // const tour = (tourList: Array<string>) => {
  // const tourElements: Tour[] = []
  // currentTour.value = Object.entries(tours.value).map((tourStep) => {
  // console.log(tourList, tourStep[0], tourList.includes(tourStep[0]))
  // if (tourList.includes(tourStep[0])) return { id: tourStep[0], ...tourStep[1] }
  // })
  // if (tourList) console.log(tourList.includes(currentTour.value))
  // console.log(tourSteps)

  // tours.value.map((tourStep) => console.log(tourStep))
  // for (const tourStep in tourList) {
  //   const tourObject = tours.value[tourStep]
  //   console.log(tourStep, tours.value['#query'], tourObject)
  //   // Only continue with valid tourId
  //   tourElements.push({
  //     // tourId: tourId,
  //     target: tourId,
  //     title: tourObject.title,
  //     description: tourObject.description,
  //     position: tourObject.position
  //     // overlay: true,
  //     // cookieStorage: false,
  //     // defaultTemplate: true,
  //     // startEvent: undefined,
  //     // endDate: undefined,
  //     // scrollableContainerSelector: '',
  //     // labelTerminate: 'close',
  //     // popupPosition: popupPosition
  //   })
  // }
  // if (!i18n) return false
  // if (tourId.length > 0 && !tourNames.value.includes(tourId))
  // const tourObject = tours.value[tourId]
  // console.log(tours.value[tourId])
  // const steps: Array<VueMessageType> = i18n.global.tm(tourId}`)
  // Only continue with valid tourId
  // const tour: Tour = {
  //   // tourId: tourId,
  //   target: tourId,
  //   title: tourObject.title,
  //   description: tourObject.description,
  //   position: tourObject.position,
  //   // overlay: true,
  //   // cookieStorage: false,
  //   // defaultTemplate: true,
  //   // startEvent: undefined,
  //   // endDate: undefined,
  //   // scrollableContainerSelector: '',
  //   // labelTerminate: 'close',
  //   // popupPosition: popupPosition
  // }
  // for (const step in steps) {
  //   const newStep: TourStep = {
  //     target: (steps[step] as unknown as TourStep).target,
  //     title: (steps[step] as unknown as TourStep).title,
  //     description: (steps[step] as unknown as TourStep).description
  //   }
  //   tour.steps.push(newStep)
  // }
  // currentTour.value = tourElements
  // }

  // const resetTours = () => {
  //   loadTours
  // }

  // const tour = () => {
  //   displayTour.value = !displayTour.value
  // }

  const excludeFromTour = () => {}

  return {
    tours,
    tourNames,
    currentTour,
    remainingSteps,
    completedSteps,
    stepsInDOM,
    displayTour,
    loadTours,
    checkDOM
    // tour,
    // startTour,
    // resetTours
  }
})
