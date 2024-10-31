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
  <div id="searchBar" class="block has-text-white has-text-weight-semibold p-1">
    <div class="container is-max-desktop">
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
            aria-labelledby="searchBarLabel"
            class="input is-normal is-rounded keyboardInput"
            vki-id="1"
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
        <p class="control">
          <button
            class="button keyboardInputButton"
            aria-label="open onscreen Yiddish keyboard"
            vki-id="1"
            :alt="$t('search.keyboard')"
            :title="$t('search.keyboard')"
          >
            <font-awesome-icon icon="keyboard" />
          </button>
        </p>
        <p class="control" v-tooltip:bottom.tooltip="$t('search.related-word-forms-tooltip')">
          <a class="button is-static is-clickable">
            <label for="strictSearchCheckbox" class="mx-2 is-clickable"
              >{{ $t('search.related-word-forms') }}
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
      <div class="columns py-3 field">
        <p class="column is-one-fifth control">
          <button @click="toggleAdvancedSearchPanel()">
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
          </button>
        </p>
        <p class="column is-one-fifth control">
          <a
            href="https://github.com/urieli/jochre/wiki/Jochre-Yiddish-Search-Help"
            target="_blank"
            class="has-text-white"
          >
            <span>
              <font-awesome-icon icon="book-open" />
              {{ $t('search.user-guide') }}
            </span>
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, type Ref } from 'vue'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

const hasAdvancedSearchCriteria = defineModel('hasAdvancedSearchCriteria')

const advancedSearchIcons = computed(() => ({
  'is-left': preferences.displayLeftToRight,
  'is-right': !preferences.displayLeftToRight,
  'is-clicked': hasAdvancedSearchCriteria.value
}))

const query: Ref = defineModel('query')
const strict: Ref = defineModel('strict')
const isLoading = defineModel('isLoading')
const showAdvancedSearchPanel = defineModel('showAdvancedSearchPanel')

const toggleAdvancedSearchPanel = () =>
  (showAdvancedSearchPanel.value = !showAdvancedSearchPanel.value)

const emit = defineEmits(['newSearch', 'resetSearchResults'])
</script>
