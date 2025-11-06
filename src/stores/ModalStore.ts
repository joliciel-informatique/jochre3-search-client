import { ref } from 'vue'
import { defineStore } from 'pinia'

// Import interfaces
import { type Notification } from '@/assets/interfacesExternals'

export const useModalStore = defineStore('modalStore', () => {
  const notification = ref<Notification>({
    error: false,
    delay: 0,
    msg: ''
  })

  return { notification }
})
