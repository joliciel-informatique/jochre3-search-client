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
      <div class="columns field has-addons">
        <span
          class="column is-flex is-flex-direction-row is-flex-wrap-nowrap field is-horizontal"
          :class="metadataModal.field !== 'publicationYear' ? 'has-icons-right' : ''"
        >
          <p class="control is-expanded">
            <input
              :id="metadataModal.field"
              :type="metadataModal.field === 'publicationYear' ? 'number' : 'text'"
              class="input"
              :class="{
                'ltr-align': fieldLeftToRight && preferences.needsLeftToRight,
                english: fieldLeftToRight && preferences.needsLeftToRight,
                'rtl-align': !fieldLeftToRight && preferences.needsRightToLeft
              }"
              lang="yi"
              name="fixWordSuggestionInput"
              v-model="metadataModal.value"
              :disabled="authorList.length > 0"
              :alt="$t('search.keyboard')"
              :title="$t('search.keyboard')"
            />
          </p>
          <simple-keyboard
            v-model:attach-to="metadataModal.field"
            v-model:reference="metadataModal.value"
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
                  :id="`new-author-${metadataModal.field}`"
                  type="text"
                  class="input"
                  lang="yi"
                  v-model="authorText"
                  :placeholder="$t('search.authorPlaceholder')"
                />
              </p>
              <simple-keyboard
                :attach-to="`new-author-${metadataModal.field}`"
                v-model:reference="authorText"
                @onEnter="null"
              />
            </span>
          </span>
          <author-dropdown
            :attach-to="`new-author-${metadataModal.field}`"
            v-model:author-text="authorText"
            v-model:author-list="authorList"
          />
        </span>
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
import { ref, computed, type Ref, watch } from 'vue'
import { authenticated, fetchData } from '@/assets/fetchMethods'
import ModalBox from '@/_components/ModalBox/ModalBox.vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'
const preferences = usePreferencesStore()

const metadataModal: Ref = defineModel('metadataModal')
const notification = defineModel('notification')
const showFindAuthorDropdown = computed(() => metadataModal.value.field?.includes('author'))
const authorList: Ref = ref<Array<{ label: string; count: number }>>([])
const authorText = ref('')
const fieldLeftToRight = computed(() =>
  ['authorEnglish', 'titleEnglish', 'publisher'].includes(metadataModal.value.field)
)

watch(metadataModal, (newV) => {
  console.log(newV.field)
})

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

const capitalizeFirstLetter = (string: String) => string.charAt(0).toUpperCase() + string.slice(1)
</script>
