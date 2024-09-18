<template>
  <Transition>
    <div
      class="notification-overlay"
      :class="notification.show ? 'is-active' : ''"
      v-show="notification.show"
    >
      <div class="card m-3">
        <header
          class="card-header"
          :class="notification.error ? 'has-background-danger' : 'has-background-success'"
        >
          <p class="card-header-title has-text-white">
            <span v-if="notification.error">Uh-oh!</span>
            <span v-else class="is-info">Success</span>
          </p>
          <button
            class="card-header-icon"
            aria-label="close"
            @click="() => (notification.show = !notification.show)"
          >
            <span>
              <FontAwesomeIcon icon="circle-xmark" class="has-text-white" />
            </span>
          </button>
        </header>
        <div class="card-content">
          <div class="content pulled-right">
            {{ notification.msg }}
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { watch, type Ref } from 'vue'
const notification: Ref = defineModel('notification')

watch(notification, () =>
  setTimeout(() => (notification.value.show = false), notification.value.delay)
)
</script>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 150ms ease-in-out;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
