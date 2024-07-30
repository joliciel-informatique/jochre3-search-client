<!-- AdvancedSearch
Parent: SearchPage.vue
Children: FindAuthors
Siblings: None

Props: search, resetSearchResults, newSearch, sortBy, toYear, fromYear, title, docRefs
Variables: None
Methods: None

Description: presents the advanced search toolbox
-->
<template>
  <div class="pt-0 mt-0">
    <a @click="togglePanel">
      <span class="m-1">{{ $t('search.advanced') }}</span>
      <span class="icon is-small m-1">
        <font-awesome-icon v-if="!showAdvancedSearchPanel" icon="square-plus" />
        <font-awesome-icon v-if="showAdvancedSearchPanel" icon="square-minus" />
      </span>
    </a>
  </div>
  <div v-show="showAdvancedSearchPanel" class="box m-1 p-3">
    <div class="container is-max-desktop">
      <p>{{ $t('search.field-instructions') }}</p>
      <FindAuthors v-model:authorList="authorList" />
      <div class="grid has-addons">
        <label class="label">{{ $t('search.title') }}:</label>
        <input
          id="title"
          class="input keyboardInput"
          type="text"
          lang="yi"
          :placeholder="$t('search.title')"
          v-model="title"
          @keyup.enter="emit('search')"
        />
      </div>
      <div class="field has-addons">
        <label class="label">{{ $t('search.date-from') }}</label>
        <input
          id="fromYear"
          class="input"
          type="number"
          placeholder="1700"
          v-model="fromYear"
          min="1700"
          max="2000"
        />
        <label class="label">{{ $t('search.date-to') }}</label>
        <input
          id="toYear"
          class="input"
          type="number"
          placeholder="2000"
          v-model="toYear"
          min="1700"
          max="2000"
        />
      </div>
      <div class="field has-addons">
        <label class="label">{{ $t('search.document-reference') }}</label>
        <input class="input" type="text" v-model="docRefs" />
      </div>
      <div class="field has-addons">
        <label class="label">{{ $t('search.sort-by') }}</label>
        <div class="select">
          <select v-model="sortBy">
            <option value="Score">{{ $t('search.sort.score') }}</option>
            <option value="DateAscending">{{ $t('search.sort.date-ascending') }}</option>
            <option value="DateDescending">{{ $t('search.sort.date-descending') }}</option>
          </select>
        </div>
      </div>
      <div class="field has-text-centered p-2">
        <button class="button is-light" @click="emit('resetSearchResults')">
          {{ $t('search.reset') }}
        </button>
        &nbsp;
        <button class="button is-inverted" @click="emit('search')">
          {{ $t('search.search-button') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import FindAuthors from '@/_components/FindAuthors/FindAuthors.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emit = defineEmits(['search', 'resetSearchResults'])

const showAdvancedSearchPanel = defineModel('showAdvancedSearchPanel')
const authorList = defineModel<Array<{ label: string; count: number }>>('authorList')
const title = defineModel('title')
const fromYear = defineModel('fromYear')
const toYear = defineModel('toYear')
const docRefs = defineModel('docRefs')
const sortBy = defineModel('sortBy')

const togglePanel = () => {
  showAdvancedSearchPanel.value = !showAdvancedSearchPanel.value
}
</script>
