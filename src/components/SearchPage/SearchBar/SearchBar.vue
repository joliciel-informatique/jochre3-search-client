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
  <div id="searchBar" class="container is-max-desktop has-text-white has-text-weight-semibold">
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
            tabindex="0"
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
            v-if="!isLoading && query"
          >
            <font-awesome-icon icon="circle-xmark" />
          </span>
          <span class="icon is-small is-loading" aria-label="hidden" v-else></span>
        </p>
        <p class="control" tabindex="0">
          <button
            class="button is-clickable"
            @click.prevent="emit('newSearch')"
            :alt="$t('search.start-search')"
            :title="$t('search.start-search')"
          >
            <font-awesome-icon icon="magnifying-glass" />
          </button>
        </p>
        <simple-key
          attach-to="query"
          v-model:reference="query"
          @onEnter="() => emit('newSearch')"
        />
        <p class="control" v-tooltip:bottom.tooltip="$t('search.related-word-forms-tooltip')">
          <a id="strictSearchCheckboxBtn" class="button is-static is-clickable">
            <label for="strictSearchCheckbox" class="mx-2 is-clickable"
              ><span
                ><span class="is-hidden-mobile">{{ $t('search.related-word-forms') }}</span>
                <span class="px-2"
                  ><input
                    id="strictSearchCheckbox"
                    type="checkbox"
                    tabindex="0"
                    aria-label="strict search"
                    v-model="strict"
                    @change="emit('newSearch')" /></span></span
            ></label>
          </a>
        </p>
      </div>
    </div>
    <div
      class="py-2 is-flex is-flex-direction-row is-justify-content-space-between is-hidden-touch"
    >
      <span class="is-flex is-flex-direction-row">
        <a
          id="userGuideBtn"
          class="navbar-item"
          href="https://github.com/urieli/jochre/wiki/Jochre-Yiddish-Search-Help"
          target="_blank"
          tabindex="0"
        >
          <span>
            <font-awesome-icon icon="book-open" />
          </span>
          <span>
            {{ $t('search.user-guide') }}
          </span>
        </a>
        <a
          class="navbar-item"
          id="takeTheTourBtn"
          tabindex="0"
          @click.prevent="tour('#takeTheTourBtn')"
        >
          <span><font-awesome-icon id="takeTheTourIcon" icon="circle-info" /></span>
          <span>Take the tour</span>
        </a>
      </span>
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
import { useSearchStore } from '@/stores/SearchStore'
import { storeToRefs } from 'pinia'

import { useTourStore } from '@/stores/TourStore'
const { tour } = useTourStore()

const preferences = usePreferencesStore()
const { isLoading } = storeToRefs(useSearchStore())

const hasAdvancedSearchCriteria = defineModel('hasAdvancedSearchCriteria')

const query: Ref = defineModel('query')
const strict: Ref = defineModel('strict')
const showAdvancedSearchPanel = defineModel('showAdvancedSearchPanel')

const emit = defineEmits(['newSearch', 'resetSearchResults'])
</script>
