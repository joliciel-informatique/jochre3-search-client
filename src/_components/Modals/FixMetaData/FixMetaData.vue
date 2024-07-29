<template>
  <div
    ref="root"
    v-show="visibility"
    v-on:keydown.esc="close"
    class="modal is-active animate__animated animate__faster"
    tabindex="100"
    :class="{
      animate__fadeIn: visibility
    }"
  >
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t('fix-metadata.title') }}</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <div v-if="!authenticated" class="is-italic has-text-weight-bold has-text-danger">
          {{ $t('fix-metadata.unauthenticated') }}
        </div>
        <div class="field has-addons">
          <label class="label"
            >{{ $t('fix-metadata.instructions') }} "{{
              $t(`fix-metadata.field-type.${field}`)
            }}"</label
          >
          <div>
            <label class="label">{{ $t('fix-metadata.new-value') }}</label
            >&nbsp;

            <input
              class="input keyboardInput"
              :class="{
                'ltr-align': isLeftToRight && $i18n.locale === 'yi',
                english: isLeftToRight && $i18n.locale === 'yi'
              }"
              type="text"
              lang="yi"
              v-model="inputValue"
              :disabled="authorList.value > 0"
            />
          </div>
          <div class="field has-addons" v-if="showFindAuthorDropdown">
            <label class="label">{{ $t('fix-metadata.or-merge-with') }}</label>
            <FindAuthors v-model:authorList="authorList" v-model:exclude="inputValue" />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-link" :disabled="!authenticated" @click="onSubmit">
            {{ $t('save') }}
          </button>
          <button class="button is-link is-light" @click="close">
            {{ $t('cancel') }}
          </button>
        </div>
      </footer>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="close"></button>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, computed } from 'vue'
import { authenticated, fetchData } from '@/assets/fetchMethods'
import FindAuthors from '@/_components/FindAuthors/FindAuthors.vue'

const props = defineProps(['docRef', 'field', 'oldValue'])
const { docRef, field, oldValue } = props

const root: Ref<HTMLElement | null> = ref(null)
const inputValue: Ref<string> = ref(oldValue)
const isLeftToRight = ref(false)

const visibility: Ref = defineModel<boolean>('visibility')
const authorList: Ref = ref<Array<{ label: string; count: number }>>([])

const showFindAuthorDropdown = computed(() => field.includes('author'))

const onSubmit = () => {
  const newValue = showFindAuthorDropdown.value
    ? authorList.value
      ? authorList.value
      : inputValue.value
    : inputValue.value

  const applyEverywhere = showFindAuthorDropdown.value ? (authorList.value ? true : false) : false

  console.log(`new value: ${newValue}, apply everywhere? ${applyEverywhere}`)

  const fieldName = field.charAt(0).toUpperCase() + field.slice(1)

  const body = JSON.stringify({
    docRef: docRef,
    field: fieldName,
    value: newValue,
    applyEverywhere: applyEverywhere
  })
  fetchData('correct-metadata', 'post', body)
    .then((result) => result.json().then(() => close()))
    .catch((error) => console.error(error))
}

const close = () => {
  if (root.value !== null) {
    root.value.classList.remove('animate__fadeIn')
    root.value.classList.add('animate__fadeOut')
    setTimeout(() => (visibility.value = false), 500) // Returns control to main page
    inputValue.value = oldValue
    authorList.value = []
  }
}
</script>
