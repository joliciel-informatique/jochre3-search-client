<template>
  <ModalBox
    v-model:data="metadataModal"
    v-model:notification="notification"
    v-model:author-list="authorList"
  >
    <template #header>
      <p class="modal-card-title">
        {{ $t('fix-metadata.title', [$t(`fix-metadata.field-type.${metadataModal.field}`)]) }}
      </p>
    </template>
    <template #body>
      <div v-if="!authenticated" class="is-italic has-text-weight-bold has-text-danger">
        {{ $t('fix-metadata.unauthenticated') }}
      </div>
      <div class="p-2 has-text-info">{{ $t('fix-metadata.instructions.normal') }}</div>
      <div class="pb-0 mb-0 field has-addons">
        <p class="control">
          <a class="button is-static level-item">{{
            $t(`fix-metadata.field-type.${metadataModal.field}`)
          }}</a>
        </p>
        <p class="control container">
          <input
            class="input is-normal is-rounded keyboardInput"
            aria-label="open onscreen Yiddish keyboard"
            type="text"
            :alt="$t('search.keyboard')"
            :title="$t('search.keyboard')"
            :vki-id="`${metadataModal.docRef}-${metadataModal.field}`"
            :class="{
              'ltr-align': fieldLeftToRight && preferences.needsLeftToRight,
              english: fieldLeftToRight && preferences.needsLeftToRight,
              'rtl-align': !fieldLeftToRight && preferences.needsRightToLeft,
              yiddish: !fieldLeftToRight && preferences.needsRightToLeft
            }"
            v-model="metadataModal.value"
            :disabled="authorList.length > 0"
            lang="yi"
          />
        </p>
        <p class="control">
          <button
            class="button is-clickable is-medium is-info keyboardInputButton"
            aria-label="open onscreen Yiddish keyboard"
            :alt="$t('search.keyboard')"
            :title="$t('search.keyboard')"
            :vki-id="`${metadataModal.docRef}-${metadataModal.field}`"
          >
            <font-awesome-icon icon="keyboard" />
          </button>
        </p>
      </div>
      <div v-show="showFindAuthorDropdown">
        <div class="columns mt-3">
          <div class="column is-one-fifth p-2 has-text-warning has-text-weight-semibold">
            {{ $t('fix-metadata.instructions.authorsNote') }}
          </div>
          <div
            class="column is-flex is-flex-direction-column p-2 has-text-warning has-text-weight-medium"
          >
            {{ $t('fix-metadata.instructions.authors') }}
          </div>
        </div>
        <div class="p-2 has-text-info">
          {{ $t('fix-metadata.instructions.authorsInstruction') }}
        </div>
        <div class="pb-0 mb-0 field has-addon">
          <FindAuthors
            v-model:authorList="authorList"
            v-model:exclude="metadataModal.value"
            :multi-value="false"
            :show-exclude-checkbox="false"
            v-model:include-author="includeAuthor"
            v-model:include-author-in-transcription="includeAuthorInTranscription"
            unique-id="fix-metadata-find-authors"
          />
        </div>
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
import { ref, computed, type Ref } from 'vue'
import { authenticated, fetchData } from '@/assets/fetchMethods'
import FindAuthors from '@/_components/FindAuthors/FindAuthors.vue'
import ModalBox from '@/_components/ModalBox/ModalBox.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { usePreferencesStore } from '@/stores/PreferencesStore'
const preferences = usePreferencesStore()

const metadataModal: Ref = defineModel('metadataModal')
const notification = defineModel('notification')
const showFindAuthorDropdown = computed(() => metadataModal.value.field?.includes('author'))
const authorList: Ref = ref<Array<{ label: string; count: number }>>([])
const includeAuthor = computed(() => metadataModal.value.field === 'author')
const includeAuthorInTranscription = computed(() => metadataModal.value.field === 'authorEnglish')
const fieldLeftToRight = computed(() =>
  ['authorEnglish', 'titleEnglish', 'publisher'].includes(metadataModal.value.field)
)

const save = (closeFunc: Function) => {
  const authorListValue = authorList.value[0]?.label

  const newValue = authorListValue ? authorListValue : metadataModal.value.value
  const applyEverywhere = authorListValue ? true : false
  const capitalizedField = capitalizeFirstLetter(metadataModal.value.field)

  const data = JSON.stringify({
    docRef: metadataModal.value.docRef,
    field: capitalizedField,
    value: newValue,
    applyEverywhere: applyEverywhere
  })

  fetchData('correct-metadata', 'post', data, 'application/json')
    .then((res) => {
      if (res.status === 200) {
        notification.value = {
          show: true,
          error: false,
          delay: 2000,
          msg: 'Thanks, we will review your suggestion!'
        }
      } else {
        notification.value = {
          show: true,
          error: true,
          delay: 4000,
          msg: `Something went wrong: ${res.status}: ${res.statusText}. Try again and if the error persists, contact us!`
        }
      }
      closeFunc()
    })
    .catch((error) => {
      notification.value = {
        show: true,
        error: true,
        delay: 4000,
        msg: `Something went wrong: ${error}. Try again and if the error persists, contact us!`
      }
      closeFunc()
    })
}

const capitalizeFirstLetter = (string: String) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
</script>
