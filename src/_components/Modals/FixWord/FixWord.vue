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
        <input class="input keyboardInput" type="text" lang="yi" v-model="wordText" />
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
const wordText = ref('')

onBeforeUpdate(async () => {
  const params: URLSearchParams = new URLSearchParams({
    'doc-ref': wordModal.value.docRef,
    'word-offset': (
      wordModal.value.globalOffset + wordModal.value.selection.anchorOffset
    ).toString()
  })

  loadWordImage(params)
  loadWordText(params)
})

const loadWordImage = async (params: URLSearchParams) => {
  wordLoading.value = true
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
}

const loadWordText = async (params: URLSearchParams) => {
  const textResponse = await fetchData('word-text', 'get', params, 'application/json')

  textResponse.status === 200
    ? textResponse.json().then((result) => {
        wordText.value = result.text
      })
    : null
}

const save = (closeFunc: Function) => {
  const data = JSON.stringify({
    docRef: wordModal.value.docRef,
    offset: +wordModal.value.globalOffset,
    suggestion: wordText.value
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
