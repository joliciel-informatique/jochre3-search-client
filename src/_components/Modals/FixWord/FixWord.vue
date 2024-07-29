<template>
  <div
    ref="root"
    v-show="visibility"
    v-on:keydown.esc="close"
    class="modal is-active animate__animated animate__faster"
    tabindex="100"
    :class="{
      animate__fadeIn: visibility
    }"
  >
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t('fix-word.title') }}</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <div v-if="!authenticated" class="is-italic has-text-weight-bold has-text-danger">
          {{ $t('fix-word.unauthenticated') }}
        </div>
        <div v-if="wordImage !== ''">
          <img :src="wordImage" />
        </div>
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
          <button class="button is-link is-light" @click="close">
            {{ $t('cancel') }}
          </button>
        </div>
      </footer>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="close"></button>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { authenticated, fetchData } from '@/assets/fetchMethods'

const root: Ref<HTMLElement | null> = ref(null)
const visibility: Ref = defineModel<boolean>('visibility')

const word = defineModel('word')
const wordImage: Ref = defineModel<string>('wordImage')
const wordOffset: Ref = defineModel<number>('wordOffset')

const { docRef } = defineProps(['docRef'])

const onSubmit = () => {
  const data = JSON.stringify({
    docRef: docRef,
    offset: +wordOffset.value,
    suggestion: word.value
  })

  fetchData('suggest-word', 'post', data, 'application/json')
    .then(() => close())
    .catch(() => close())
}

// const cacheWordImages = (ref : string, page : number, highlights : number[][]) => {
//   highlights.forEach(highlight => {
//       const params : URLSearchParams = new URLSearchParams({ 'doc-ref' : ref, 'word-offset' : highlight[0].toString() })

//       fetchData('word-image', 'get', params, 'image/png', 'arraybuffer')
//       .then(response => (response.status === 200) ? response.arrayBuffer()
//       .then(buffer =>
//           cachedImages.value.push({
//               docRef : ref,
//               page : page,
//               offset : highlight[0],
//               image : `data:${response.headers.get('content-type')};base64,${btoa(Array.from(new Uint8Array(buffer)).map((b) => String.fromCharCode(b)).join(''))}`
//       })) : null)
//   })
// }

const close = () => {
  if (root.value !== null) {
    root.value.classList.remove('animate__fadeIn')
    root.value.classList.add('animate__fadeOut')
    setTimeout(() => (visibility.value = false), 500) // Returns control to main page
  }
}
</script>
