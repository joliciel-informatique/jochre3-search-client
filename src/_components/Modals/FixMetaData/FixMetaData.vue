<template>
  <ModalBox v-model:show="showFixMetadataModal" v-model:close-func="close">
    <template #header>
      <p class="modal-card-title">
        {{ $t('fix-metadata.title', [$t(`fix-metadata.field-type.${field}`)]) }}
      </p>
    </template>
    <template #body>
      <div v-if="!authenticated" class="is-italic has-text-weight-bold has-text-danger">
        {{ $t('fix-metadata.unauthenticated') }}
      </div>
      <div class="p-2">{{ $t('fix-metadata.instructions.normal') }}</div>
      <div class="columns field has-addons">
        <span
          class="column is-flex is-flex-direction-row is-flex-wrap-nowrap field is-horizontal"
          :class="field !== 'publicationYear' ? 'has-icons-right' : ''"
        >
          <p class="control is-expanded">
            <input
              :id="field"
              :type="field === 'publicationYear' ? 'number' : 'text'"
              class="input has-text-dark"
              :class="{
                'ltr-align': fieldLeftToRight && preferences.needsLeftToRight,
                english: fieldLeftToRight && preferences.needsLeftToRight,
                'rtl-align': !fieldLeftToRight && preferences.needsRightToLeft
              }"
              :lang="preferences.corpusLanguage"
              name="fixWordSuggestionInput"
              v-model="metadataValue"
              :disabled="authorList.length > 0"
              :alt="$t('search.keyboard')"
              :title="$t('search.keyboard')"
            />
          </p>
          <simple-key
            v-if="field !== 'publicationYear'"
            v-model:attach-to="field"
            v-model:reference="metadataValue"
            @onEnter="null"
          />
        </span>
      </div>

      <div class="columns is-flex is-flex-direction-column" v-if="showFindAuthorDropdown">
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
        <span class="column field is-horizontal has-addons">
          <span class="column dropdown" :aria-label="$t('search.author')">
            <span class="column field has-addons has-addons-left is-horizontal">
              <p class="control is-expanded">
                <input
                  :id="`new-author-${field}`"
                  type="text"
                  class="input has-text-dark"
                  lang="yi"
                  v-model="authorText"
                  :placeholder="$t('search.authorPlaceholder')"
                />
              </p>
              <simple-key
                :attach-to="`new-author-${field}`"
                v-model:reference="authorText"
                @onEnter="null"
              />
            </span>
          </span>
        </span>
        <author-dropdown
          :attach-to="`new-author-${field}`"
          v-model:author-text="authorText"
          v-model:author-list="authorList"
        />
      </div>
    </template>
    <template #footer>
      <button class="button is-link" :disabled="!authenticated" @click="save">
        {{ $t('modal.save') }}
      </button>
    </template>
  </ModalBox>
</template>

<script setup lang="ts">
import { ref, computed, type Ref, defineAsyncComponent } from 'vue'
import { authenticated, fetchData } from '@/assets/fetchMethods'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import { useModalStore } from '@/stores/ModalStore'
import { storeToRefs } from 'pinia'

const modalStore = useModalStore()
const { notification, fixMetadataModalData, showFixMetadataModal } = storeToRefs(modalStore)

const ModalBox = defineAsyncComponent(() => import('@/_components/ModalBox/ModalBox.vue'))

const preferences = usePreferencesStore()

const authorList: Ref = ref<Array<{ label: string; count: number }>>([])
const authorText = ref('')

const field = computed<string>(() =>
  fixMetadataModalData.value ? fixMetadataModalData.value.field : ''
)
const metadataValue = computed<string>(() =>
  fixMetadataModalData.value?.value ? fixMetadataModalData.value.value : ''
)

const showFindAuthorDropdown = computed<boolean>(() => field.value.includes('author'))

const fieldLeftToRight = computed<boolean>(() =>
  ['authorEnglish', 'titleEnglish', 'publisher'].includes(field.value)
)

const close = () => {
  fixMetadataModalData.value = null
  showFixMetadataModal.value = false
  authorList.value = []
}

const save = () => {
  if (fixMetadataModalData.value) {
    const authorListValue = authorList.value[0]?.label

    const newValue = authorListValue ? authorListValue : fixMetadataModalData.value.value
    const applyEverywhere = authorListValue ? true : false
    const capitalizedField = capitalizeFirstLetter(fixMetadataModalData.value.field)

    const data = JSON.stringify({
      docRef: fixMetadataModalData.value.docRef,
      field: capitalizedField,
      value: newValue,
      applyEverywhere: applyEverywhere
    })

    fetchData('correct-metadata', 'post', data, 'application/json')
      .then((res) => {
        if (res.status === 200) {
          notification.value = {
            error: false,
            delay: 2000,
            msg: 'Thanks, we will review your suggestion!'
          }
        } else {
          notification.value = {
            error: true,
            delay: 4000,
            msg: `Something went wrong: ${res.status}: ${res.statusText}. Try again and if the error persists, contact us!`
          }
        }
        close()
      })
      .catch((error) => {
        notification.value = {
          error: true,
          delay: 4000,
          msg: `Something went wrong: ${error}. Try again and if the error persists, contact us!`
        }
        close()
      })
  }
}

const capitalizeFirstLetter = (string: String) => string.charAt(0).toUpperCase() + string.slice(1)
</script>
