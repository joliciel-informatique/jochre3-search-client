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
        class="body modal-card m-3 p-3"
        v-if="showAdvancedSearchPanel"
        @keydown.esc="showAdvancedSearchPanel = false"
      >
        <div class="body-inner container is-max-desktop">
          <span class="columns is-vcentered mt-1 p-1">
            <p class="column is-flex is-vcentered is-3">{{ $t('search.author') }}</p>
            <span class="column is-vcentered">
              <FindAuthors
                v-model:authorList="authorList"
                :label="$t('search.author')"
                :multivalue="true"
              />
            </span>
          </span>
          <span class="columns is-vcentered mt-1 p-1">
            <p class="column is-3 is-flex is-vcentered">{{ $t('search.title') }}</p>
            <span class="column field has-addons has-addons-left is-horizontal">
              <p class="control is-expanded">
                <input
                  id="title"
                  class="input keyboardInput"
                  vki-id="2"
                  type="text"
                  lang="yi"
                  :placeholder="$t('search.title')"
                  v-model="title"
                  @keyup.enter="emit('newSearch')"
                />
              </p>
              <p class="control">
                <button
                  class="button is-clickable is-medium is-info keyboardInputButton"
                  vki-id="2"
                  :alt="$t('search.keyboard')"
                  :title="$t('search.keyboard')"
                >
                  <font-awesome-icon icon="keyboard" />
                </button>
              </p>
            </span>
          </span>
          <span class="columns is-vcentered mt-1 p-1">
            <p class="column is-flex is-vcentered is-3">
              {{ $t('search.document-reference') }}
            </p>
            <span class="column field has-addons has-addons-left is-horizontal">
              <input
                class="input"
                type="text"
                v-model="docRefs"
                :placeholder="$t('search.document-reference-placeholder')"
              />
            </span>
          </span>
          <span class="columns is-vcentered mt-1 p-1">
            <p class="column is-flex is-vcentered is-3">{{ $t('search.date-from') }}</p>
            <p class="column control is-2 has-text-centered">
              <input
                id="fromYear"
                class="input"
                type="number"
                placeholder="1700"
                v-model="fromYear"
                min="1700"
                max="2000"
              />
            </p>
            <p class="column is-flex is-vcentered is-1">{{ $t('search.date-to') }}</p>
            <p class="column control is-2 has-text-centered">
              <input
                id="toYear"
                class="input control"
                type="number"
                placeholder="2000"
                v-model="toYear"
                min="1700"
                max="2000"
              />
            </p>
            <p class="column is-flex is-vcentered is-1">
              {{ $t('search.sort-by') }}
            </p>
            <select class="column control select" v-model="sortBy">
              <option value="Score">{{ $t('search.sort.score') }}</option>
              <option value="DateAscending">{{ $t('search.sort.date-ascending') }}</option>
              <option value="DateDescending">{{ $t('search.sort.date-descending') }}</option>
            </select>
          </span>
          <p class="has-text-info">{{ $t('search.field-instructions') }}</p>
          <div class="field has-text-centered p-2">
            <button class="button is-light" @click="emit('resetSearchResults')">
              {{ $t('search.reset') }}
            </button>
            &nbsp;
            <button class="button is-info" @click="emit('newSearch')">
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

const emit = defineEmits(['newSearch', 'resetSearchResults'])

const showAdvancedSearchPanel = defineModel('showAdvancedSearchPanel')
const authorList = defineModel<Array<{ label: string; count: number }>>('authorList')
const title = defineModel('title')
const fromYear = defineModel('fromYear')
const toYear = defineModel('toYear')
const docRefs = defineModel('docRefs')
const sortBy = defineModel('sortBy')

const beforeEnter = <Element,>(el: Element) => ((el as HTMLElement).style.height = '0')
const enter = <Element,>(el: Element) => ((el as HTMLElement).style.height = '100%')
const beforeLeave = <Element,>(el: Element) =>
  ((el as HTMLElement).style.height = `${(el as HTMLElement).scrollHeight}px`)
const leave = <Element,>(el: Element) => ((el as HTMLElement).style.height = '0')
</script>
