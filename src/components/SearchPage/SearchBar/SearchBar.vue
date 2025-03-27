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
  <div
    id="searchBar"
    class="container is-align-content-space-between is-max-desktop has-text-white has-text-weight-semibold"
  >
    <div class="is-flex is-flex-direction-row is-flex-grow-1">
      <div class="is-flex is-flex-direction-row is-flex-grow-1 pb-0 mb-0 field has-addons">
        <p class="control">
          <a id="searchBarLabel" class="button is-static is-hidden-mobile"
            >{{ $t('search.search') }}
          </a>
        </p>
        <p
          class="control is-expanded"
          :class="{
            'has-icons-left': !preferences.displayLeftToRight,
            'has-icons-right': preferences.displayLeftToRight
          }"
        >
          <input
            id="query"
            type="text"
            class="input is-normal is-rounded has-text-dark px-2"
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
            tabindex="0"
          />

          <span
            class="icon is-small is-clickable is-hidden-mobile"
            :class="{
              'is-left': !preferences.displayLeftToRight,
              'is-right': preferences.displayLeftToRight
            }"
            tabindex="0"
            aria-label="reset"
            @click="emit('resetSearchResults')"
            @keyup.enter="emit('resetSearchResults')"
            v-if="!isLoading && query"
          >
            <font-awesome-icon icon="circle-xmark" />
          </span>
          <span class="icon is-small is-loading" aria-label="hidden" v-else></span>
        </p>
        <p class="control" tabindex="0">
          <button
            class="button is-clickable px-2"
            @click.prevent="emit('newSearch')"
            :alt="$t('search.start-search')"
            :title="$t('search.start-search')"
          >
            <font-awesome-icon class="px-2" icon="magnifying-glass" />
          </button>
        </p>
        <simple-key
          attach-to="query"
          v-model:reference="query"
          @onEnter="() => emit('newSearch')"
        />
        <p class="control" v-tooltip:bottom.tooltip="$t('search.related-word-forms-tooltip')">
          <a class="button is-static is-clickable">
            <label for="strictSearchCheckbox" class="columns is-clickable">
              <span class="column is-hidden-mobile mr-2 is-align-items-self-center">{{
                $t('search.related-word-forms')
              }}</span>
              <input
                id="strictSearchCheckbox"
                type="checkbox"
                class="column is-vcentered"
                tabindex="0"
                aria-label="strict search"
                v-model="strict"
                @change="emit('newSearch')"
              />
            </label>
          </a>
        </p>
      </div>
    </div>
    <div
      class="py-2 is-flex is-flex-direction-row is-justify-content-space-between is-hidden-touch"
    >
      <a class="navbar-item" :href="$t('search.help-url')" target="_blank" tabindex="0">
        <span>
          <font-awesome-icon icon="book-open" />
          {{ $t('search.user-guide') }}
        </span>
      </a>
      <a
        id="advancedSearchBtn"
        class="navbar-item has-text-white is-flex-desktop"
        @click.prevent="showAdvancedSearchPanel = !showAdvancedSearchPanel"
        @keyup.enter="showAdvancedSearchPanel = !showAdvancedSearchPanel"
        @keyup.space="showAdvancedSearchPanel = !showAdvancedSearchPanel"
        tabindex="0"
      >
        <span>
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
        </span>
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

const emit = defineEmits(['newSearch', 'resetSearchResults'])
</script>
