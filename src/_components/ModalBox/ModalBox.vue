<!-- <script setup lang="ts">
import { ref, type Ref, computed } from 'vue'
import { authenticated, fetchData } from '@/assets/fetchMethods'
import FindAuthors from '@/_components/FindAuthors/FindAuthors.vue'

const modal = ref()

defineProps(['docRef', 'field', 'value'])

const show = ref(false)
// <span :docRef="docRef" :field="field" :value="value"><slot /></span>
// const { docRef, field, value } = props

// const root: Ref<HTMLElement | null> = ref(null)
// const inputValue: Ref<string> = ref(oldValue)
// const isLeftToRight = ref(false)

// // const visibility: Ref = defineModel<boolean>('visibility')
// const authorList: Ref = ref<Array<{ label: string; count: number }>>([])

// const showFindAuthorDropdown = computed(() => field.includes('author'))

// const onSubmit = () => {
//   const newValue =
//     showFindAuthorDropdown.value && authorList.value.length > 0
//       ? authorList.value[0].label
//       : inputValue.value

//   const applyEverywhere = showFindAuthorDropdown.value && authorList.value.length > 0 ? true : false

//   console.log(`new value: ${newValue}, apply everywhere? ${applyEverywhere}`)

//   const fieldName = field.charAt(0).toUpperCase() + field.slice(1)

//   const body = JSON.stringify({
//     docRef: docRef,
//     field: fieldName,
//     value: newValue,
//     applyEverywhere: applyEverywhere
//   })
//   fetchData('correct-metadata', 'post', body)
//     .then((result) => result.json().then(() => close()))
//     .catch((error) => console.error(error))
// }

// const close = () => {
//   if (root.value !== null) {
//     root.value.classList.remove('animate__fadeIn')
//     root.value.classList.add('animate__fadeOut')
//     setTimeout(() => (visibility.value = false), 500) // Returns control to main page
//     inputValue.value = oldValue
//     authorList.value = []
//   }
// }
</script> -->
<!-- <template>
  <div v-if="open" class="modal-mask">
    <div class="modal-card modal-wrapper">
      <div class="modal-container" ref="target">
        <div class="modal-header">
          <slot name="header"> default header </slot>
        </div>
        <div class="modal-body">
          <slot name="body"> default content </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <div>
              <button @click.stop="emit('modal-close')">Submit</button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template> -->
<template>
  <Transition name="fade">
    <div class="modal fade" :class="active" v-if="visible">
      <div class="modal-background" @click="close"></div>
      <div class="modal-content">
        <header class="modal-card-head">
          <slot name="header"></slot>
          <button class="delete" aria-label="close" @click="close"></button>
        </header>
        <section class="modal-card-body">
          <slot name="body"></slot>
        </section>
        <footer class="modal-card-foot">
          <div class="buttons">
            <slot name="footer"></slot>
            <button class="button is-link is-light" @click="close">
              {{ $t('cancel') }}
            </button>
          </div>
        </footer>
      </div>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { authenticated } from '@/assets/fetchMethods'
const active = ref('')

const data: Ref = defineModel('data')
const visible = ref(false)

watch(data, (newv: { open: string }) => {
  visible.value = newv.open ? true : false
  active.value = newv.open ? 'is-active' : ''
})

const close = () => {
  data.value.open = false
  visible.value = false
  active.value = ''
}

const submitHandler = () => {
  //here you do whatever
}

const emit = defineEmits(['modal-close'])

const target = ref(null)
const onSubmit = () => {
  //   const newValue =
  //     showFindAuthorDropdown.value && authorList.value.length > 0
  //       ? authorList.value[0].label
  //       : inputValue.value
  //   const applyEverywhere = showFindAuthorDropdown.value && authorList.value.length > 0 ? true : false
  //   console.log(`new value: ${newValue}, apply everywhere? ${applyEverywhere}`)
  //   const fieldName = field.charAt(0).toUpperCase() + field.slice(1)
  const body = JSON.stringify({
    docRef: data.value.docRef,
    field: data.value.field,
    value: data.value.value
    // applyEverywhere: applyEverywhere
  })
  //   fetchData('correct-metadata', 'post', body)
  //     .then((result) => result.json().then(() => close()))
  //     .catch((error) => console.error(error))
}
// onClickOutside(target, () => emit('modal-close'))
</script>
<style scoped>
/* .modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-container {
  width: 300px;
  margin: 150px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
} */
</style>
