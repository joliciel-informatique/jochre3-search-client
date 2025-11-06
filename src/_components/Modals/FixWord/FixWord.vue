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
          <img :src="wordImage" :alt="$t('fix-word.image-alt', [wordSuggestion])" />
        </div>
        <span class="columns pb-0 mb-0 field">
          <span
            class="column is-flex is-flex-direction-row is-flex-wrap-nowrap field has-addons has-addons-left is-horizontal"
          >
            <p class="control is-expanded">
              <input
                :id="`wordCorrectionInput-${textInputId}`"
                name="wordCorrectionInput"
                class="input has-text-dark"
                :class="{
                  'rtl-align': preferences.needsRightToLeft
                }"
                type="text"
                lang="yi"
                v-model="wordSuggestion"
              />
            </p>
            <simple-key
              :attach-to="`wordCorrectionInput-${textInputId}`"
              v-model:reference="wordSuggestion"
              @onEnter="null"
            />
          </span>
        </span>
        <div class="p-2 has-text-warning">{{ $t('fix-word.instructions') }}</div>
        <div class="p-2 has-text-danger">{{ $t('fix-word.warning') }}</div>
      </div>
    </template>
    <template #footer="modalBox">
      <button
        class="button is-link"
        :disabled="!authenticated"
        @click="save(modalBox.closeFunction)"
      >
        {{ $t('modal.save') }}
      </button>
    </template>
  </ModalBox>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUpdate, ref, type Ref } from 'vue'
import { authenticated, fetchData } from '@/assets/fetchMethods'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { useModalStore } from '@/stores/ModalStore'
import { storeToRefs } from 'pinia'

const modalStore = useModalStore()
const { notification } = storeToRefs(modalStore)
const preferences = usePreferencesStore()

const ModalBox = defineAsyncComponent(() => import('@/_components/ModalBox/ModalBox.vue'))

const wordModal: Ref = defineModel('wordModal')
const wordImage = ref('')
const wordLoading = ref(false)
const wordSuggestion = ref('')
const wordOffset = computed(() =>
  wordModal.value.globalOffset
    ? wordModal.value?.globalOffset + wordModal.value.selection.anchorOffset
    : null
)
const textInputId = computed(() => `${wordModal.value.docRef}-${wordOffset.value}`)

onBeforeUpdate(async () => {
  if (wordModal.value.docRef && wordModal.value.selection) {
    const params: URLSearchParams = new URLSearchParams({
      'doc-ref': wordModal.value.docRef,
      'word-offset': wordOffset.value.toString()
    })

    wordLoading.value = true
    loadWordImage(params)
    loadWordText(params)
    wordLoading.value = false
  }
})

const loadWordImage = async (params: URLSearchParams) => {
  const response = await fetchData('word-image', 'get', params, 'image/png', 'arraybuffer')
  if (response.status !== 200) {
    notification.value = {
      error: true,
      delay: 4000,
      msg: 'Something went wrong! Contact us if this error persists!'
    }
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
    notification.value = {
      error: true,
      delay: 4000,
      msg: 'Sodmething went wrong! Contact us if the error persists!'
    }
  } else {
    wordSuggestion.value = await response.json().then((result) => result.text)
  }
}

const save = (closeFunc: Function) => {
  const data = JSON.stringify({
    docRef: wordModal.value.docRef,
    offset: wordOffset.value,
    suggestion: wordSuggestion.value
  })
  fetchData('suggest-word', 'post', data, 'application/json')
    .then((res) => {
      if (res.status === 200) {
        notification.value = {
          error: false,
          delay: 4000,
          msg: 'Thanks for your correction! The JOCHRE crew will review this suggestion.'
        }
      } else {
        notification.value = {
          error: true,
          delay: 4000,
          msg: 'Something went wrong! Contact us if this error persists!'
        }
      }
      closeFunc()
    })
    .catch((error) => {
      notification.value = {
        error: true,
        delay: 4000,
        msg: `Something went wrong: ${error}! Contact us if this error persists!`
      }
      closeFunc()
    })
}
</script>
