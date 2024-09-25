<template>
  <ModalBox v-model:data="wordModal" v-model:notification="notification">
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
          <span class="column field has-addons has-addons-left is-horizontal">
            <p class="control is-expanded">
              <input
                class="input keyboardInput"
                :class="{
                  'rtl-align': preferences.needsRightToLeft
                }"
                type="text"
                name="fixWordSuggestionInput"
                lang="yi"
                v-model="wordSuggestion"
                vki-id="fixWord"
              />
            </p>
            <p class="control">
              <button
                class="button is-clickable is-medium is-info keyboardInputButton"
                vki-id="fixWord"
                :alt="$t('search.keyboard')"
                :title="$t('search.keyboard')"
              >
                <font-awesome-icon icon="keyboard" />
              </button>
            </p>
          </span>
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ModalBox from '@/_components/ModalBox/ModalBox.vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

const wordModal: Ref = defineModel('wordModal')
const notification: Ref = defineModel('notification')
const wordImage = ref('')
const wordLoading = ref(false)
const wordSuggestion = ref('')

onBeforeUpdate(async () => {
  if (wordModal.value.docRef && wordModal.value.selection) {
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
  }
})

const loadWordImage = async (params: URLSearchParams) => {
  const response = await fetchData('word-image', 'get', params, 'image/png', 'arraybuffer')
  if (response.status !== 200) {
    notification.value = {
      show: true,
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
      show: true,
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
    offset: +wordModal.value.globalOffset,
    suggestion: wordSuggestion.value
  })
  fetchData('suggest-word', 'post', data, 'application/json')
    .then((res) => {
      if (res.status === 200) {
        notification.value = {
          show: true,
          error: false,
          delay: 4000,
          msg: 'Thanks for your correction! The JOCHRE crew will review this suggestion.'
        }
      } else {
        notification.value = {
          show: true,
          error: true,
          delay: 4000,
          msg: 'Something went wrong! Contact us if this error persists!'
        }
      }
      closeFunc()
    })
    .catch((error) => {
      notification.value = {
        show: true,
        error: true,
        delay: 4000,
        msg: `Something went wrong: ${error}! Contact us if this error persists!`
      }
      closeFunc()
    })
}
</script>
