import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { i18n } from '@/config/i18n'
import type { TourStep } from '@/assets/interfacesExternals'
import type { VueMessageType } from 'vue-i18n'
// import type { VueMessageType } from 'vue-i18n'

export const useTourStore = defineStore('tours', () => {
  const displayTour = ref(false)
  // const toursFromTranslationFiles = ref<Array<VueMessageType>>()
  // const tours : Record<string, Array<TourStep>> = ref([])
  const tours = ref<Record<string, Array<TourStep>>>({})

  const remainingSteps = ref<Array<TourStep | undefined>>([])
  const completedSteps = ref<Array<TourStep | undefined>>([])

  const completedTours = ref<Array<string>>([])

  const tourNames = computed(() => {
    const names: Array<string> = []
    for (const tour in tours.value) {
      names.push(tour)
    }
    return names
  })

  const loadTours = async () => {
    if (!i18n) return false
    const toursFromTranslationFiles: Array<VueMessageType> = i18n.global.tm(`tours`)
    if (toursFromTranslationFiles) {
      const tourObject: { [key: string]: Array<TourStep> } = {}
      for (const tour in toursFromTranslationFiles) {
        tourObject[tour] = toursFromTranslationFiles[tour] as unknown as Array<TourStep>
      }
      Object.assign(tours.value, tourObject)
      console.log('Loaded tours from translation files')
    }
  }

  // Check the DOM for visible elements
  // Tour with most visible elements will run
  // Arrays of tour elements in translation files need to match logical order of DOM elements
  // const checkDOM = () => {

  // if (toursFromTranslationFiles.value) {
  // console.log(toursFromTranslationFiles.value)
  // console.log(completedTours.value)
  //   const completedTourIds = completedTours.value.map((tourElement: Tour) => tourElement.id)
  //   // Convert VueMessageType to Tour
  //   tours.value = toursFromTranslationFiles.value.map((tour) =>
  //     Object.entries(tour).map<Tour>(([key, value]) =>
  //       completedTourIds.includes(key)
  //         ? undefined
  //         : Object.assign(value, {
  //             id: key,
  //             inDOM: document.querySelector(key) ? true : false
  //           })
  //     )
  //   )
  //   console.log(tours.value)
  //   // Find array with most inDOM values
  //   const check = tours.value.map((tour) => {
  //     if (!tour) return 0
  //     const c =
  //       (100 / tour.filter((tourElement) => tourElement?.inDOM === true).length) * tour.length
  //     return isFinite(c) ? c : 0
  //   })
  //   console.log(check)
  //   if (check) {
  //     const maxValIdx = check.indexOf(Math.max(...check))
  //     remainingSteps.value = tours.value[maxValIdx]
  //     console.log('\n| Remaining:', remainingSteps.value.length, remainingSteps.value)
  //     completedTours.value = []
  //   }
  // }
  // }

  const tour = (tourId: string) => {
    completedSteps.value = []
    remainingSteps.value = []
    remainingSteps.value = JSON.parse(JSON.stringify(tours.value[tourId]))
  }

  return {
    tourNames,
    tours,
    remainingSteps,
    completedSteps,

    completedTours,

    displayTour,
    loadTours,
    // checkDOM,
    tour
    // startTour,
    // resetTours
  }
})
