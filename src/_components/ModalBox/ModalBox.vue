<template>
  <Transition name="fade">
    <div
      class="modal"
      role="dialog"
      :class="{
        'is-active': show
      }"
      v-show="show"
    >
      <div class="modal-background" @click="closeFunc"></div>
      <div class="modal-content">
        <header class="modal-card-head">
          <slot name="header"></slot>
          <button class="delete" aria-label="Close modal" @click="closeFunc"></button>
        </header>
        <section class="modal-card-body">
          <slot name="body"></slot>
        </section>
        <footer class="modal-card-foot">
          <div class="buttons">
            <slot name="footer" :closeFunction="closeFunc"></slot>
            <button class="button is-link is-light" @click="closeFunc">
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

const show: Ref = defineModel('show')
const closeFunc: Ref = defineModel('closeFunc')
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
