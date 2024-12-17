<template>
  <ModalBox v-model:data="imageModal">
    <template #header>
      <p class="modal-card-title">{{ imageModal.title }}</p>
    </template>
    <template #body>
      <div v-if="imageModal.data">
        <img :src="imageModal.data" :alt="$t('large-image.image-alt', [imageModal.title])" />
      </div>
    </template>
    <template #footer></template>
  </ModalBox>
</template>

<script setup lang="ts">
import { defineAsyncComponent, type Ref } from 'vue'
const ModalBox = defineAsyncComponent(() => import('@/_components/ModalBox/ModalBox.vue'))

const imageModal: Ref = defineModel('imageModal')
</script>
