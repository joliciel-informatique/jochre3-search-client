<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps(['visible'])
const emit = defineEmits(['onCloseModal'])

function onSubmit() {
  console.log('onSubmit')
  emit('onCloseModal')
}

function onCancel() {
  console.log('onCancel')
  emit('onCloseModal')
}
</script>

<template>
  <div class="modal" :class="{ 'is-active': visible }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">User preferences</p>
        <button class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Language</label>
          <div class="control">
            <div class="select">
              <select>
                <option value="yi">Yiddish</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-link" @click="onSubmit">Submit</button>
          <button class="button is-link is-light" @click="onCancel">Cancel</button>
        </div>
      </footer>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="onCancel"></button>
  </div>
</template>
