<template>
  <div>
    <h1 class="title yiddish">
      <a :href="result.metadata.url" target="_blank">{{ result.metadata.title ?? result.docRef }}</a>
      <button @click="fixMetadata(result.docRef, 'Title', result.metadata.title)" class="button is-small is-white">
        <span class="icon is-small fa-2xs">
          <font-awesome-icon icon="pen-to-square" />
        </span>
      </button>
    </h1>
    <div v-for="(value, field) in resultWithKeys" :key="field">
      <SingleResultItem :docRef="result.docRef" :field="field" :value="value" />
    </div>    
    <!-- <div>
      <strong>{{ $t('results.document-reference') }}</strong>&nbsp;{{ result.docRef }}
    </div> -->
    <DisplaySnippets :resultSnippets="result.snippets" :docRef="result.docRef"/>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { inject } from 'vue'
import * as hash from 'object-hash';
import SingleResultItem from './SingleResultItem.vue';
import DisplaySnippets from '../../DisplaySnippets/DisplaySnippets.vue';

// Setup EventBus
const eventBus : any = inject('eventBus')
const fixMetadata = (docRef : string, field : string, value : string) => eventBus.emit('fixMetadataModal', [docRef, field, value, true])

const result = defineModel('singleResult', { type : Object })

// Add new fields to display here
const displayedFieldNames = [
  'title', 
  'titleEnglish', 
  'author', 
  'authorEnglish', 
  'publicationYear', 
  'publisher', 
  'key' // Generated for loop; omitted in template
]

Object.defineProperty(result.value.metadata, "key", { value : hash.sha1(result.value.metadata), enumerable : true })

const resultWithKeys : object = Object.fromEntries(Object.entries(result.value.metadata).filter(([k]) => displayedFieldNames.includes(k)))

</script>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>
