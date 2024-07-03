<template>
    <div class="block has-text-white custom-background has-text-weight-semibold m-0 p-0">
      <div class="container is-max-desktop">
        <div class="field has-addons pb-0 mb-0">
          <input id="query" type="text" v-model="query" class="input is-normal keyboardInput" lang="yi"
            :placeholder="$t('search.query')"
            @change="runNewSearch()"
            @keyup.enter="runNewSearch()"
          />
          <button @click="runNewSearch()" class="button is-normal" v-if="true">
            <span class="icon is-small">
              <font-awesome-icon icon="magnifying-glass" />
            </span>
          </button>
        </div>
        <div class="control pr-2 pl-2">
          <label class="checkbox">
            <input type="checkbox" v-model="relatedWordForms" @change="runNewSearch()" />
            {{ $t('search.related-word-forms') }}
          </label>
        </div>
        <div class="pt-0 mt-0">
          <a @click="showAdvanced = !showAdvanced" class="link-white">
            <span class="m-1">{{ $t('search.advanced') }}</span>
            <span class="icon is-small m-1">
              <font-awesome-icon v-if="!showAdvanced" icon="square-plus" />
              <font-awesome-icon v-if="showAdvanced" icon="square-minus" />
            </span>
          </a>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { defineModel } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Variables
const query = defineModel('query')
const showAdvanced = defineModel('showAdvanced')
const relatedWordForms = defineModel('relatedWordForms')
const page = defineModel('page')
const errorNotificationVisible = defineModel('errorNotificationVisible')

// Parent functions
const emit = defineEmits(['search'])

// Component function
const runNewSearch = () => {
  page.value = 1
  errorNotificationVisible.value = false
  emit('search', query)
}
</script>