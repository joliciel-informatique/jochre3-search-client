<template>
  <ModalBox v-model:data="wordModal">
    <template #header>
      <p class="modal-card-title">{{ $t('fix-word.title') }}</p>
    </template>
    <template #body>
      <div class="is-flex is-flex-direction-column">
        <div v-if="!authenticated" class="is-italic has-text-weight-bold has-text-danger p-2">
          {{ $t('fix-word.unauthenticated') }}
        </div>
        <div class="p-2 has-text-centered" v-if="wordImage !== ''">
          <img :src="wordImage" />
        </div>
        <div class="p-2 field has-addons">
          <input class="input keyboardInput" type="text" lang="yi" v-model="wordSuggestion" />
        </div>
        <div class="p-2 has-text-info">{{ $t('fix-word.instructions') }}</div>
        <div class="p-2 has-text-warning">{{ $t('fix-word.warning') }}</div>
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
const wordSuggestion = ref('')

onBeforeUpdate(async () => {
  const params: URLSearchParams = new URLSearchParams({
    'doc-ref': wordModal.value.docRef,
    'word-offset': (
      wordModal.value.globalOffset + wordModal.value.selection.anchorOffset
    ).toString()
  })

  wordLoading.value = true
  loadWordImage(params)
  loadWordText(params)
  wordLoading.value = false
})

const loadWordImage = async (params: URLSearchParams) => {
  const response = await fetchData('word-image', 'get', params, 'image/png', 'arraybuffer')
  if (response.status !== 200) {
    // TODO: report failure to user
    return null
  } else {
    wordImage.value = await response.arrayBuffer().then(
      (buffer) =>
        `data:${response.headers.get('content-type')};base64,${btoa(
          Array.from(new Uint8Array(buffer))
            .map((buf) => String.fromCharCode(buf))
            .join('')
        )}`
    )
  }
}

const loadWordText = async (params: URLSearchParams) => {
  const response = await fetchData('word-text', 'get', params, 'application/json')
  if (response.status !== 200) {
    // TODO: report failure to user
    return null
  } else {
    wordSuggestion.value = await response.json().then((result) => result.text)
  }
}

const save = (closeFunc: Function) => {
  const data = JSON.stringify({
    docRef: wordModal.value.docRef,
    offset: +wordModal.value.globalOffset,
    suggestion: wordSuggestion.value
  })
  fetchData('suggest-word', 'post', data, 'application/json')
    .then((res) => {
      if (res.status === 200) {
        // TODO: report success to user
      } else {
        // TODO: report failure to user
      }
      closeFunc()
    })
    .catch(() => closeFunc())
}
</script>
