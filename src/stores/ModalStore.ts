import { ref } from 'vue'
import { defineStore } from 'pinia'

// Import interfaces
import {
  type NotificationData,
  type FixWordModalData,
  type FixMetadataModalData,
  type ImageModalData
} from '@/assets/interfacesExternals'

export const useModalStore = defineStore('modalStore', () => {
  const notification = ref<NotificationData>({
    error: false,
    delay: 0,
    msg: ''
  })

  const fixWordModalData = ref<FixWordModalData | null>()

  const showFixWordModal = ref<boolean>(false)

  const fixMetadataModalData = ref<FixMetadataModalData | null>()

  const showFixMetadataModal = ref<boolean>(false)

  const imageModalData = ref<ImageModalData>({
    title: '',
    data: ''
  })

  const showImageModal = ref<boolean>(false)

  return {
    notification,
    fixWordModalData,
    showFixWordModal,
    fixMetadataModalData,
    showFixMetadataModal,
    imageModalData,
    showImageModal
  }
})
