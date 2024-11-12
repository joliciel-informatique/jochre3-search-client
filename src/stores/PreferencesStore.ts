import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { fetchData } from '@/assets/fetchMethods'
import { useCookies } from '@vueuse/integrations/useCookies'

export const usePreferencesStore = defineStore('preferences', () => {
  const keycloakStore = useKeycloakStore()
  const keycloak = keycloakStore.keycloak

  const show = ref(false)
  const storePreferencesInCookie = ref(true)
  const language = ref('yi')
  const resultsPerPage = ref(10)
  const authorFacetCount = ref(10)
  const corpusLanguage = ref('yi')
  const displayPerBook = ref(false)
  const facetSortBy = ref('hits')

  const displayLeftToRight = computed(() => language.value !== 'yi')

  const corpusLeftToRight = computed(() => corpusLanguage.value !== 'yi')

  /**
   * Called by non top-level controls which are ALWAYS left-to-right (e.g. alternate author name)
   * Returns true if we need to add an explicit LTR class to a control.
   */
  const needsLeftToRight = computed(() => !displayLeftToRight.value)

  /**
   * Called by non top-level controls which are right-to-left IF the underlying corpus is right-to-left.
   *
   * Returns true if we need to add an explicit RTL class to a control.
   */
  const needsRightToLeft = computed(() => !corpusLeftToRight.value && displayLeftToRight.value)

  const cookies = useCookies([
    'locale',
    'resultsPerPage',
    'authorFacetCount',
    'displayPerBook',
    'facetSortBy'
  ])

  function save() {
    const authenticated = keycloak?.authenticated ?? false
    if (authenticated) {
      const params = JSON.stringify({
        language: language.value,
        resultsPerPage: resultsPerPage.value,
        authorFacetCount: authorFacetCount.value,
        displayPerBook: displayPerBook.value,
        facetSortBy: facetSortBy.value
      })

      fetchData('preferences/user', 'post', params)
        .then((res) => {
          if (res.status === 200) {
            console.log(`Successfully saved your preferences to API.`)
          } else {
            console.error('API returned error code when saving preferences.')
          }
        })
        .catch((error) => {
          console.error(`There was an error: ${error} saving your preferences to API`)
        })
    } else {
      cookies.set('locale', language.value)
      cookies.set('resultsPerPage', resultsPerPage.value)
      cookies.set('authorFacetCount', authorFacetCount.value)
      cookies.set('displayPerBook', displayPerBook.value)
      cookies.set('facetSortBy', facetSortBy.value)

      console.log(`Successfully saved your preferences in a cookie.`)
    }
  }

  interface UserPreferences {
    language?: string
    resultsPerPage?: number
    displayPerBook?: boolean
    authorFacetCount?: number
    facetSortBy?: string
  }

  async function load(): Promise<string> {
    return fetchData('preferences/user', 'get')
      .then((res) => {
        if (res.status === 200) {
          console.log('Retrieve user preferences from API')
          return res
            .json()
            .then((userPreferences: UserPreferences) => {
              if (userPreferences.language) {
                language.value = userPreferences.language
              }
              if (userPreferences.resultsPerPage) {
                resultsPerPage.value = userPreferences.resultsPerPage
              }
              if (userPreferences.authorFacetCount) {
                authorFacetCount.value = userPreferences.authorFacetCount
              }
              if (userPreferences.facetSortBy) {
                facetSortBy.value = userPreferences.facetSortBy
              }
              if (userPreferences.displayPerBook !== undefined) {
                displayPerBook.value = userPreferences.displayPerBook
              }
              return language.value
            })
            .catch((error) => {
              console.error(`Unable to convert to JSON`)
              return language.value
            })
        } else {
          console.error(`Failed to retrieve user preferences from API. Status: ${res.status}`)
          return language.value
        }
      })
      .catch((error) => {
        console.error(`Unable to get user preferences from API`)
        return language.value
      })
  }

  function loadFromCookies() {
    const authenticated = keycloak?.authenticated ?? false

    if (!authenticated) {
      console.log(`Not authenticated. Getting preferences from cookie.`)
      if (cookies.get('locale')) {
        const languageCookie = cookies.get('locale').value as string
        language.value = languageCookie
      }
      if (cookies.get('resultsPerPage')) {
        const resultsPerPageCookie = cookies.get('resultsPerPage').value as number
        resultsPerPage.value = resultsPerPageCookie
      }
      if (cookies.get('displayPerBook')) {
        const displayPerBookCookie = cookies.get('displayPerBook').value as boolean
        displayPerBook.value = displayPerBookCookie
      }
      if (cookies.get('authorFacetCount')) {
        const authorFacetCountCookie = cookies.get('authorFacetCount').value as number
        authorFacetCount.value = authorFacetCountCookie
      }
      if (cookies.get('facetSortBy')) {
        const facetSortByCookie = cookies.get('facetSortBy').value as string
        facetSortBy.value = facetSortByCookie
      }
    }
  }

  return {
    show,
    storePreferencesInCookie,
    language,
    resultsPerPage,
    authorFacetCount,
    corpusLanguage,
    displayLeftToRight,
    needsLeftToRight,
    needsRightToLeft,
    corpusLeftToRight,
    displayPerBook,
    facetSortBy: facetSortBy,
    save,
    load,
    loadFromCookies
  }
})
