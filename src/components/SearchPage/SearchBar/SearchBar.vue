<!-- SearchBar
Parent: SearchPage.vue
Children: None
Siblings: None

Props: query, newSearch
Variables: None
Methods: None

Description: presents the search bar
-->
<template>
  <div id="searchBar" class="container is-max-desktop has-text-white has-text-weight-semibold p-1">
    <div class="">
      <div class="pb-0 mb-0 field has-addons">
        <p class="control">
          <a id="searchBarLabel" class="button is-static">{{ $t('search.search') }} </a>
        </p>
        <p
          class="control container"
          :class="{
            'has-icons-left': !preferences.displayLeftToRight,
            'has-icons-right': preferences.displayLeftToRight
          }"
        >
          <input
            id="query"
            type="text"
            class="input is-normal is-rounded"
            lang="yi"
            v-model="query"
            @keyup.enter="emit('newSearch')"
            @change="
              ({ target }: Event) => {
                query = (target as HTMLInputElement).value
                emit('newSearch')
              }
            "
            :placeholder="$t('search.query')"
          />
          <span
            class="icon is-small is-clickable"
            :class="{
              'is-left': !preferences.displayLeftToRight,
              'is-right': preferences.displayLeftToRight
            }"
            tabindex="0"
            aria-label="reset"
            @click="emit('resetSearchResults')"
            @keyup.enter="emit('resetSearchResults')"
            v-if="!isLoading"
          >
            <font-awesome-icon icon="circle-xmark" />
          </span>
          <span
            class="icon is-small is-loading"
            :class="{
              'is-left': !preferences.displayLeftToRight,
              'is-right': preferences.displayLeftToRight
            }"
            aria-label="hidden"
            v-else
          ></span>
        </p>
        <p class="control keyboardButton">
          <button
            class="button is-clickable"
            @click="toggleKeyboard('query')"
            :alt="$t('search.keyboard')"
            :title="$t('search.keyboard')"
          >
            <span>
              <font-awesome-icon icon="keyboard" />
            </span>
          </button>
        </p>
        <p class="control" v-tooltip:bottom.tooltip="$t('search.related-word-forms-tooltip')">
          <a class="button is-static is-clickable">
            <label for="strictSearchCheckbox" class="mx-2 is-clickable"
              ><span class="is-hidden-touch">{{ $t('search.related-word-forms') }}</span>
              <span
                ><input
                  id="strictSearchCheckbox"
                  type="checkbox"
                  aria-label="strict search"
                  v-model="strict"
                  @change="emit('newSearch')" /></span
            ></label>
          </a>
        </p>
      </div>
    </div>
    <div class="is-flex is-flex-direction-row is-justify-content-space-between is-hidden-touch">
      <a
        class="navbar-item has-text-white"
        href="https://github.com/urieli/jochre/wiki/Jochre-Yiddish-Search-Help"
        target="_blank"
      >
        <span>
          <font-awesome-icon icon="book-open" />
          {{ $t('search.user-guide') }}
        </span>
      </a>
      <a
        class="navbar-item has-text-white is-flex-desktop"
        @click.prevent="showAdvancedSearchPanel = !showAdvancedSearchPanel"
      >
        <font-awesome-icon
          :icon="
            showAdvancedSearchPanel
              ? 'magnifying-glass-minus'
              : hasAdvancedSearchCriteria
                ? 'sliders'
                : 'magnifying-glass-plus'
          "
        />
        {{ $t('search.advanced-search') }}
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { type Ref } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

const hasAdvancedSearchCriteria = defineModel('hasAdvancedSearchCriteria')

const query: Ref = defineModel('query')
const strict: Ref = defineModel('strict')
const isLoading = defineModel('isLoading')
const showAdvancedSearchPanel = defineModel('showAdvancedSearchPanel')
const simpleKeyboard: Ref = defineModel('simpleKeyboard')

const toggleAdvancedSearchPanel = () => {
  showAdvancedSearchPanel.value = !showAdvancedSearchPanel.value
}

const toggleKeyboard = (attachTo: string) => {
  simpleKeyboard.value.attachTo = attachTo
  simpleKeyboard.value.show = !simpleKeyboard.value.show
  simpleKeyboard.value.ref = query
}

const emit = defineEmits(['newSearch', 'resetSearchResults'])
</script>
