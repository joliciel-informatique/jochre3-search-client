<template>
  <ModalBox v-model:show="showImageModal" v-model:close-func="close">
    <template #header>
      <p class="modal-card-title">{{ imageModalData.title }}</p>
    </template>
    <template #body>
      <div v-if="imageModalData.data">
        <img
          :src="imageModalData.data"
          :alt="$t('large-image.image-alt', [imageModalData.title])"
        />
      </div>
    </template>
    <template #footer></template>
  </ModalBox>
</template>

<script setup lang="ts">
import { defineAsyncComponent, type Ref } from 'vue'
import { useModalStore } from '@/stores/ModalStore'
import { storeToRefs } from 'pinia'

const modalStore = useModalStore()
const { imageModalData, showImageModal } = storeToRefs(modalStore)

const ModalBox = defineAsyncComponent(() => import('@/_components/ModalBox/ModalBox.vue'))

const close = () => {
  showImageModal.value = false
}
</script>
