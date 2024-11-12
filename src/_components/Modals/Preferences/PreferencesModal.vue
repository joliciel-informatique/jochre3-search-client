<template>
  <ModalBox v-model:data="preferences" v-model:notification="notification">
    <template #header>
      <p class="modal-card-title">{{ $t('preferences.title') }}</p>
    </template>
    <template #body>
      <div class="p-3">
        <div class="columns is-vcentered py-3">
          <div class="column">
            <h1 class="label">{{ $t('preferences.results-heading') }}</h1>
            <div class="is-flex is-flex-direction-column m-2">
              <div class="columns is-vcentered is-10 pb-2">
                <span class="column is-4 px-2">{{ $t('preferences.results-per-page') }}</span>
                <div class="column is-4 control">
                  <input
                    class="input"
                    type="number"
                    name="resultsPerPageInput"
                    v-model="resultsPerPage"
                    @onchange="preferences.resultsPerPage = resultsPerPage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-vcentered py-3">
          <div class="column">
            <h1 class="label">{{ $t('preferences.snippets-heading') }}</h1>
            <div class="is-flex is-flex-direction-row m-2">
              <span class="px-2">{{ $t('preferences.snippets-per-book') }}</span>
              <div class="control is-expanded">
                <label class="switch is-rounded is-small">
                  <input type="checkbox" v-model="displayPerBook" />
                  <span class="check"></span>
                </label>
              </div>
              <span class="px-2">{{ $t('preferences.snippets-as-list') }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button class="button is-link" @click="save($i18n as VueI18n.VueI18n)">
        {{ $t('save') }}
      </button>
    </template>
  </ModalBox>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { fetchData } from '@/assets/fetchMethods'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import VueI18n from 'vue-i18n'
import ModalBox from '@/_components/ModalBox/ModalBox.vue'

const notification = defineModel('notification')
const preferences = usePreferencesStore()
const keycloak = useKeycloakStore().keycloak
const authenticated = ref<boolean>(keycloak?.authenticated ?? false)
const cookies = useCookies(['locale', 'resultsPerPage', 'snippetsPerResult', 'authorFacetCount'])
const setToLanguage = ref(preferences.language)

const resultsPerPage = ref(preferences.resultsPerPage)
const authorFacetCount = ref(preferences.authorFacetCount)
const { snippetsPerResult, displayPerBook } = storeToRefs(preferences)

const save = (vi18n: VueI18n.VueI18n) => {
  preferences.language = setToLanguage.value
  vi18n.locale = setToLanguage.value

  preferences.resultsPerPage = resultsPerPage.value
  preferences.snippetsPerResult = snippetsPerResult.value
  preferences.authorFacetCount = authorFacetCount.value

  if (authenticated.value) {
    const params = JSON.stringify({
      language: setToLanguage.value,
      resultsPerPage: preferences.resultsPerPage,
      snippetsPerResult: preferences.snippetsPerResult,
      authorFacetCount: preferences.authorFacetCount
    })

    fetchData('preferences/user', 'post', params)
      .then((res) => {
        if (res.status === 200) {
          notification.value = {
            show: true,
            error: false,
            delay: 2000,
            msg: `Successfully saved your preferences!`
          }
        } else {
          notification.value = {
            show: true,
            error: true,
            delay: 4000,
            msg: 'There was an error saving your preferences. You may want to reach out to us!'
          }
        }
      })
      .catch((error) => {
        notification.value = {
          show: true,
          error: true,
          delay: 4000,
          msg: `There was an error: ${error} saving your preferences. You may want to reach out to us!`
        }
      })
  } else {
    cookies.set('locale', setToLanguage.value)
    cookies.set('resultsPerPage', resultsPerPage.value)
    cookies.set('snippetsPerResult', snippetsPerResult.value)
    cookies.set('authorFacetCount', authorFacetCount.value)

    notification.value = {
      show: true,
      error: false,
      delay: 2000,
      msg: `Successfully saved your preferences!`
    }
  }
  preferences.show = false
}
</script>
