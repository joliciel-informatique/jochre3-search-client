<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import axios from 'axios'
import { store } from '../store.js'
import VueI18n from 'vue-i18n'

defineProps(['visible'])
const emit = defineEmits(['onCloseModal'])

const API_URL = inject('apiUrl')

function onSubmit(vi18n: VueI18n.VueI18n) {
  console.log('onSubmit')
  axios
    .post<UserPreferences>(
      `${API_URL}/preferences/user`,
      {
        language: language.value
      },
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${store.keycloakToken}`
        }
      }
    )
    .then((response) => {
      console.log('Saved preferences')
      vi18n.locale = language.value
    })
  emit('onCloseModal')
}

function onCancel() {
  console.log('onCancel')
  emit('onCloseModal')
}

interface UserPreferences {
  language: string
}

const language = ref<string>('en')

function onFocus() {
  console.log('onFocus')
  axios
    .get<UserPreferences>(`${API_URL}/preferences/user`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${store.keycloakToken}`
      }
    })
    .then((response) => {
      language.value = response.data.language
    })
}
</script>

<template>
  <div class="modal" tabindex="100" :class="{ 'is-active': visible }" @focus="onFocus">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">User preferences</p>
        <button class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Language</label>
          <div class="control">
            <div class="select">
              <select v-model="language">
                <option value="yi">Yiddish</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-link" @click="onSubmit($i18n as VueI18n.VueI18n)">Submit</button>
          <button class="button is-link is-light" @click="onCancel">Cancel</button>
        </div>
      </footer>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="onCancel"></button>
  </div>
</template>
