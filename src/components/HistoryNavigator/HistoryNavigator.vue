<template>
  <div>
    <span class="is-pulled-left">
      <button @click="router.back()" class="button is-small is-light m-1">
        {{ $t('back') }}
      </button>
      <button @click="router.forward()" class="button is-small is-light m-1">
        {{ $t('forward') }}
      </button>
      <button @click="emit('resetSearchResults')" class="button is-small is-light m-1">
        {{ $t('results.reset') }}
      </button>
    </span>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['resetSearchResults'])
</script>
