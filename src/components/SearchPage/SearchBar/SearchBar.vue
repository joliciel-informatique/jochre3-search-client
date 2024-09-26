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
          <a id="searchBarLabel" class="button is-info has-text-white is-static level-item">{{
            $t('search.search')
          }}</a>
        </p>
        <p class="control container has-icons-left has-icons-right">
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
            class="is-small icon is-clickable"
            aria-label="advanced search"
            :class="advancedSearchIcons"
            tabindex="0"
            @click="toggleAdvancedSearchPanel()"
            @keyup.enter="toggleAdvancedSearchPanel()"
          >
            <font-awesome-icon
              :icon="
                showAdvancedSearchPanel
                  ? faMagnifyingGlassMinus
                  : hasAdvancedSearchCriteria
                    ? faSliders
                    : faMagnifyingGlassPlus
              "
            />
          </span>
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
            class="button is-clickable is-medium is-info keyboardInputButton"
            aria-label="open onscreen Yiddish keyboard"
            vki-id="1"
            :alt="$t('search.keyboard')"
            :title="$t('search.keyboard')"
          >
            <font-awesome-icon icon="keyboard" />
          </button>
        </p>
        <p class="control" v-tooltip:bottom.tooltip="$t('search.related-word-forms-tooltip')">
          <a class="button is-info is-clickable">
            <label for="strictSearchCheckbox" class="mx-2 is-clickable">{{
              $t('search.related-word-forms')
            }}</label>
            <input
              id="strictSearchCheckbox"
              type="checkbox"
              aria-label="strict search"
              v-model="strict"
              @change="emit('newSearch')"
            />
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, type Ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faKeyboard,
  faXmarkCircle,
  faSliders
} from '@fortawesome/free-solid-svg-icons'
import { usePreferencesStore } from '@/stores/PreferencesStore'

const preferences = usePreferencesStore()

const hasAdvancedSearchCriteria = defineModel('hasAdvancedSearchCriteria')

const advancedSearchIcons = computed(() => ({
  'is-left': preferences.displayLeftToRight,
  'is-right': !preferences.displayLeftToRight,
  'is-clicked': hasAdvancedSearchCriteria.value
}))

library.add(faMagnifyingGlassPlus, faMagnifyingGlassMinus, faKeyboard, faXmarkCircle)
const query: Ref = defineModel('query')
const strict: Ref = defineModel('strict')
const isLoading = defineModel('isLoading')
const showAdvancedSearchPanel = defineModel('showAdvancedSearchPanel')

const toggleAdvancedSearchPanel = () => {
  showAdvancedSearchPanel.value = !showAdvancedSearchPanel.value
}

const emit = defineEmits(['newSearch', 'resetSearchResults'])
</script>
