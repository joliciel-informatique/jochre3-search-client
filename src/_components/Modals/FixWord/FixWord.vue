<template>
  <div v-show="fixWordVisible.value" v-on:keydown.esc="onCancel" class="modal" tabindex="100" :class="{ 'is-active': fixWordVisible.value }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t('fix-word.title') }}</p>
        <button class="delete" aria-label="close" @click="onCancel"></button>
      </header>
      <section class="modal-card-body">
        <div v-if="!authenticated" class="is-italic has-text-weight-bold has-text-danger">
          {{ $t('fix-word.unauthenticated') }}
        </div>
        <div v-if="wordImage.value !== ''" >
          <img :src="wordImage.value" />
        </div>
        <div>{{ $t('fix-word.instructions') }}</div>
        <div class="field has-addons">
          <label class="label">{{ $t('fix-word.word') }}</label>
          &nbsp;
          <input class="input keyboardInput" type="text" lang="yi" v-model="word"/>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-link" :disabled="!authenticated" @click="onSubmit">
            {{ $t('save') }}
          </button>
          <button class="button is-link is-light" @click="onCancel">
            {{ $t('cancel') }}
          </button>
        </div>
      </footer>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="onCancel"></button>
  </div>
</template>

<script setup lang="ts">
  import { onCancel, onSubmit } from './FixWord-methods';
  import { authenticated } from '@/assets/fetchMethods';
  import { fixWordVisible, wordImage, word } from './FixWord-variables';
</script>