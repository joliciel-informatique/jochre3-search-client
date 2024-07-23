<template>
  <div
    ref="root"
    v-show="visibility"
    v-on:keydown.esc="close"
    class="modal is-active animate__animated animate__faster"
    tabindex="100"
    :class="{ 
      'animate__fadeIn' : visibility
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
        <div></div>
        <div class="field has-addons">
          <label class="label">{{ $t('fix-metadata.instructions') }} "{{ $t(`fix-metadata.field-type.${field}`)}}"</label>
          <div>
          <input
            class="input keyboardInput"
            :class="{
              'ltr-align': isLeftToRight && $i18n.locale === 'yi',
              english: isLeftToRight && $i18n.locale === 'yi'
            }"
            type="text"
            lang="yi"
            v-model="inputValue"
            :disabled="(authorList.value > 0)"
          />
          </div>
          <div class="field has-addons" v-if="field.includes('author')">
            <label class="label">Merge with</label>
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
  import { ref, type Ref, computed } from 'vue';
  import { authenticated, fetchData } from '@/assets/fetchMethods';
  import FindAuthors from '@/_components/FindAuthors/FindAuthors.vue';

  const props = defineProps(['docRef', 'field', 'oldValue'])
  const { docRef, field, oldValue } = props

  const root : Ref<HTMLElement | null> = ref(null)
  const inputValue : Ref<string> = ref(oldValue)
  const isLeftToRight = ref(false)

  const visibility : Ref = defineModel<boolean>('visibility')
  const authorList : Ref = ref<Array<{ label : string, count : number }>>([])

  const applyEverywhere = computed(() => !authorList.value)

  const onSubmit = () => {
    const values = (!authorList.value) ? authorList.value : oldValue
    if (values instanceof Array) {
      values.forEach(newValue => {
          const body = JSON.stringify({
              docRef: docRef,
              field: field,
              value: newValue,
              applyEverywhere: applyEverywhere.value
          })
          fetchData('correct-metadata', 'post', body)
          .then((result) => result.json()
          .then(() => close()))
          .catch((error) => console.error(error))
      })
    } else {
  //     const body = JSON.stringify({
  //         docRef: FixMetaDataDocRef.value,
  //         field: FixMetaDataField.value,
  //         value: FixMetaDataValue.value,
  //         applyEverywhere: applyEverywhere.value
  //     })
  //     fetchData('correct-metadata', 'post', body)
  //     .then((result) => result.json()
  //     .then((result) => {
  //         console.log(result)
  //         FixMetaDataVisible.false()
  //       })
  //     )
  //     .catch((error) => {
  //         console.error(error)
  //     })
    }
  }

  const close = () => {
    if (root.value !== null) {
      root.value.classList.remove('animate__fadeIn')
      root.value.classList.add('animate__fadeOut')
      setTimeout(() => visibility.value = false, 500); // Returns control to main page
      inputValue.value = oldValue
      authorList.value = []
    }
  }
</script>