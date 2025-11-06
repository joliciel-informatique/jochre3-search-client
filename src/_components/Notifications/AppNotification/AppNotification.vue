<template>
  <Transition>
    <div
      class="notification-overlay corner-notification"
      :class="showNotification ? 'is-active' : ''"
      role="alert"
      v-show="showNotification"
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
            aria-label="dismiss"
            @click="() => (showNotification = !showNotification)"
          >
            <span>
              <font-awesome-icon icon="circle-xmark" class="has-text-white" />
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
import { watch, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useModalStore } from '@/stores/ModalStore'
import { storeToRefs } from 'pinia'

const modalStore = useModalStore()
const { notification } = storeToRefs(modalStore)
const showNotification = ref<boolean>(false)

watch(notification, (newNotif, oldNotif) => {
  console.log(`Notification changed, message: ${newNotif.msg}`)
  showNotification.value = newNotif.msg.length > 0
  setTimeout(() => (showNotification.value = false), newNotif.delay)
})
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
