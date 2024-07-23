<template>
  <div
    v-show="FixMetaDataVisible.value"
    v-on:keydown.esc="onCancel"
    class="modal"
    tabindex="100"
    :class="{ 'is-active': FixMetaDataVisible.value }"
  >
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t('fix-metadata.title') }}</p>
        <button class="delete" aria-label="close" @click="onCancel"></button>
      </header>
      <section class="modal-card-body">
        <div v-if="!authenticated" class="is-italic has-text-weight-bold has-text-danger">
          {{ $t('fix-metadata.unauthenticated') }}
        </div>
        <div>{{ $t('fix-metadata.instructions') }}</div>
        <div class="field has-addons">
          <label class="label">{{ $t('fix-metadata.field') }}</label>
          {{ $t(`fix-metadata.field-type.${FixMetaDataField.capital()}`) }}
        </div>
        <div class="field has-addons" v-if="FixMetaDataField.capital() === 'Author'">
          <input
            type="radio"
            name="authorMethod"
            value="input"
            id="authorMethod-input"
            v-if="showFindAuthorDropdown.value"
            v-model="searchAuthors.value"
          />
          <label for="fixMetaDataValueInput" class="label">{{ $t('fix-metadata.new-value') }}</label>
          <input
            class="input keyboardInput"
            id="fixMetaDataValueInput"
            :class="{
              'ltr-align': isLeftToRight.value && $i18n.locale === 'yi',
              english: isLeftToRight.value && $i18n.locale === 'yi'
            }"
            type="text"
            lang="yi"
            :placeholder=FixMetaDataValue
            v-model="FixMetaDataValue"
            :disabled="searchAuthors.value"
          />
        </div>
        <div class="field has-addons mb-0" v-if="showFindAuthorDropdown.value">
          <input
            type="radio"
            name="authorMethod"
            value="dropdown"
            id="authorMethod-dropdown"
            v-model="searchAuthors.value"
          />
          <label for=findAuthors class="label">{{ $t('fix-metadata.or-merge-with') }} </label>
          <FindAuthors />
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
import FindAuthors from '@/_components/FindAuthors/FindAuthors.vue';
import { authenticated } from '@/assets/fetchMethods';
import { onSubmit, onCancel} from './FixMetaData-methods';
import { FixMetaDataVisible, isLeftToRight, FixMetaDataValue, FixMetaDataField } from './FixMetaData-variables';
import { showFindAuthorDropdown, searchAuthors } from '@/_components/FindAuthors/FindAuthors-variables';
</script>
