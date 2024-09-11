<template>
  <ModalBox v-model:data="wordModal">
    <template #header>
      <p class="modal-card-title">{{ $t('fix-word.title') }}</p>
    </template>
    <template #body>
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
        <input class="input keyboardInput" type="text" lang="yi" v-model="wordModal.word" />
      </div>
    </template>
    <template #footer="modalBox">
      <button
        class="button is-link"
        :disabled="!authenticated"
        @click="save(modalBox.closeFunction)"
      >
        {{ $t('save') }}
      </button>
    </template>
  </ModalBox>
</template>

<script setup lang="ts">
import { onBeforeUpdate, ref, type Ref } from 'vue'
import { authenticated, fetchData } from '@/assets/fetchMethods'
import ModalBox from '@/_components/ModalBox/ModalBox.vue'

const wordImage = ref('')
const wordLoading = ref(false)
const wordModal: Ref = defineModel('wordModal')

onBeforeUpdate(async () => {
  wordLoading.value = true
  const params: URLSearchParams = new URLSearchParams({
    'doc-ref': wordModal.value.docRef,
    'word-offset': (
      wordModal.value.globalOffset + wordModal.value.selection.anchorOffset
    ).toString()
  })

  const response = await fetchData('word-image', 'get', params, 'image/png', 'arraybuffer')
  response.status === 200
    ? response.arrayBuffer().then(
        (buffer) =>
          (wordImage.value = `data:${response.headers.get('content-type')};base64,${btoa(
            Array.from(new Uint8Array(buffer))
              .map((buf) => String.fromCharCode(buf))
              .join('')
          )}`)
      )
    : null
  wordLoading.value = false
})

const save = (closeFunc: Function) => {
  const data = JSON.stringify({
    docRef: wordModal.value.docRef,
    offset: +wordModal.value.globalOffset,
    suggestion: wordModal.value.word
  })
  fetchData('suggest-word', 'post', data, 'application/json')
    .then((res) => {
      if (res.status === 200) {
        // Report success to user
      } else {
        // Report failure to user
      }
      closeFunc()
    })
    .catch(() => closeFunc())
}
</script>
