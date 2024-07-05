<template>
  <div v-show="fixWordVisible" class="modal" tabindex="100" :class="{ 'is-active': fixWordVisible }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t('fix-word.title') }}</p>
        <button class="delete" aria-label="close" @click="onCancel"></button>
      </header>
      <section class="modal-card-body">
        <div v-if="!authenticated" class="is-italic has-text-weight-bold has-text-danger">
          {{ $t('fix-word.unauthenticated') }}
        </div>
        <img :src="wordImage" />
        <div>{{ $t('fix-word.instructions') }}</div>
        <div class="field has-addons">
          <label class="label">{{ $t('fix-word.word') }}</label>
          &nbsp;
          <input class="input keyboardInput" type="text" lang="yi" v-model="word" />
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-link" :disabled="!authenticated" @click="onSubmit">
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

<script setup lang="ts">
import { fetchData } from '@/assets/fetchMethods';
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { inject, ref } from 'vue'
const API_URL = inject('apiUrl')

// Authentication
const keycloak = useKeycloakStore().keycloak
const authenticated = ref<boolean>(keycloak?.authenticated ?? false)

// Modal variables
const fixWordVisible = ref<boolean>(false)
const fixWordDocRef = ref<string>('')
const fixWordOffset = ref<number>(0)
const wordImage = ref<string>('')
const word = ref<string>('')

// Setup EventBus
const eventBus : any = inject('eventBus')
eventBus.on('fixWordModal', (value : [string, number, boolean]) => {
  [ fixWordDocRef.value, fixWordOffset.value, fixWordVisible.value] = value
  loadWordImage(fixWordDocRef.value, Number(fixWordOffset.value))
})

const loadWordImage = (docRef: string, wordOffset: number) => {
  console.log(`Getting image and text for doc ${docRef}, offset ${wordOffset}`)
  
  const params : URLSearchParams = new URLSearchParams({
    'doc-ref' : docRef,
    'word-offset' : wordOffset.toString()
  })

  fetchData('word-image', 'get', params, 'image/png', `Bearer ${keycloak?.token}`, 'arraybuffer')
  .then(response => (response.status === 200) ? response.arrayBuffer()
  .then(buffer => wordImage.value = `data:${response.headers.get('content-type')};base64,${btoa(Array.from(new Uint8Array(buffer)).map((b) => String.fromCharCode(b)).join(''))}`) : null)

  fetchData('word-text', 'get', params)
  .then(response => (response.status === 200) ? response.json()
  .then(wordText => word.value = wordText.text) : null)
}

const onSubmit = () => {
  const params : URLSearchParams = new URLSearchParams({
    'docRef' : fixWordDocRef.value.toString(),
    'offset' : fixWordOffset.value.toString(),
    'suggestion': word.value.toString()
  })

  fetch(`${API_URL}/suggest-word?` + params)
  .then(response => {
    console.log(response)
    // (response.status === 200) ? closeModal('success') : closeModal('fail')
})
  // axiosPost('suggest-word', params)
}

const closeModal = (message : string) => {
  console.log(message)
  fixWordVisible.value = false
}

const onCancel = () => {
  console.log('onCancel')
  fixWordVisible.value = false
}
</script>
