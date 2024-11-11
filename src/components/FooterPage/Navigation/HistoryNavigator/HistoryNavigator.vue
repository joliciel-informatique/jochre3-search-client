<template>
  <div v-if="totalHits > 0">
    <span class="is-centered">
      <button
        class="button is-info is-small m-1"
        v-tooltip:top.tooltip="$t('navigation.back-tooltip')"
        @click="router.back()"
      >
        {{ $t('back') }}
      </button>
      <button
        class="button is-info is-small m-1"
        v-tooltip:top.tooltip="$t('navigation.forward-tooltip')"
        @click="router.forward()"
      >
        {{ $t('forward') }}
      </button>
      <button
        class="button is-info is-small m-1"
        v-tooltip:top.tooltip="$t('navigation.clear-tooltip')"
        @click="emit('resetSearchResults')"
      >
        {{ $t('results.reset') }}
      </button>
    </span>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const { totalHits } = defineProps(['totalHits'])
const emit = defineEmits(['resetSearchResults'])
// const has_history = history.state.back !== null
</script>
