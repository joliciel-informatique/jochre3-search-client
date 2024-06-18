<script setup lang="ts">
import { inject, ref } from 'vue'
import axios from 'axios'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import VueI18n from 'vue-i18n'
import { useCookies } from 'vue3-cookies'

defineProps(['visible'])
const emit = defineEmits(['onCloseModal'])
const keycloak = useKeycloakStore().keycloak
const { cookies } = useCookies()

const authenticated = ref<boolean>(keycloak?.authenticated ?? false)

const preferences = usePreferencesStore()

const API_URL = inject('apiUrl')

function onSubmit(vi18n: VueI18n.VueI18n) {
  console.log('onSubmit')
  if (authenticated.value) {
    axios
      .post(
        `${API_URL}/preferences/user`,
        {
          language: preferences.language,
          resultsPerPage: preferences.resultsPerPage,
          snippetsPerResult: preferences.snippetsPerResult
        },
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${keycloak?.token}`
          }
        }
      )
      .then((_response) => {
        console.log('Saved preferences to database')
        vi18n.locale = preferences.language
      })
      .catch((error) => {
        console.error(error)
      })
  } else {
    console.log('Saved preferences in cookie')
    cookies.set('preferences', JSON.stringify(preferences))
    vi18n.locale = preferences.language
  }
  emit('onCloseModal')
}

function onCancel() {
  console.log('onCancel')
  emit('onCloseModal')
}
</script>

<template>
  <div class="modal" tabindex="100" :class="{ 'is-active': visible }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t('preferences.title') }}</p>
        <button class="delete" aria-label="close" @click="onCancel"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">{{ $t('preferences.language') }}</label>
          <div class="control">
            <div class="select">
              <select v-model="preferences.language">
                <option value="yi">ייִדיש</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label">{{ $t('preferences.results-per-page') }}</label>
          <div class="control">
            <input class="input" type="number" v-model="preferences.resultsPerPage" />
          </div>
        </div>
        <div class="field">
          <label class="label">{{ $t('preferences.snippets-per-result') }}</label>
          <div class="control">
            <input class="input" type="number" v-model="preferences.snippetsPerResult" />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-link" @click="onSubmit($i18n as VueI18n.VueI18n)">
            {{ $t('save') }}
          </button>
          <button class="button is-link is-light" @click="onCancel">
            {{ $t('cancel') }}
          </button>
        </div>
      </footer>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="onCancel"></button>
  </div>
</template>
