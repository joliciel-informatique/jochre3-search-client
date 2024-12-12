import { computed } from 'vue'
import { i18n } from '@/config/i18n'
import type { Tour, TourStep } from './interfacesExternals'
import type { VueMessageType } from 'vue-i18n'

export const getTour = (tourId: string) => {
  return makeTour(tourId)
}

const makeTour = (tourId: string) =>
  computed(() => {
    if (!i18n) return false
    const steps: Array<VueMessageType> = i18n.global.tm(`tours.${tourId}`)

    // Only continue with valid tourId
    const tour: Tour = {
      tourId: tourId,
      steps: [],
      overlay: true,
      cookieStorage: false,
      defaultTemplate: true,
      startEvent: undefined,
      endDate: undefined,
      scrollableContainerSelector: '',
      labelTerminate: 'close'
    }

    for (const step in steps) {
      const newStep: TourStep = {
        target: (steps[step] as unknown as TourStep).target,
        title: (steps[step] as unknown as TourStep).title,
        description: (steps[step] as unknown as TourStep).description
      }
      tour.steps.push(newStep)
    }
    return tour
  })

// export const tourUponLoad: ComputedRef = computed(() => {
//   console.log(i18n?.global.tm('tours.upon-load'))
//   return {
//     tourId: 'tourUponLoad',
//     overlay: true,
//     defaultTemplate: true,
//     steps: [
//       {
//         target: '#query',
//         title: i18n?.global.tm('tours.upon-load.step-0.title'),
//         description: i18n?.global.tm('tours.upon-load.step-0.description'),
//         tag: 'New!'
//       },
//       {
//         target: '#query-keyboard-btn',
//         title: i18n?.global.tm('tours.upon-load.step-1.title'),
//         description: i18n?.global.tm('tours.upon-load.step-1.description')
//       },
//       {
//         target: '#strictSearchCheckboxBtn',
//         title: 'Strict search',
//         description:
//           'JOCHRE comes with many features to restrict or expand your search. For example, checking this box excludes any lemmata (derived verb forms) from the search results.'
//       },
//       {
//         target: '#advancedSearchBtn',
//         title: 'Advanced search',
//         description:
//           'You can search by specific aspects within the metadata too such as author names, dates and publisher information.'
//       },
//       {
//         target: '#userGuideBtn',
//         title: 'User guide',
//         description:
//           "Note that you can also use special characters in the search bar to format your query. For example, '\"Schvarts\"' (with quotation marks) will not yield the same results as 'Schvarts' without quotation marks. Visit the user guide for a full explanation of your search options!"
//       }
//     ]
//   }
// })

// export const tourUponSearch = {
//   tourId: 'tourUponSearch',
//   overlay: true,
//   defaultTemplate: true,
//   steps: [
//     {
//       target: '#searchResultsToCDesktop',
//       title: 'The search results panel',
//       description:
//         'This panel displays the metadata for the first ten of your results. The title and author remain visible, but you can expand and collapse other metadata.'
//     },
//     {
//       target: '.edit-metadata-btn',
//       title: 'Edit metadata',
//       description:
//         'Buttons such as these allow you to edit the metadata for each title in our database. All proposed changes will be reviewed by YBC staff.'
//     },

//     // Snippets
//     {
//       target: '#snippets',
//       title: 'Snippets',
//       description:
//         'This center panel presents the relevant text snippets by the selected title in the left pane. You can see what title the snippets belong to by the green color on the header bar.'
//     },
//     {
//       target: '.selected-snippet',
//       title: 'Snippet header',
//       description:
//         'Each snippet header presents important information such as the page number, the title and author of the book'
//     },
//     {
//       target: '.open-page-btn',
//       title: 'Page',
//       description: 'This button will take you directly to the page on the YBC website.'
//     },
//     {
//       target: '.open-transcription-btn',
//       title: 'Transcription',
//       description:
//         'This button will open the entire automatically transcribed text in a new window.'
//     },
//     {
//       target: '.snippet-data ',
//       title: 'Snippet',
//       description: 'This is the meat of the text.'
//     },
//     {
//       target: '.snippet-text',
//       title: 'Transcribed text',
//       description: 'This is the transcribed text with your search term highlighted.'
//     },
//     {
//       target: '.load-original-image-button',
//       title: 'Click to load original image',
//       description:
//         'Click this image to load the digital copy of the original scan used in the OCR process.'
//     },
//     {
//       target: '.highlight',
//       title: 'Text correction',
//       description:
//         "You can double-click any word within the transcribed text to propose a correction to the automatically OCR'd text. As with edits to metadata, YBC staff will review your suggested change."
//     },

//     // Facetbar
//     {
//       target: '#facetBarToCDesktop',
//       title: 'Author filters',
//       description:
//         'We also present you with this option to explore your search beyond your current results. Below is a selection of the most common author names associated with your search results. You can select any of these author names to view just their works across the entire corpus outside of your search results.'
//     },
//     {
//       target: '#facets-authors-to-display',
//       title: 'Author filters',
//       description: 'You can change the number of authors '
//     },
//     {
//       target: '#facets-sort-authors',
//       title: 'Author filters',
//       description:
//         'Author names are automatically sorted by number of hits. Other sort options include by name or those that you have selected.'
//     },
//     {
//       target: '#facets-filter-authors',
//       title: 'Author filters',
//       description: 'Search for a specific author'
//     },
//     {
//       target: '.filterTag',
//       title: 'Author filters',
//       description:
//         'Select any of these author names to view just their works across the entire corpus; deselect them to return to your original search results.'
//     },
//     {
//       target: '#collapseFacetBarDesktop',
//       title: 'Author filters',
//       description: 'Feel free to collapse this panel if you don\t use it!'
//     }
//   ]
// }
