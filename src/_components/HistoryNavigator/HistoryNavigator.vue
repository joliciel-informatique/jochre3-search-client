<template>
  <div v-if="has_history">
    <span class="is-centered">
      <button
        @click="router.back()"
        class="button is-info is-small m-1"
        v-tooltip:top.tooltip="$t('navigation.back-tooltip')"
      >
        {{ $t('back') }}
      </button>
      <button
        @click="router.forward()"
        class="button is-info is-small m-1"
        v-tooltip:top.tooltip="$t('navigation.forward-tooltip')"
      >
        {{ $t('forward') }}
      </button>
      <button
        @click="emit('resetSearchResults')"
        class="button is-info is-small m-1"
        v-tooltip:top.tooltip="$t('navigation.clear-tooltip')"
      >
        {{ $t('results.reset') }}
      </button>
    </span>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
// console.log(history.state.back)
const emit = defineEmits(['resetSearchResults'])
const has_history = history.state.back !== null
</script>
