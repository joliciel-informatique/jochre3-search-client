<template>
  <ModalBox v-model:data="preferences" v-model:notification="notification">
    <template #header>
      <p class="modal-card-title">{{ $t('preferences.title') }}</p>
    </template>
    <template #body>
      <div class="p-3">
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
import { defineAsyncComponent, ref } from 'vue'
import { fetchData } from '@/assets/fetchMethods'
import { storeToRefs } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import VueI18n from 'vue-i18n'

const ModalBox = defineAsyncComponent(() => import('@/_components/ModalBox/ModalBox.vue'))

const notification = defineModel('notification')
const preferences = usePreferencesStore()
const keycloak = useKeycloakStore().keycloak
const authenticated = ref<boolean>(keycloak?.authenticated ?? false)
const cookies = useCookies(['locale', 'resultsPerPage', 'snippetsPerResult'])
const setToLanguage = ref(preferences.language)

const { resultsPerPage, snippetsPerResult } = storeToRefs(preferences)

const save = (vi18n: VueI18n.VueI18n) => {
  if (authenticated.value) {
    const params = JSON.stringify({
      language: setToLanguage.value,
      resultsPerPage: preferences.resultsPerPage,
      snippetsPerResult: preferences.snippetsPerResult
    })

    fetchData('preferences/user', 'post', params)
      .then((res) => {
        if (res.status === 200) {
          preferences.language = setToLanguage.value
          vi18n.locale = setToLanguage.value

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
    preferences.language = setToLanguage.value
    vi18n.locale = setToLanguage.value
    cookies.set('locale', setToLanguage)
    cookies.set('resultsPerPage', resultsPerPage)
    cookies.set('snippetsPerResult', snippetsPerResult)

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
