<template>
  <Transition name="fade">
    <div class="modal fade" :class="active" v-show="visible">
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
            <slot name="footer" :closeFunction="close"></slot>
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
const active = ref('')
const visible = ref(false)
const data: Ref = defineModel('data')
const authorList: Ref = defineModel('authorList')

watch(data, (newv: { open: string }) => {
  visible.value = newv.open ? true : false
  active.value = newv.open ? 'is-active' : ''
})

const close = () => {
  visible.value = false
  active.value = ''
  authorList.value = []
}
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
