<script setup lang="ts">
import { useKeycloakStore } from '@/stores/KeycloakStore'
import axios from 'axios'
import { inject, ref, watch } from 'vue'

const props = defineProps(['visible', 'docRef', 'wordOffset'])
const emit = defineEmits(['onCloseModal'])
const keycloak = useKeycloakStore().keycloak
const authenticated = ref<boolean>(keycloak?.authenticated ?? false)

const API_URL = inject('apiUrl')

const wordImage = ref<string>()
const word = ref<string>()

watch(
  () => props.wordOffset,
  async (newVal, oldVal) => {
    const wordOffset = Number(newVal)
    loadWordImage(props.docRef, wordOffset)
  }
)

function loadWordImage(docRef: string, wordOffset: number) {
  console.log(`Getting image and text for doc ${docRef}, offset ${wordOffset}`)
  const params = new URLSearchParams()
  params.append('doc-ref', docRef)
  params.append('word-offset', `${wordOffset}`)

  axios
    .get(`${API_URL}/word-image`, {
      params: params,
      headers: {
        accept: 'image/png',
        Authorization: `Bearer ${keycloak?.token}`
      },
      responseType: 'arraybuffer'
    })
    .then((response) => {
      if (response.status == 200) {
        console.log('Found image')
        const b64 = btoa(String.fromCharCode(...new Uint8Array(response.data)))
        const imgData = 'data:' + response.headers['content-type'] + ';base64,' + b64
        wordImage.value = imgData
      }
    })
    .catch((error) => {
      console.error(error)
    })

  interface WordText {
    text: string
  }

  axios
    .get<WordText>(`${API_URL}/word-text`, {
      params: params,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${keycloak?.token}`
      }
    })
    .then((response) => {
      if (response.status == 200) {
        console.log('Found text')
        word.value = response.data.text
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

function onSubmit() {
  console.log('onSubmit')
  axios
    .post(
      `${API_URL}/suggest-word`,
      {
        docRef: props.docRef,
        offset: props.wordOffset,
        suggestion: word.value
      },
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${keycloak?.token}`
        }
      }
    )
    .then((response) => {
      console.log('Word suggestion made')
    })
    .catch((error) => {
      console.error(error)
    })
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
          <label class="label">{{ $t('fix-word.word') }}</label
          >&nbsp;
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
