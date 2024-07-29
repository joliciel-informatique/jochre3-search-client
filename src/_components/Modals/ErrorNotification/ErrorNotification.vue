<template>
    <div class="modal notification is-danger fixed-grid has-1-cols" v-if="showErrorNotification">
    <button class="delete" @click="toggleErrorMessage()"></button>
    <div>
        {{ errorMsg }}
    </div>
  </div>
</template>
<script setup lang="ts">
    import { ref } from 'vue';
</script>

<script lang="ts">
const errorMsg = ref('')

const showErrorNotification = ref(false)

const toggleErrorMessage = () => {
    showErrorNotification.value = !showErrorNotification.value
    // errorMsg.value = ''
}

const showErrorMessage = () => {
    showErrorNotification.value = true
}

export const setErrorMessage = (error: Error) => {
    errorMsg.value = error.message
    console.log(error.message)
    showErrorMessage()
}
</script>