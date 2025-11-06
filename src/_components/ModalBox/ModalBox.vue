<template>
  <Transition name="fade">
    <div
      class="modal"
      role="dialog"
      :class="{
        'is-active': data.show
      }"
      v-show="data.show"
    >
      <div class="modal-background" @click="close"></div>
      <div class="modal-content">
        <header class="modal-card-head">
          <slot name="header"></slot>
          <button class="delete" aria-label="Close modal" @click="close"></button>
        </header>
        <section class="modal-card-body">
          <slot name="body"></slot>
        </section>
        <footer class="modal-card-foot">
          <div class="buttons">
            <slot name="footer" :closeFunction="close"></slot>
            <button class="button is-link is-light" @click="close">
              {{ $t('modal.cancel') }}
            </button>
          </div>
        </footer>
      </div>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import { type Ref } from 'vue'

const data: Ref = defineModel('data')
const authorList: Ref = defineModel('authorList')

const close = () => {
  if (data.value) data.value.show = false
  authorList.value = []
}
</script>
<style lang="css" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
