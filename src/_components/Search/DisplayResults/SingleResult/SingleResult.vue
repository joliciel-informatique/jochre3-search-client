<template>
  <div>
    <h1 class="title yiddish">
      <a :href="result.metadata?.url" target="_blank">{{
        result.metadata.title ?? result.docRef
      }}</a>
      <button
        @click="fixMetadata(result.docRef, 'title', result.metadata.title)"
        class="button is-small is-white"
      >
        <span class="icon is-small fa-2xs">
          <font-awesome-icon icon="pen-to-square" />
        </span>
      </button>
    </h1>
    <SingleResultItem
      :docRef="result.docRef"
      field="titleEnglish"
      :value="result.metadata.titleEnglish"
    />
    <SingleResultItem :docRef="result.docRef" :field="'author'" :value="result.metadata.author" />
    <SingleResultItem
      :docRef="result.docRef"
      field="authorEnglish"
      :value="result.metadata.authorEnglish"
    />
    <SingleResultItem
      :docRef="result.docRef"
      field="publicationYear"
      :value="result.metadata.publicationYear"
    />
    <SingleResultItem
      :docRef="result.docRef"
      field="publisher"
      :value="result.metadata.publisher"
    />
    <div>
      <strong>{{ $t('results.document-reference') }}&nbsp;</strong>
      {{ result.docRef }}
    </div>
    <DisplaySnippets
      :snippets="result.snippets"
      :docRef="result.docRef"
      :url="result.metadata.url"
    />
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { inject, defineProps } from 'vue'
import SingleResultItem from './SingleResultItem.vue'
import DisplaySnippets from '../../DisplaySnippets/DisplaySnippets.vue'

// Setup EventBus
const eventBus: any = inject('eventBus')
const fixMetadata = (docRef: string, field: string, value: string) => {
  console.log(`fixMetadata(${docRef}, ${field}, ${value})`)
  eventBus.emit('fixMetadata', [docRef, field, value])
}

defineProps(['result'])
</script>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>
