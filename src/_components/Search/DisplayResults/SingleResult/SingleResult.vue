<!-- SingleResult
Parent: DisplayResults.vue
Children: SingleResultItem.vue, DisplaySnippets.vue
Siblings: None

Props: result
Variables: none
Methods: fixMetaData (imported)

Description: presents OCR record metadata
-->
<template>
  <div>
    <h1 class="title yiddish">
      <a :href="result.metadata?.url" target="_blank">{{
        result.metadata.title ?? result.docRef
      }}</a>
      <button @click="showFixMetaDataModal()" class="button is-small is-white">
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
    <SingleResultItem :docRef="result.docRef" field="author" :value="result.metadata.author" />
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
    <FixMetaData
      :docRef="result.docRef"
      field="title"
      :oldValue="result.metadata.title"
      :visibility="FixMetaDataVisible"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SingleResultItem from '@/_components/Search/DisplayResults/SingleResult/SingleResultItem.vue'
import DisplaySnippets from '@/_components/Search/DisplaySnippets/DisplaySnippets.vue'
import FixMetaData from '@/_components/Modals/FixMetaData/FixMetaData.vue'

const FixMetaDataVisible = ref(false)

const showFixMetaDataModal = () => {
  FixMetaDataVisible.value = true
}

defineProps(['result'])
</script>
