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
      <div class="p-2">{{ $t('fix-metadata.instructions.normal') }}</div>
      <div class="pb-0 mb-0 field has-addons">
        <span
          class="control container"
          :class="metadataModal.field !== 'publicationYear' ? 'has-icons-right' : ''"
        >
          <p class="control container is-expanded">
            <input
              :id="metadataModal.field"
              :type="metadataModal.field === 'publicationYear' ? 'number' : 'text'"
              class="input"
              :class="{
                'ltr-align': fieldLeftToRight && preferences.needsLeftToRight,
                english: fieldLeftToRight && preferences.needsLeftToRight,
                'rtl-align': !fieldLeftToRight && preferences.needsRightToLeft
              }"
              :alt="$t('search.keyboard')"
              :title="$t('search.keyboard')"
              name="fixWordSuggestionInput"
              lang="yi"
              v-model="metadataModal.value"
              :disabled="authorList.length > 0"
            />
          </p>
          <span
            v-if="metadataModal.field !== 'publicationYear'"
            class="icon is-small is-clickable is-right"
            :alt="$t('search.keyboard')"
            :title="$t('search.keyboard')"
            @click="toggleKeyboard(metadataModal.field)"
            aria-label="hidden"
          >
            <font-awesome-icon icon="keyboard" />
          </span>
        </span>
      </div>

      <div v-show="showFindAuthorDropdown">
        <div class="columns mt-3">
          <div
            class="column is-one-fifth p-2 has-text-warning has-text-weight-semibold"
            role="document"
          >
            {{ $t('fix-metadata.instructions.authorsNote') }}
          </div>
          <div class="column is-flex is-flex-direction-column">
            <div class="p-2 has-text-warning has-text-weight-medium">
              {{ $t('fix-metadata.instructions.authors') }}
            </div>
            <div class="p-2 has-text-warning has-text-weight-medium">
              {{ $t('fix-metadata.instructions.authorsInstruction') }}
            </div>
          </div>
        </div>
        <div class="pb-0 mb-0 field has-addon">
          <FindAuthors
            v-model:authorList="authorList"
            v-model:exclude="metadataModal.value"
            v-model:simple-keyboard="simpleKeyboard"
            v-model:include-author="includeAuthor"
            v-model:include-author-in-transcription="includeAuthorInTranscription"
            :multi-value="false"
            :show-exclude-checkbox="false"
            :unique-id="`fix-metadata-find-authors-${metadataModal.value}`"
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
import { usePreferencesStore } from '@/stores/PreferencesStore'
const preferences = usePreferencesStore()

const simpleKeyboard: Ref = defineModel('simpleKeyboard')

const metadataModal: Ref = defineModel('metadataModal')
const notification = defineModel('notification')
const showFindAuthorDropdown = computed(() => metadataModal.value.field?.includes('author'))
const authorList: Ref = ref<Array<{ label: string; count: number }>>([])
const includeAuthor = computed(() => metadataModal.value.field === 'author')
const includeAuthorInTranscription = computed(() => metadataModal.value.field === 'authorEnglish')
const fieldLeftToRight = computed(() =>
  ['authorEnglish', 'titleEnglish', 'publisher'].includes(metadataModal.value.field)
)

const toggleKeyboard = (attachTo: string) => {
  simpleKeyboard.value.attachTo = attachTo
  simpleKeyboard.value.show = !simpleKeyboard.value.show
  simpleKeyboard.value.ref = metadataModal.value
}

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
