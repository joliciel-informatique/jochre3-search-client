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

  const tour = (tourId: string) => {
    completedSteps.value = []
    remainingSteps.value = []
    remainingSteps.value = JSON.parse(JSON.stringify(tours.value[tourId]))
    remainingSteps.value = remainingSteps.value
      .map((step) => {
        if (!step) return undefined
        return document.querySelector(step.id) ? step : undefined
      })
      .filter((x) => x)
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
