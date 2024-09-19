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
          <a class="button is-static level-item">{{ $t('search.search') }}</a>
        </p>
        <p class="control container has-icons-left has-icons-right">
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
            :class="{
              icon: true,
              'is-small': true,
              'is-clickable': true,
              'is-left': preferences.displayLeftToRight,
              'is-right': !preferences.displayLeftToRight
            }"
            @click="emit('setShowAdvancedSearchPanel')"
          >
            <font-awesome-icon
              :icon="!showAdvancedSearchPanel ? 'magnifying-glass-plus' : 'magnifying-glass-minus'"
            />
          </span>
          <span
            :class="{
              icon: true,
              'is-small': true,
              'is-clickable': true,
              'is-left': !preferences.displayLeftToRight,
              'is-right': preferences.displayLeftToRight
            }"
            @click="emit('resetSearchResults')"
            v-if="!isLoading"
          >
            <font-awesome-icon icon="circle-xmark" />
          </span>
          <span
            :class="{
              icon: true,
              'is-small': true,
              'is-loading': true,
              'is-left': !preferences.displayLeftToRight,
              'is-right': preferences.displayLeftToRight
            }"
            v-else
          ></span>
        </p>
        <SimpleKeyboard
          :attach-to="'query'"
          v-model:value="query"
          v-model:open-keyboard="openKeyboard"
        />
        <p v-tooltip:bottom.tooltip="$t('search.related-word-forms-tooltip')">
          <a class="button is-info is-clickable">
            <label for="strictSearchCheckbox" class="mx-2 is-clickable">{{
              $t('search.related-word-forms')
            }}</label>
            <input
              id="strictSearchCheckbox"
              type="checkbox"
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
import type { Ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faKeyboard,
  faXmarkCircle
} from '@fortawesome/free-solid-svg-icons'
import { usePreferencesStore } from '@/stores/PreferencesStore'
import SimpleKeyboard from '@/_components/SimpleKeyboard/SimpleKeyboard.vue'

const preferences = usePreferencesStore()

library.add(faMagnifyingGlassPlus, faMagnifyingGlassMinus, faKeyboard, faXmarkCircle)
const query: Ref = defineModel('query')
const strict: Ref = defineModel('strict')
const isLoading = defineModel('isLoading')
const openKeyboard = defineModel('openKeyboard')
const showAdvancedSearchPanel = defineModel('showAdvancedSearchPanel')
const emit = defineEmits(['newSearch', 'resetSearchResults', 'setShowAdvancedSearchPanel'])
</script>
