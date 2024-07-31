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
  <div class="block has-text-white custom-background has-text-weight-semibold m-0 p-0">
    <div class="container is-max-desktop">
      <div class="field has-addons pb-0 mb-0">
        <label for="query">{{ $t('search.search') }}</label>
        <p class="control has-icons-left">
          <input
            id="query"
            type="text"
            class="input is-normal keyboardInput"
            lang="yi"
            :placeholder="$t('search.query')"
            @keyup.enter="emit('search')"
            @change="
              ({ target }: Event) => {
                query = (target as HTMLInputElement).value
                emit('search')
              }
            "
          />
          <span class="icon is-small is-left is-clickable" :style="{ 'z-index': 'auto' }">
            <font-awesome-icon
              v-if="!showAdvancedSearchPanel"
              @click="emit('setShowAdvancedSearchPanel')"
              icon="magnifying-glass-plus"
            />
            <font-awesome-icon
              v-if="showAdvancedSearchPanel"
              @click="emit('setShowAdvancedSearchPanel')"
              icon="magnifying-glass-minus"
            />
          </span>
        </p>
        <div class="control column">
          <label class="checkbox is-large">
            <input type="checkbox" @change="emit('search')" />
            {{ $t('search.related-word-forms') }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlassPlus, faMagnifyingGlassMinus } from '@fortawesome/free-solid-svg-icons'
library.add(faMagnifyingGlassPlus, faMagnifyingGlassMinus)
const query = defineModel('query')
const showAdvancedSearchPanel = defineModel('showAdvancedSearchPanel')
const emit = defineEmits(['search', 'setShowAdvancedSearchPanel'])
</script>
