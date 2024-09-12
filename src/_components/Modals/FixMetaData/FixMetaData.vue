<template>
  <ModalBox v-model:data="metadataModal">
    <template #header>
      <p class="modal-card-title">
        {{ $t('fix-metadata.title', [$t(`fix-metadata.field-type.${field}`)]) }}
      </p>
    </template>
    <template #body>
      <div v-if="!authenticated" class="is-italic has-text-weight-bold has-text-danger">
        {{ $t('fix-metadata.unauthenticated') }}
      </div>
      <label class="label">{{ $t('fix-metadata.instructions') }}</label>
      <div class="pb-0 mb-0 field has-addons">
        <p class="control">
          <a class="button is-static level-item">{{ $t(`fix-metadata.field-type.${field}`) }}</a>
        </p>
        <p class="control container">
          <input
            class="input is-normal is-rounded keyboardInput"
            type="text"
            :alt="$t('search.keyboard')"
            :title="$t('search.keyboard')"
            :vki-id="`${docRef}-${field}`"
            :class="{
              'ltr-align': isLeftToRight && $i18n.locale === 'yi',
              english: isLeftToRight && $i18n.locale === 'yi'
            }"
            v-model="value"
            :disabled="authorList.length > 0"
            lang="yi"
          />
        </p>
        <p class="control">
          <button
            class="button is-clickable is-medium is-info keyboardInputButton"
            :alt="$t('search.keyboard')"
            :title="$t('search.keyboard')"
            :vki-id="`${docRef}-${field}`"
          >
            <font-awesome-icon icon="keyboard" />
          </button>
        </p>
      </div>
      <div class="field has-addons" v-if="showFindAuthorDropdown">
        <FindAuthors
          v-model:authorList="authorList"
          v-model:exclude="value"
          :label="$t('fix-metadata.or-merge-with')"
          :multivalue="false"
        />
      </div>
    </template>
    <template #footer="modalBox">
      <button
        class="button is-link"
        :disabled="!authenticated || value === oldValue"
        @click="save(modalBox.closeFunction)"
      >
        {{ $t('save') }}
      </button>
    </template>
  </ModalBox>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Ref } from 'vue'
import { authenticated, fetchData } from '@/assets/fetchMethods'
import FindAuthors from '@/_components/FindAuthors/FindAuthors.vue'
import ModalBox from '@/_components/ModalBox/ModalBox.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const showFindAuthorDropdown = computed(() => field.value.includes('author'))
const metadataModal: Ref = defineModel('metadataModal')
const isLeftToRight = ref(false)
const authorList: Ref = ref<Array<{ label: string; count: number }>>([])

const oldValue = ref(metadataModal.value.value)
const field = ref('')
const value = ref('')
const docRef = ref(metadataModal.value.docRef)
// const vki_id = `${docRef}-${field}`

watch(metadataModal, (newVal) => {
  field.value = newVal.field
  value.value = newVal.value
  oldValue.value = metadataModal.value.value
})

// TODO: Is the url 'correct-metadata' correct?
// Q: What does applyEverwhere do?
const save = (closeFunc: Function) => {
  const data = JSON.stringify({
    docRef: metadataModal.value.docRef,
    field: metadataModal.value.field,
    value: metadataModal.value.value,
    applyEverywhere: false
  })
  fetchData('correct-metadata', 'post', data, 'application/json')
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
