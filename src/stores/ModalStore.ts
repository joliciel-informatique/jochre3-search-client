import { ref } from 'vue'
import { defineStore } from 'pinia'

// Import interfaces
import { type NotificationData, type FixWordModalData } from '@/assets/interfacesExternals'

export const useModalStore = defineStore('modalStore', () => {
  const notification = ref<NotificationData>({
    error: false,
    delay: 0,
    msg: ''
  })

  const fixWordModalData = ref<FixWordModalData | null>()

  const showFixWordModal = ref<boolean>(false)

  return { notification, fixWordModalData, showFixWordModal }
})
