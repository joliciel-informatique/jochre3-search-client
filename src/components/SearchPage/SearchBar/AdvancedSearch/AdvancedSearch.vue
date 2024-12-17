<!-- AdvancedSearch
Parent: SearchPage.vue
Children: FindAuthors
Siblings: None

NOTES: Local implementation for fade transition based on https://www.telerik.com/blogs/how-to-trap-focus-modal-vue-3

Props: search, resetSearchResults, newSearch, sortBy, toYear, fromYear, title, docRefs
Variables: None
Methods: None

Description: the advanced search toolbox
-->
<template>
  <div class="advancedSearch is-flex is-justify-content-center">
    <div id="advancedSearchPanel" class="body m-3 p-3" v-show="showAdvancedSearchPanel">
      <div class="body-inner container is-max-desktop">
        <span class="columns is-vcentered mt-1 p-1">
          <p class="column is-2 is-flex has-text-white">
            {{ $t('search.author') }}
          </p>
          <span class="column dropdown" :aria-label="$t('search.author')">
            <span class="column field has-addons has-addons-left is-horizontal">
              <p
                class="control is-expanded"
                :class="{
                  'has-icons-left': preferences.displayLeftToRight,
                  'has-icons-right': !preferences.displayLeftToRight
                }"
              >
                <span
                  class="control icon is-small"
                  :class="{
                    'is-left': preferences.displayLeftToRight,
                    'is-right': !preferences.displayLeftToRight
                  }"
                  v-tooltip:bottom.tooltip="$t('search.excludeAuthors')"
                >
                  <input
                    type="checkbox"
                    class="is-clickable"
                    name="findAuthorCheckbox"
                    :disabled="disabled"
                    @click="excludeAuthors"
                    tabindex="0"
                  />
                </span>
                <input
                  id="advanced-search-authors"
                  type="text"
                  class="input"
                  lang="yi"
                  name="findAuthorInput"
                  v-model="authorText"
                  :disabled="disabled"
                  :placeholder="$t('search.authorPlaceholder')"
                  tabindex="0"
                />
              </p>
              <author-dropdown
                attach-to="advanced-search-authors"
                :allowMultiple="true"
                v-model:author-text="authorText"
                v-model:author-list="authorList"
              />
              <simple-key
                attach-to="advanced-search-authors"
                v-model:reference="authorText"
                @onEnter="() => emit('newSearch')"
              />
            </span>
          </span>
        </span>
        <span class="columns is-vcentered mt-1 p-1">
          <p class="column is-2 is-flex is-desktop is-flex-grow-1 has-text-white" id="searchTitle">
            {{ $t('search.title') }}
          </p>
          <span
            class="column is-flex is-desktop is-flex-grow-2 field has-addons has-addons-left is-horizontal"
          >
            <p class="control is-expanded">
              <input
                id="bookTitle"
                class="input"
                type="text"
                lang="yi"
                :placeholder="$t('search.title')"
                v-model="title"
                @keyup.enter="emit('newSearch')"
              />
            </p>
            <simple-key
              attach-to="bookTitle"
              v-model:reference="title"
              @onEnter="() => emit('newSearch')"
            />
          </span>
        </span>
        <span class="columns is-vcentered mt-1 p-1">
          <p class="column is-2 is-flex is-desktop is-flex-grow-1 has-text-white">
            {{ $t('search.document-reference') }}
          </p>
          <span
            class="column is-flex is-desktop is-flex-grow-2 field has-addons has-addons-left is-horizontal"
          >
            <input
              class="input"
              name="documentRefsInput"
              type="text"
              aria-label="document reference numbers"
              v-model="docRefs"
              :placeholder="$t('search.document-reference-placeholder')"
            />
          </span>
        </span>
        <span class="columns is-vcentered mt-1 p-1">
          <p
            class="column is-2 is-flex is-desktop is-flex-grow-1 has-text-white"
            id="searchDateFrom"
          >
            {{ $t('search.date-from') }}
          </p>
          <p class="column control is-2 has-text-centered">
            <input
              id="fromYear"
              aria-labelledby="searchDateFrom"
              class="input"
              type="number"
              placeholder="1700"
              v-model="fromYear"
              min="1700"
              max="2000"
            />
          </p>
          <p class="column has-text-centered has-text-white is-1 mr-1 ml-1" id="searchToYear">
            {{ $t('search.date-to') }}
          </p>
          <p class="column control is-2 has-text-centered">
            <input
              id="toYear"
              class="input control"
              aria-labelledby="searchToYear"
              type="number"
              placeholder="2000"
              v-model="toYear"
              min="1700"
              max="2000"
            />
          </p>
          <p class="column has-text-right has-text-white is-2 mr-1 ml-1" id="searchSortBy">
            {{ $t('search.sort-by') }}
          </p>
          <select
            class="column control select has-text-centered"
            name="sortBySelect"
            aria-labelledby="searchSortBy"
            v-model="sortBy"
          >
            <option value="Score">{{ $t('search.sort.score') }}</option>
            <option value="DateAscending">
              {{ $t('search.sort.date-ascending') }}
            </option>
            <option value="DateDescending">
              {{ $t('search.sort.date-descending') }}
            </option>
          </select>
        </span>
        <p class="has-text-warning">{{ $t('search.field-instructions') }}</p>
        <div
          class="field has-text-centered p-2 is-flex is-flex-direction-row is-justify-content-space-between"
        >
          <button
            class="button is-light"
            @click="emit('resetSearchResults')"
            @keyup.enter="emit('resetSearchResults')"
            tabindex="0"
          >
            {{ $t('search.reset') }}
          </button>
          <button
            class="button is-info"
            @click="runSearch()"
            @keyup.enter="runSearch()"
            tabindex="0"
          >
            {{ $t('search.search-button') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'
const preferences = usePreferencesStore()

const emit = defineEmits(['newSearch', 'resetSearchResults'])

const showAdvancedSearchPanel = defineModel('showAdvancedSearchPanel')
const authorList = defineModel<Array<{ label: string; count: number }>>('authorList')
const authorText = ref('')
const title = defineModel('title')
const fromYear = defineModel('fromYear')
const toYear = defineModel('toYear')
const docRefs = defineModel('docRefs')
const sortBy = defineModel('sortBy')
const facets: Ref = defineModel('facets')
const excludeFromSearch = defineModel('excludeFromSearch')
const disabled = computed(
  () => facets.value.filter((facet: { active: string }) => (facet.active ? facet : null)).length
)

const closeOnEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showAdvancedSearchPanel.value) showAdvancedSearchPanel.value = false
  document.removeEventListener('keyup', closeOnEscape, true)
}

onMounted(() => {
  window.addEventListener('keyup', closeOnEscape, true)
})

const excludeAuthors = () => (excludeFromSearch.value = !excludeFromSearch.value)

const runSearch = () => emit('newSearch')
</script>
