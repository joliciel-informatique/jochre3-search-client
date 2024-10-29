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
    <Transition
      name="advancedSearch"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div
        class="body m-3 p-3"
        v-show="showAdvancedSearchPanel"
        @keydown.esc="showAdvancedSearchPanel = false"
      >
        <div class="body-inner container is-max-desktop">
          <span class="columns is-vcentered mt-1 p-1">
            <p class="column is-flex is-vcentered is-2">
              {{ $t('search.author') }}
            </p>
            <span class="column is-vcentered" :aria-label="$t('search.author')">
              <FindAuthors
                v-model:authorList="authorList"
                v-model:disabled="disabled"
                v-model:exclude-from-search="excludeFromSearch"
                v-model:simple-keyboard="simpleKeyboard"
                :label="$t('search.author')"
                :multi-value="true"
                :show-exclude-checkbox="true"
                unique-id="advanced-search-find-authors"
              />
            </span>
          </span>
          <span class="columns is-vcentered mt-1 p-1">
            <p class="column is-2 is-flex is-vcentered" id="searchTitle">
              {{ $t('search.title') }}
            </p>
            <span class="column field has-addons has-addons-left is-horizontal">
              <p class="control is-expanded">
                <input
                  id="title"
                  class="input"
                  type="text"
                  lang="yi"
                  :placeholder="$t('search.title')"
                  v-model="title"
                  @keyup.enter="emit('newSearch')"
                />
              </p>
              <p class="control">
                <button
                  class="button is-clickable is-medium is-info"
                  @click="toggleKeyboard('title')"
                  :alt="$t('search.keyboard')"
                  :title="$t('search.keyboard')"
                >
                  <font-awesome-icon icon="keyboard" />
                </button>
              </p>
            </span>
          </span>
          <span class="columns is-vcentered mt-1 p-1">
            <p class="column is-flex is-vcentered is-2">
              {{ $t('search.document-reference') }}
            </p>
            <span class="column field has-addons has-addons-left is-horizontal">
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
            <p class="column is-flex is-vcentered is-2" id="searchDateFrom">
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
            <p class="column is-flex is-vcentered is-1 mr-1 ml-1" id="searchToYear">
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
            <p class="column is-flex is-vcentered is-2 mr-1 ml-1" id="searchSortBy">
              {{ $t('search.sort-by') }}
            </p>
            <select
              class="column control select"
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
          <div class="field has-text-centered p-2">
            <button class="button is-light" @click="emit('resetSearchResults')">
              {{ $t('search.reset') }}
            </button>
            &nbsp;
            <button class="button is-info" @click="runSearch()">
              {{ $t('search.search-button') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import FindAuthors from '@/_components/FindAuthors/FindAuthors.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed, type Ref } from 'vue'

const emit = defineEmits(['newSearch', 'resetSearchResults'])

const showAdvancedSearchPanel = defineModel('showAdvancedSearchPanel')
const authorList = defineModel<Array<{ label: string; count: number }>>('authorList')
const title = defineModel('title')
const fromYear = defineModel('fromYear')
const toYear = defineModel('toYear')
const docRefs = defineModel('docRefs')
const sortBy = defineModel('sortBy')
const facets: Ref = defineModel('facets')
const excludeFromSearch = defineModel('excludeFromSearch')
const simpleKeyboard: Ref = defineModel('simpleKeyboard')
const disabled = computed(
  () => facets.value.filter((facet: { active: string }) => (facet.active ? facet : null)).length
)

const toggleKeyboard = (attachTo: string) => {
  simpleKeyboard.value.attachTo = attachTo
  simpleKeyboard.value.show = !simpleKeyboard.value.show
}

const runSearch = () => {
  emit('newSearch')
}

const beforeEnter = <Element,>(el: Element) => ((el as HTMLElement).style.height = '0')
const enter = <Element,>(el: Element) => ((el as HTMLElement).style.height = '100%')
const beforeLeave = <Element,>(el: Element) =>
  ((el as HTMLElement).style.height = `${(el as HTMLElement).scrollHeight}px`)
const leave = <Element,>(el: Element) => ((el as HTMLElement).style.height = '0')
</script>
