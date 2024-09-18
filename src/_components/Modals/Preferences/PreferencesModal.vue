<template>
  <ModalBox v-model:data="preferences" v-model:notification="notification">
    <template #header>
      <p class="modal-card-title">{{ $t('preferences.title') }}</p>
    </template>
    <template #body>
      <div class="p-3">
        <div class="columns is-vcentered">
          <div class="column"></div>
          <div class="column is-5"></div>
          <div class="column">
            <span class="px-2">
              {{ $t('preferences.cookies') }}
            </span>
            <span v-tooltip:top="$t('preferences.what-are-cookies-tooltip')">
              <FontAwesomeIcon :icon="faQuestionCircle" />
            </span>
          </div>
        </div>
        <div class="columns is-vcentered">
          <div class="column is-5">
            <label class="label">{{ $t('preferences.language') }}</label>
          </div>
          <div class="column is-4">
            <div class="control is-expanded">
              <span class="select is-fullwidth">
                <select v-model="setToLanguage">
                  <option value="yi">ייִדיש</option>
                  <option value="en">English</option>
                </select>
              </span>
            </div>
          </div>
          <div class="column is-1 has-text-centered">
            <input class="checkbox" type="checkbox" v-model="storeLocaleInCookie" />
          </div>
          <div class="column">
            <button
              class="button is-info is-pulled-right"
              :disabled="!cookies.get('locale')"
              @click="clearCookie('locale')"
            >
              {{ $t('preferences.clear-button') }}
            </button>
          </div>
        </div>
        <div class="columns is-vcentered">
          <div class="column is-5">
            <label class="label">{{ $t('preferences.results-per-page') }}</label>
          </div>
          <div class="column is-4">
            <div class="control">
              <input class="input" type="number" v-model="resultsPerPage" />
            </div>
          </div>
          <div class="column is-1 has-text-centered">
            <input class="checkbox" type="checkbox" v-model="storeResultsPerPageInCookie" />
          </div>
          <div class="column">
            <button
              class="button is-info is-pulled-right"
              :disabled="!cookies.get('resultsPerPage')"
              @click="clearCookie('resultsPerPage')"
            >
              {{ $t('preferences.clear-button') }}
            </button>
          </div>
        </div>
        <div class="columns is-vcentered">
          <div class="column is-5">
            <label class="label">{{ $t('preferences.snippets-per-result') }}</label>
          </div>
          <div class="column is-4">
            <div class="control is-expanded">
              <input class="input" type="number" v-model="snippetsPerResult" />
            </div>
          </div>
          <div class="column is-1 has-text-centered">
            <input class="checkbox" type="checkbox" v-model="storeSnippetsPerResultInCookie" />
          </div>
          <div class="column">
            <button
              class="button is-info is-pulled-right"
              :disabled="!cookies.get('snippetsPerResult')"
              @click="clearCookie('snippetsPerResult')"
            >
              {{ $t('preferences.clear-button') }}
            </button>
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
import { fetchData } from '@/assets/fetchMethods'
import { storeToRefs } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import VueI18n from 'vue-i18n'
import ModalBox from '@/_components/ModalBox/ModalBox.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

const notification = defineModel('notification')
const preferences = usePreferencesStore()
const keycloak = useKeycloakStore().keycloak
const authenticated = ref<boolean>(keycloak?.authenticated ?? false)
const cookies = useCookies(['locale', 'resultsPerPage', 'snippetsPerResult'])
const setToLanguage = ref(preferences.language)

const storeLocaleInCookie = ref(true)
const storeResultsPerPageInCookie = ref(true)
const storeSnippetsPerResultInCookie = ref(true)

const { resultsPerPage, snippetsPerResult } = storeToRefs(preferences)

const clearCookie = (cookie: string) => {
  cookies.remove(cookie)
  notification.value = {
    show: true,
    error: false,
    delay: 2000,
    msg: 'Successfully removed this cookie.'
  }
}

const save = (vi18n: VueI18n.VueI18n) => {
  if (authenticated.value) {
    const params = JSON.stringify({
      language: preferences.language,
      resultsPerPage: preferences.resultsPerPage,
      snippetsPerResult: preferences.snippetsPerResult
    })

    fetchData('preferences/user', 'post', params)
      .then((res) => {
        if (res.status === 200) {
          preferences.language = setToLanguage.value
          vi18n.locale = setToLanguage.value
          if (storeLocaleInCookie.value) cookies.set('locale', setToLanguage)
          if (storeResultsPerPageInCookie.value) cookies.set('resultsPerPage', resultsPerPage)
          if (storeSnippetsPerResultInCookie.value)
            cookies.set('snippetsPerResult', snippetsPerResult)
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
  }
  preferences.show = false
}
</script>
